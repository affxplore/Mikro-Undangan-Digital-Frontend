export default function PernikahanForm({ formData, handleChange }) {
  return (
<<<<<<< HEAD
    <>
      <div>
        <label className="block text-sm font-medium text-blue-700">Nama Pria</label>
=======
    <div className="space-y-4">
      <div>
        {/* Ubah text-blue-700 menjadi text-gray-700 */}
        <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Pria</label>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
        <input
          type="text"
          name="namaPria"
          value={formData.namaPria || ""}
          onChange={handleChange}
<<<<<<< HEAD
          className="border rounded px-3 py-2 w-full"
=======
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Contoh: Budi Santoso"
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
          required
        />
      </div>
      <div>
<<<<<<< HEAD
        <label className="block text-sm font-medium text-blue-700">Nama Wanita</label>
=======
        {/* Sama di sini, ubah jadi text-gray-700 */}
        <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Wanita</label>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
        <input
          type="text"
          name="namaWanita"
          value={formData.namaWanita || ""}
          onChange={handleChange}
<<<<<<< HEAD
          className="border rounded px-3 py-2 w-full"
          required
        />
      </div>
    </>
=======
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Contoh: Ani Wijaya"
          required
        />
      </div>
    </div>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
  );
}