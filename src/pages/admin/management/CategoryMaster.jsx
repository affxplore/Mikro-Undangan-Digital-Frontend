import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit, FaImage, FaTimes, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useCategories from "../../../api/categories/useCategories";
import Pagination from "../../../components/Pagination";
import apiService from "../../../api/apiService";

export default function KategoriPage() {
  const {
    data: categories,
    loading,
    pagination,
    getList,
    putUpdate,
    deleteCategory,
  } = useCategories();

  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [editPopup, setEditPopup] = useState({
    isOpen: false,
    category: null,
    name: "",
    iconPreview: null,
    iconFile: null,
  });
  const [templatesPopup, setTemplatesPopup] = useState({
    isOpen: false,
    categoryName: '',
    templates: [],
    isLoading: false,
  });

  useEffect(() => {
    getList();
  }, [getList]);

  const handleCategoryNameClick = async (category) => {
    setTemplatesPopup({
      isOpen: true,
      categoryName: category.name,
      templates: [],
      isLoading: true,
    });
    try {
      const response = await apiService.get(`/categories/${category.id}/templates`);
      setTemplatesPopup(prev => ({
        ...prev,
        templates: response.data.data,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Gagal mengambil data template:", error);
      alert("Gagal mengambil data template.");
      setTemplatesPopup({ isOpen: false, categoryName: '', templates: [], isLoading: false });
    }
  };

  const closeTemplatesPopup = () => {
    setTemplatesPopup({ isOpen: false, categoryName: '', templates: [], isLoading: false });
  };

  const handlePageChange = (newPage) => {
    getList({ page: newPage });
  };

  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);
    getList({ page: 1, limit: newLimit });
  };

  const handleSelect = (id) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === categories.length && categories.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(categories.map((c) => c.id)));
    }
  };
  
  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Yakin ingin menghapus ${selectedIds.size} kategori?`)) {
      try {
        await Promise.all(Array.from(selectedIds).map(id => deleteCategory(id)));
        setSelectedIds(new Set());
        getList(); 
        alert("Kategori terpilih berhasil dihapus.");
      } catch (error) {
        alert("Gagal menghapus kategori.");
      }
    }
  };

  const openEditPopup = (category) => {
    setEditPopup({
      isOpen: true,
      category: category,
      name: category.name,
      iconPreview: category.iconImg,
      iconFile: null,
    });
  };

  const closeEditPopup = () => {
    setEditPopup({ isOpen: false, category: null, name: "", iconPreview: null, iconFile: null });
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditPopup(prev => ({
        ...prev,
        iconFile: file,
        iconPreview: URL.createObjectURL(file),
      }));
    }
  };

const handleSaveEdit = async () => {
  const { category, name, iconFile } = editPopup;
  if (!name.trim()) {
    alert("Nama tidak boleh kosong.");
    return;
  }

  // Siapkan objek data biasa, BUKAN FormData
  const categoryData = {
    name: name,
    iconFile: iconFile, // Kirim file object
  };

  try {
    // Kirim objek data biasa, hook akan mengurus FormData
    await putUpdate(category.id, categoryData);
    alert("Kategori berhasil diperbarui")
    getList({ page: pagination.currentPage }); 
    closeEditPopup(); 
  } catch (error) {
    const msg = error.response?.data?.message || "Gagal memperbarui kategori.";
    alert(msg);
  }
};


  const isAllSelectedOnPage = categories.length > 0 && categories.every(item => selectedIds.has(item.id));

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200" title="Kembali">
          <FaArrowLeft className="text-gray-700 text-lg" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Kategori</h1>
          <p className="text-gray-500 text-sm mt-0.5">Pengelompokan item/layanan.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-2 shadow-md border border-slate-200 flex flex-col">
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto ml-auto mb-2">
          <button
            className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-indigo-400 hover:to-violet-500 text-white p-2 rounded-md shadow-lg flex items-center justify-center"
            onClick={() => navigate("addcategory")}
          >
            <FaPlus />
          </button>
          <button
            onClick={handleDeleteSelected}
            disabled={selectedIds.size === 0}
            className={`p-2 rounded-md shadow-lg flex items-center justify-center ${
              selectedIds.size === 0
                ? "bg-gray-300 cursor-not-allowed text-white"
                : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 text-white"
            }`}
          >
            <FaTrash />
          </button>
        </div>

        {loading && categories.length === 0 ? (
          <p className="text-center py-10">Loading...</p>
        ) : (
          <>
            <table className="w-full text-sm border-separate border-spacing-y-1">
              <thead>
                <tr className="uppercase text-xs tracking-wider bg-blue-500 text-white">
                  <th className="py-3 px-2 text-center">
                    <input type="checkbox" checked={isAllSelectedOnPage} onChange={handleSelectAll} />
                  </th>
                  <th className="py-3 px-2 text-center">#</th>
                  <th className="py-3 px-2 text-left">Img Icon</th>
                  <th className="py-3 px-2 text-left">Name</th>
                  <th className="pr-10 w-20 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((item, index) => (
                  <tr key={item.id} className="bg-slate-100 hover:bg-slate-200 transition-colors rounded-md">
                    <td className="px-2 py-3 text-center">
                      <input type="checkbox" checked={selectedIds.has(item.id)} onChange={() => handleSelect(item.id)} />
                    </td>
                    <td className="px-2 py-3 font-medium text-center">
                      {(pagination.currentPage - 1) * pagination.limit + index + 1}
                    </td>
                    <td className="px-2 py-3">
                      <img className="w-8 h-8 rounded-full object-cover shadow-sm" src={item.iconImg} alt={item.name} />
                    </td>
                    <td className="px-2 py-3 font-medium text-left">
                      <span onClick={() => handleCategoryNameClick(item)} className="cursor-pointer hover:underline text-blue-600">
                        {item.name}
                      </span>
                    </td>
                    <td className="px-2 py-3 flex gap-2 text-left">
                      <div onClick={() => openEditPopup(item)} className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 cursor-pointer transition">
                        <FaEdit className="text-blue-500 text-xs" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-gray-50 border-t">
              <div className="flex items-center gap-2 text-sm">
                <span>Tampilkan:</span>
                <select className="px-2 py-1 rounded-md border bg-white" value={pagination.limit || 10} onChange={handleLimitChange}>
                  {[10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <span className="text-gray-600">
                  Total: {pagination.totalRows || 0} • Halaman {pagination.currentPage || 1} / {pagination.totalPages || 1}
                </span>
              </div>
              <Pagination
                current={pagination.currentPage || 1}
                totalPages={pagination.totalPages || 1}
                onChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>

      {editPopup.isOpen && (
         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg shadow-lg p-6 w-80">
             <h2 className="text-lg font-semibold mb-4 text-blue-500">Edit Kategori</h2>
             <div className="mb-4 flex flex-col items-center gap-2">
               <img
                 src={editPopup.iconPreview}
                 alt="preview"
                 className="w-16 h-16 rounded-full object-cover border"
               />
               <label className="cursor-pointer flex items-center gap-2 text-blue-500">
                 <FaImage />
                 <span>Ganti Icon</span>
                 <input type="file" accept=".png, .jpg, .svg, .webp, image/png, image/jpeg, image/svg+xml, image/webp" onChange={handleIconChange} className="hidden" />
               </label>
             </div>
             <input
               type="text"
               value={editPopup.name}
               onChange={(e) => setEditPopup(prev => ({...prev, name: e.target.value}))}
               className="w-full border border-slate-300 rounded-md p-2 mb-4"
             />
             <div className="flex justify-end gap-2">
               <button
                 onClick={closeEditPopup}
                 className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
               >
                 Batal
               </button>
               <button
                 onClick={handleSaveEdit}
                 className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
               >
                 Simpan
               </button>
             </div>
           </div>
         </div>
      )}

      {templatesPopup.isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-blue-500">
                Template dalam Kategori "{templatesPopup.categoryName}"
              </h2>
              <button onClick={closeTemplatesPopup} className="p-1 rounded-full hover:bg-gray-200">
                <FaTimes className="text-gray-500" />
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {templatesPopup.isLoading ? (
                <p className="text-center text-gray-500">Memuat data template...</p>
              ) : templatesPopup.templates.length > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                  {templatesPopup.templates.map(template => (
                    <li key={template.id}>{template.title}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500">Tidak ada template yang menggunakan kategori ini.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};