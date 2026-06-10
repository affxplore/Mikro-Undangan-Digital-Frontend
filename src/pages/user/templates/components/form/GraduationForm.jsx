export default function GraduationForm({ formData, handleChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Wisudawan/ti</label>
        <input
          type="text"
          name="namaWisudawan"
          value={formData.namaWisudawan || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
          placeholder="Nama Lengkap & Gelar"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Gelar / Jurusan (Opsional)</label>
        <input
          type="text"
          name="gelar"
          value={formData.gelar || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
          placeholder="Contoh: S.Kom - Teknik Informatika"
        />
      </div>
    </div>
  );
}