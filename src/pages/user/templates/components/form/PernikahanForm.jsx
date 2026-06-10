export default function PernikahanForm({ formData, handleChange }) {
  return (
    <div className="space-y-4">
      <div>
        {/* Ubah text-blue-700 menjadi text-gray-700 */}
        <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Pria</label>
        <input
          type="text"
          name="namaPria"
          value={formData.namaPria || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Contoh: Budi Santoso"
          required
        />
      </div>
      <div>
        {/* Sama di sini, ubah jadi text-gray-700 */}
        <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Wanita</label>
        <input
          type="text"
          name="namaWanita"
          value={formData.namaWanita || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Contoh: Ani Wijaya"
          required
        />
      </div>
    </div>
  );
}