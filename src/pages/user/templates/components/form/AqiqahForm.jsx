export default function AqiqahForm({ formData, handleChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Anak</label>
        <input
          type="text"
          name="namaAnak"
          value={formData.namaAnak || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
          placeholder="Contoh: Muhammad Al-Fatih"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Orang Tua</label>
        <input
          type="text"
          name="namaOrangTua"
          value={formData.namaOrangTua || ""}
          onChange={handleChange} // Sebelumnya hilang
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
          placeholder="Contoh: Bpk. Budi & Ibu Citra"
          required
        />
      </div>
    </div>
  );
}