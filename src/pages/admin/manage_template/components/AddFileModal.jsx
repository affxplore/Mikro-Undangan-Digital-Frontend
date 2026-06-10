import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaChevronDown } from "react-icons/fa";
import { toast } from "react-toastify";
import useTemplates from "../../../../api/templates/useTemplates";

const AddFileModal = ({ isOpen, onClose, onSuccess, categoryList }) => {
  const { create, loading } = useTemplates();
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    templateFile: null,
    previewImage: null,
    category_id: "",
    label: "",
  });

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormState((prev) => ({ ...prev, [name]: files[0] }));
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.templateFile) {
      toast.error("File template (.json) wajib diisi.");
      return;
    }

    const formData = new FormData();
    formData.append("title", formState.title);
    formData.append("description", formState.description);
    formData.append("category_id", formState.category_id);
    formData.append("label", formState.label.toLowerCase());

    // --- PASTIKAN NAMA FIELD SESUAI DENGAN BACKEND ---
    // Backend mengharapkan 'thumbnail_file' untuk file JSON
    formData.append("thumbnail_file", formState.templateFile); 
    
    if (formState.previewImage) {
      // Backend mengharapkan 'thumbnail_image' untuk file gambar
      formData.append("thumbnail_image", formState.previewImage);
    }

    // --- LOGGING DITAMBAHKAN DI SINI ---
    console.log("Data yang akan dikirim ke API:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ', pair[1]);
    }

    try {
      await create(formData);
      toast.success("Template berhasil ditambahkan!");
      onSuccess(); // Panggil callback untuk refresh list
      onClose(); // Tutup modal
    } catch (error) {
      console.error("Gagal menambahkan template:", error);
      // Log yang lebih detail untuk debugging
      if (error.response) {
        console.error("Server Response:", error.response.data);
      }
      let errorMessage = "Gagal menambahkan template.";
      if (error.response?.status === 403) {
        errorMessage = "Anda tidak memiliki izin untuk menambahkan template.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Tambah Template dari File</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Template</label>
            <input name="title" onChange={handleInputChange} placeholder="Nama Template" className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Template</label>
            <textarea name="description" onChange={handleInputChange} placeholder="Deskripsi Template" className="w-full p-2 border rounded" rows="3" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Kategori
              </label>
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsCategoryDropdownOpen(prev => !prev)}
                  className="border border-slate-300 rounded-md p-2 text-sm text-left w-full flex justify-between items-center bg-white"
                >
                  <span className="truncate">
                    {(categoryList.find(c => c.id === formState.category_id)?.name) || "Pilih Kategori"}
                  </span>
                  <FaChevronDown className={`transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} size={12} />
                </button>
                {isCategoryDropdownOpen && (
                  <ul className="absolute z-20 mt-1 w-full bg-white border border-slate-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    <li
                      onClick={() => {
                        setFormState(prev => ({ ...prev, category_id: "" }));
                        setIsCategoryDropdownOpen(false);
                      }}
                      className="px-4 py-2 text-sm hover:bg-slate-100 cursor-pointer"
                    >
                      Pilih Kategori
                    </li>
                    {(categoryList || []).map((category) => (
                      <li
                        key={category.id}
                        onClick={() => {
                          setFormState(prev => ({ ...prev, category_id: category.id }));
                          setIsCategoryDropdownOpen(false);
                        }}
                        className={`px-4 py-2 text-sm hover:bg-slate-100 cursor-pointer truncate ${
                          formState.category_id === category.id ? "bg-blue-50 font-semibold" : ""
                        }`}
                      >
                        {category.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Label</label>
              <select name="label" value={formState.label} onChange={handleInputChange} className="w-full p-2 border rounded bg-white" required>
                <option value="" disabled>Pilih Label</option>
                <option value="premium">Premium</option>
                <option value="free">Free</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">File Template (JSON)</label>
            <input type="file" name="templateFile" onChange={handleFileChange} accept=".json" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Gambar Pratinjau (HTML, PNG)</label>
            <input type="file" name="previewImage" onChange={handleFileChange} accept=".html,.png" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-md">Batal</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-300">{loading ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFileModal;