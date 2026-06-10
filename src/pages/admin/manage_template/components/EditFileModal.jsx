import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaChevronDown } from "react-icons/fa";
import { toast } from "react-toastify";
import useTemplates from "../../../../api/templates/useTemplates";

const EditFileModal = ({ isOpen, onClose, onSuccess, categoryList, initialData }) => {
  const { update, loading } = useTemplates();
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    category_id: "",
    label: "",
  });
  const [files, setFiles] = useState({
    templateFile: null,
    previewImage: null,
  });
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);


  useEffect(() => {
    if (initialData) {
      setFormState({
        title: initialData.title || "",
        description: initialData.description || "",
        category_id: initialData.category_id || "",
        label: initialData.label || "",
      });
      // Reset file inputs setiap kali modal dibuka
      setFiles({ templateFile: null, previewImage: null });
    }
  }, [initialData]);

  // Efek untuk menutup dropdown kategori saat klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    }

    if (isCategoryDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCategoryDropdownOpen]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: newFiles } = e.target;
    setFiles((prev) => ({ ...prev, [name]: newFiles[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!initialData?.id) return;

    const formData = new FormData();
    formData.append("title", formState.title);
    formData.append("description", formState.description);
    formData.append("category_id", formState.category_id);
    formData.append("label", formState.label.toLowerCase());
    
    // --- METHOD SPOOFING ---
    formData.append("_method", "PUT"); // Add this line to tell the backend to treat this as a PUT request

    if (files.templateFile) {
      formData.append("thumbnail_file", files.templateFile);
    }
    if (files.previewImage) {
      formData.append("thumbnail_image", files.previewImage);
    }

    try {
      await update(initialData.id, formData);
      toast.success("Template berhasil diperbarui!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Gagal memperbarui template:", error);
      toast.error(error.response?.data?.message || "Gagal memperbarui template.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Edit Detail Template</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Template</label>
            <input name="title" value={formState.title} onChange={handleInputChange} placeholder="Nama Template" className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Template</label>
            <textarea name="description" value={formState.description} onChange={handleInputChange} placeholder="Deskripsi Template" className="w-full p-2 border rounded" rows="3" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
              {/* Custom Category Dropdown */}
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsCategoryDropdownOpen(prev => !prev)}
                  className="border border-slate-300 rounded-md p-2 text-sm w-full bg-white flex justify-between items-center text-left"
                >
                  <span className="truncate">
                    {(categoryList || []).find(c => c.id == formState.category_id)?.name || 'Pilih Kategori'}
                  </span>
                  <FaChevronDown className={`transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} size={12} />
                </button>
                {isCategoryDropdownOpen && (
                  <ul className="absolute top-full mt-1 w-full bg-white border border-slate-300 rounded-md shadow-lg z-20 max-h-48 overflow-y-auto">
                    <li
                      onClick={() => { handleInputChange({ target: { name: 'category_id', value: '' } }); setIsCategoryDropdownOpen(false); }}
                      className="px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer"
                    >
                      Pilih Kategori
                    </li>
                    {(categoryList || []).map(cat => (
                      <li
                        key={cat.id}
                        onClick={() => { handleInputChange({ target: { name: 'category_id', value: cat.id } }); setIsCategoryDropdownOpen(false); }}
                        className={`px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer ${formState.category_id == cat.id ? 'bg-blue-100 font-semibold' : ''}`}
                      >
                        {cat.name}
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Ganti File Template (JSON) <span className="text-xs text-slate-500">(Opsional)</span></label>
            <input type="file" name="templateFile" onChange={handleFileChange} accept=".json" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            {initialData?.fileUrl && !files.templateFile && (
              <div className="mt-2 text-xs text-slate-500">
                File saat ini: <a href={initialData.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{initialData.fileUrl.split('/').pop()}</a>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ganti Gambar Pratinjau (HTML, PNG) <span className="text-xs text-slate-500">(Opsional)</span></label>
            <input type="file" name="previewImage" onChange={handleFileChange} accept=".html,.png" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
            {initialData?.previewUrl && !files.previewImage && (
              <div className="mt-2 text-xs text-slate-500">
                File saat ini: <a href={initialData.previewUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{initialData.previewUrl.split('/').pop()}</a>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-md">Batal</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-300">{loading ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFileModal;