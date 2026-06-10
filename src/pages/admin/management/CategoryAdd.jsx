import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCategories from "../../../api/categories/useCategories";

const AddCategory = () => {
  const navigate = useNavigate();
  const { postCreate, loading } = useCategories();

  const [name, setName] = useState("");
  const [iconImgFile, setIconImgFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconImgFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !iconImgFile) {
      alert("Nama kategori dan ikon wajib diisi.");
      return;
    }

    // Kirim sebagai object biasa; hook akan membentuk FormData sendiri
    const payload = {
      name,
      iconFile: iconImgFile,
    };

    try {
      await postCreate(payload);
      alert("Kategori berhasil ditambahkan!");
      navigate("/dashboardadmin/datamaster/kategori"); // Kembali ke halaman daftar
    } catch (error) {
      alert("Gagal menambahkan kategori. Lihat konsol untuk detail.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-xl p-10 rounded-2xl border border-gray-200">
        <h2 className="text-2xl font-bold mb-8 text-blue-600">Add Category</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Nama Category</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-gray-100 text-gray-900 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Icon Image</label>
            <input
              type="file"
              accept=".png, .jpg, .jpeg, .svg, .webp, .image/png, .image/jpeg, .image/svg+xml, image/webp*"
              name="icon_img"
              onChange={handleFileChange}
              className="hidden"
              id="icon_img"
            />
            <label htmlFor="icon_img" className="block cursor-pointer">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="mt-2 w-[200px] h-[100px] object-contain rounded-md border"
                />
              ) : (
                <div className="w-[200px] h-[120px] text-center flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400 text-sm">
                  Click to upload Icon Image
                </div>
              )}
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 py-3 rounded-lg text-white font-bold hover:bg-blue-500 transition shadow-lg disabled:bg-gray-400"
            >
              {loading ? "Menyimpan..." : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
