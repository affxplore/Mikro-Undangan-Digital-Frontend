export default function KhitananForm({ formData, handleChange }) {
  return (
<<<<<<< HEAD
    <>
      <div>
        <label className="block text-sm font-medium text-blue-700">Nama Anak</label>
=======
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1"> Nama Anak </label>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
        <input
          type="text"
          name="namaAnak"
          value={formData.namaAnak || ""}
          onChange={handleChange}
<<<<<<< HEAD
          className="border rounded px-3 py-2 w-full"
=======
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
          placeholder="Contoh: Ahmad Raihan"
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
          required
        />
      </div>
      <div>
<<<<<<< HEAD
        <label className="block text-sm font-medium text-blue-700">Nama Orang Tua</label>
=======
        <label className="block text-sm font-semibold text-gray-700 mb-1"> Nama Orang Tua </label>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
        <input
          type="text"
          name="namaOrangTua"
          value={formData.namaOrangTua || ""}
<<<<<<< HEAD
          className="border rounded px-3 py-2 w-full"
          placeholder="Contoh: Bpk. Budi & Ibu Citra"
        />
      </div>
    </>
=======
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
          placeholder="Contoh: Bpk. Budi & Ibu Citra"
          required
        />
      </div>
    </div>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
  );
}