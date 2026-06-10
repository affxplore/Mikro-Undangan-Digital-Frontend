// --- Import ---
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  FaTimes, FaEdit, FaPlus, FaTrash, FaExclamationTriangle, FaPalette,
  FaFileUpload, FaStar, FaCheckCircle, FaArrowUp, FaArrowDown,
  FaSyncAlt, FaChevronDown // Import ikon refresh
} from "react-icons/fa";

import { toast } from "react-toastify";
import useTemplates from "../../../api/templates/useTemplates";
import useCategories from "../../../api/categories/useCategories";
import { useNavigate } from "react-router-dom";
import AddFileModal from "./components/AddFileModal";
import EditFileModal from "./components/EditFileModal";
// Anda juga perlu modal untuk Edit, bisa menggunakan AddFileModal yang dimodifikasi

// Helper class name (diambil dari Manage_user.jsx untuk konsistensi)
const cls = (...a) => a.filter(Boolean).join(" ");



export default function ManageTemplate() {
  const { data: templateList, loading, pagination, getList, remove, update } = useTemplates();
  const { data: categoryList, getList: getCategoryList } = useCategories();
  const navigate = useNavigate();
 
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    category_id: '',
    label: '',
    sort: 'title:asc' // Format: 'field:direction'
  });

  // State baru untuk input search, digunakan untuk debounce
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false); // State untuk indikator refresh

  // --- State untuk Modal --- (Diperbarui)
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditChoiceModalOpen, setIsEditChoiceModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  // --- Efek dan Fetch Data ---
  const memoizedGetList = useCallback(getList, []);
  useEffect(() => {
    memoizedGetList(filters);
  }, [filters, memoizedGetList]);

  // Efek untuk menerapkan debounce pada input pencarian
  useEffect(() => {
    const timer = setTimeout(() => {
      // Hanya panggil API jika searchTerm berbeda dari filter yang ada
      if (searchTerm !== filters.search) {
        setFilters(prev => ({ ...prev, page: 1, search: searchTerm }));
      }
    }, 500); // Delay 500ms

    return () => clearTimeout(timer); // Cleanup timer pada setiap ketikan baru
  }, [searchTerm, filters.search]);

  useEffect(() => {
    getCategoryList({ limit: 999 });
  }, [getCategoryList]);

  // Efek untuk menutup dropdown kategori saat klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    }

    // Tambahkan event listener jika dropdown terbuka
    if (isCategoryDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCategoryDropdownOpen]);

  // --- Handler Refresh Data Post-CRUD ---
  const handleSuccess = () => {
    getList(filters); // Cukup panggil getList dengan filter saat ini
  };

  // --- Handler untuk menghapus satu template ---
  const handleDelete = (id, title) => {
    const deleteAction = () => {
      remove(id).then(() => {
        toast.success(`Template "${title}" berhasil dihapus!`);
        getList(filters); // Refresh
      }).catch(err => {
        toast.error("Gagal menghapus template.");
      });
    };

    const ConfirmToast = ({ closeToast }) => (
      <div className="flex flex-col gap-2">
        <p className="font-semibold">Konfirmasi Hapus</p>
        <p className="text-sm text-slate-600">Yakin ingin menghapus template <span className="font-bold">"{title}"</span>?</p>
        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={closeToast}
            className="px-3 py-1 text-sm rounded-md border border-slate-300 hover:bg-slate-100"
          >
            Batal
          </button>
          <button
            onClick={() => {
              deleteAction();
              closeToast();
            }}
            className="px-3 py-1 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    );

    toast.warn(<ConfirmToast />, {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      icon: <FaExclamationTriangle />,
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, page: 1, [key]: value }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  // --- Handler Refresh Data ---
  const handleRefresh = async () => {
    setIsRefreshing(true);
    const initialFilters = {
      page: 1,
      limit: 10,
      search: '',
      category_id: '',
      label: '',
      sort: 'title:asc'
    };
    setFilters(initialFilters);
    setSearchTerm(''); // Reset search term as well
    try {
      await getList(initialFilters);
    } catch (error) {
      toast.error("Gagal memuat ulang data template.");
    } finally {
      setIsRefreshing(false);
    }
  };

  // --- Komponen Modal Pilihan ---
  const ChoiceModal = () => {
    // --- Komponen Modal Pilihan (tidak berubah) ---
    if (!isChoiceModalOpen) return null;

    const handleStudioClick = () => {
      const url = "/admin/templates/edit/new";
      window.open(url, "_blank");
      setIsChoiceModalOpen(false);
    };

    const handleFileClick = () => {
      setIsChoiceModalOpen(false);
      setIsAddModalOpen(true); // Buka modal form upload
    };

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg relative">
          <button
            onClick={() => setIsChoiceModalOpen(false)}
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-slate-200"
          >
            <FaTimes />
          </button>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            Pilih Metode Pembuatan Template
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Opsi 1: Buat Desain */}
            <button
              onClick={handleStudioClick}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <FaPalette className="text-4xl text-blue-500 mb-3" />
              <span className="font-semibold text-slate-700">
                Buat Desain Template
              </span>
              <p className="text-xs text-slate-500 mt-1 text-center">
                Masuk ke studio untuk mendesain dari nol.
              </p>
            </button>

            {/* Opsi 2: Tambah File */}
            <button
              onClick={handleFileClick}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <FaFileUpload className="text-4xl text-green-500 mb-3" />
              <span className="font-semibold text-slate-700">
                Tambahkan File Template
              </span>
              <p className="text-xs text-slate-500 mt-1 text-center">
                Unggah file JSON/HTML dan isi form.
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- Komponen Modal Pilihan Edit ---
  const EditChoiceModal = () => {
    if (!isEditChoiceModalOpen || !templateToEdit) return null;

    const handleClose = () => {
      setIsEditChoiceModalOpen(false);
      setTemplateToEdit(null);
    };

    const handleStudioClick = () => {
      const url = `/admin/templates/edit/${templateToEdit.id}`;
      window.open(url, "_blank");
      handleClose();
    };

    const handleFileClick = () => {
      setIsEditChoiceModalOpen(false);
      setIsEditModalOpen(true); // Buka modal edit file, templateToEdit sudah di-set
    };

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg relative">
          <button onClick={handleClose} className="absolute top-3 right-3 p-2 rounded-full hover:bg-slate-200">
            <FaTimes />
          </button>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            Pilih Metode Edit
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button onClick={handleStudioClick} className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <FaPalette className="text-4xl text-blue-500 mb-3" />
              <span className="font-semibold text-slate-700">Edit Desain Template</span>
              <p className="text-xs text-slate-500 mt-1 text-center">Masuk ke studio untuk mengubah desain.</p>
            </button>
            <button onClick={handleFileClick} className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors">
              <FaEdit className="text-4xl text-yellow-500 mb-3" />
              <span className="font-semibold text-slate-700">Edit File & Detail</span>
              <p className="text-xs text-slate-500 mt-1 text-center">Ubah detail atau unggah file baru.</p>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 p-8">
      {/* ... Judul Halaman ... */}
      <h1 className="text-3xl font-bold text-slate-800">
        Manage Template
      </h1>
      <p className="text-slate-500 mb-6">
        Kelola Data Template yang tersedia di website
      </p>

      {/* Render Modal */}
      <ChoiceModal />
      <EditChoiceModal />
      <AddFileModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleSuccess}
        categoryList={categoryList}
      />
      <EditFileModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setTemplateToEdit(null); // Reset setelah modal ditutup
        }}
        onSuccess={handleSuccess}
        initialData={templateToEdit}
        categoryList={categoryList}
      />

      <div className="max-w-full mx-auto flex flex-col">
        <div className="lg:col-span-2 bg-white rounded-lg p-4 shadow-md border border-slate-200">
          {/* --- Top Controls (Filter dan Tombol Aksi) --- */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-3">
            {/* Filter inputs */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                type="text"
                placeholder="Search template..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-slate-300 rounded-md p-2 text-sm w-full sm:w-[245px]"
              />
              {/* Custom Category Dropdown */}
              <div className="relative w-full sm:w-40" ref={categoryDropdownRef}>
                <button
                  onClick={() => setIsCategoryDropdownOpen(prev => !prev)}
                  className="border border-slate-300 rounded-md p-2 text-sm w-full bg-white flex justify-between items-center text-left"
                >
                  <span className="truncate">
                    {categoryList.find(c => c.id == filters.category_id)?.name || 'Semua Kategori'}
                  </span>
                  <FaChevronDown className={`transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} size={12} />
                </button>
                {isCategoryDropdownOpen && (
                  <ul className="absolute top-full mt-1 w-full bg-white border border-slate-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                    <li
                      onClick={() => { handleFilterChange('category_id', ''); setIsCategoryDropdownOpen(false); }}
                      className="px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer"
                    >
                      Semua Kategori
                    </li>
                    {categoryList.map(cat => (
                      <li
                        key={cat.id}
                        onClick={() => { handleFilterChange('category_id', cat.id); setIsCategoryDropdownOpen(false); }}
                        className={`px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer ${filters.category_id == cat.id ? 'bg-blue-100 font-semibold' : ''}`}
                      >
                        {cat.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <select
                value={filters.label}
                onChange={(e) => handleFilterChange('label', e.target.value)}
                className="border border-slate-300 rounded-md p-2 text-sm w-full sm:w-36 bg-white"
              >
                <option value="">Semua Label</option>
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="border border-slate-300 rounded-md p-2 text-sm w-full sm:w-40 bg-white"
              >
                <option value="title:asc">Nama (A-Z)</option>
                <option value="title:desc">Nama (Z-A)</option>
                <option value="createdAt:desc">Terbaru</option>
                <option value="createdAt:asc">Terlama</option>
              </select>
            </div>
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Tombol Refresh */}
              <button
                onClick={handleRefresh}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                title="Reload Data"
                disabled={loading || isRefreshing}
              >
                <FaSyncAlt size={16} className={cls(isRefreshing && "animate-spin")} />
              </button>
              <button
                onClick={() => setIsChoiceModalOpen(true)}
                className="px-4 py-2 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white font-semibold"
              >
                <FaPlus />
                <span>Tambah Template</span>
              </button>
            </div>
          </div>

          {/* --- Table --- */}
          <div className="overflow-x-auto">
            {/* ... (thead tidak berubah) ... */}
            <table className="w-full text-sm border-separate border-spacing-y-1 min-w-[1000px]">
              <thead>
                <tr className="uppercase text-xs tracking-wider bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <th className="py-3 px-2 text-left w-12">#</th>
                  <th className="py-3 pl-6 px-2 text-left w-24">Img</th>
                  <th className="py-3 px-2 text-left w-40">Name</th>
                  <th className="py-3 px-2 text-left w-32">Category</th>
                  <th className="py-3 px-2 text-left w-24">Label</th>
                  <th className="py-3 px-2 text-left min-w-[200px]">
                    Description
                  </th>
                  <th className="w-20 text-center pr-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10">
                      Loading data...
                    </td>
                  </tr>
                ) : templateList.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-gray-500">
                      No templates found.
                    </td>
                  </tr>
                ) : (
                  templateList.map((item, index) => (
                    <tr
                      key={item.id}
                      className="bg-slate-100 hover:bg-slate-200 transition-colors rounded-md"
                    >
                      {/* ... (td untuk nomor, img, name, category, label) ... */}
                      <td className="px-2 py-3 font-medium text-center">
                        {(pagination?.offset || 0) + index + 1}
                      </td>
                      <td className="px-2 py-3 pl-6">
                        {/* 4. Tampilkan previewUrl jika itu gambar, atau ikon jika bukan */}
                        {item.previewUrl ? (
                          item.previewUrl.endsWith(".html") ||
                          item.previewUrl.endsWith(".json") ? (
                          <span className="text-xs font-mono bg-slate-200 px-2 py-1 rounded">
                            {item.previewUrl.endsWith(".html")
                              ? "HTML"
                              : "JSON"}
                          </span>
                        ) : (
                          <img
                            className="w-16 h-8 rounded-md object-cover shadow-sm"
                            src={item.previewUrl || null} // Pass null if previewUrl is an empty string
                            alt={item.title}
                          />
                        )) : (<div className="w-16 h-8 rounded-md bg-slate-200 flex items-center justify-center text-xs text-slate-500">No Img</div>)}
                      </td>
                      <td
                        className="px-2 py-3 font-medium text-blue-600 hover:underline cursor-pointer"
                        title={item.title}
                      >
                        {item.title}
                      </td>
                      <td className="px-2 py-3 capitalize">
                        {item.category?.name}
                      </td>
                      <td className="px-2 py-3">
                        {item.label === "premium" ? (
                          <span className="flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">
                            <FaStar className="text-amber-500" />
                            <span>Premium</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full">
                            <FaCheckCircle className="text-green-500" />
                            <span>Free</span>
                          </span>
                        )}
                      </td>
                      <td className="px-2 py-3">
                        <span title={item.description} className="truncate block max-w-xs">
                          {item.description}
                        </span>
                      </td>
                      <td className="px-2 py-3 flex gap-2 justify-center">
                        <button
                          onClick={() => {
                            setTemplateToEdit(item);
                            setIsEditChoiceModalOpen(true);
                          }}
                          title="Edit Template"
                          className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center hover:bg-yellow-200 cursor-pointer transition"
                        ><FaEdit className="text-yellow-600 text-xs" /></button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          title="Delete Template"
                          className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 cursor-pointer transition"
                        >
                          <FaTrash className="text-red-500 text-xs" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* --- Pagination --- */}
          {pagination?.totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                Prev
              </button>
              <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
