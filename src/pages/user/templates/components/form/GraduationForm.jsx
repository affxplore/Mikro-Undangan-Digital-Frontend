export default function GraduationForm({ formData, handleChange }) {
  return (
<<<<<<< HEAD
    <>
      <div>
        <label className="block text-sm font-medium text-blue-700">Nama Wisudawan/ti</label>
=======
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Wisudawan/ti</label>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
        <input
          type="text"
          name="namaWisudawan"
          value={formData.namaWisudawan || ""}
          onChange={handleChange}
<<<<<<< HEAD
          className="border rounded px-3 py-2 w-full"
=======
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
          placeholder="Nama Lengkap & Gelar"
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
          required
        />
      </div>
      <div>
<<<<<<< HEAD
        <label className="block text-sm font-medium text-blue-700">Gelar / Jurusan (Opsional)</label>
=======
        <label className="block text-sm font-semibold text-gray-700 mb-1">Gelar / Jurusan (Opsional)</label>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
        <input
          type="text"
          name="gelar"
          value={formData.gelar || ""}
          onChange={handleChange}
<<<<<<< HEAD
          className="border rounded px-3 py-2 w-full"
        />
      </div>
    </>
=======
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
          placeholder="Contoh: S.Kom - Teknik Informatika"
        />
      </div>
    </div>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
  );
}