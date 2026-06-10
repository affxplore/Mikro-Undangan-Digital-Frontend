export default function UlangTahunForm({ formData, handleChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Nama (Yang Berulang Tahun / Acara)</label>
        <input
          type="text"
          name="namaPerayaan"
          value={formData.namaPerayaan || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
          placeholder="Contoh: Keisha Putri"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Ulang Tahun Ke (Opsional)</label>
        <input
          type="number"
          name="ulangTahunKe"
          value={formData.ulangTahunKe || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
          placeholder="Contoh: 17"
        />
      </div>
    </div>
  );
}