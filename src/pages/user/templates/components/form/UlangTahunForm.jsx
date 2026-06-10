export default function UlangTahunForm({ formData, handleChange }) {
  return (
<<<<<<< HEAD
    <>
      <div>
        <label className="block text-sm font-medium text-blue-700">Nama (Yang Berulang Tahun / Acara)</label>
=======
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Nama (Yang Berulang Tahun / Acara)</label>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
        <input
          type="text"
          name="namaPerayaan"
          value={formData.namaPerayaan || ""}
          onChange={handleChange}
<<<<<<< HEAD
          className="border rounded px-3 py-2 w-full"
=======
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
          placeholder="Contoh: Keisha Putri"
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
          required
        />
      </div>
      <div>
<<<<<<< HEAD
        <label className="block text-sm font-medium text-blue-700">Ulang Tahun Ke (Opsional)</label>
=======
        <label className="block text-sm font-semibold text-gray-700 mb-1">Ulang Tahun Ke (Opsional)</label>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
        <input
          type="number"
          name="ulangTahunKe"
          value={formData.ulangTahunKe || ""}
          onChange={handleChange}
<<<<<<< HEAD
          className="border rounded px-3 py-2 w-full"
        />
      </div>
    </>
=======
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
          placeholder="Contoh: 17"
        />
      </div>
    </div>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
  );
}