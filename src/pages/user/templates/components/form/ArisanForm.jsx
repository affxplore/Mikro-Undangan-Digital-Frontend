export default function ArisanForm({ formData, handleChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Grup Arisan</label>
        <input
          type="text"
          name="namaGrup"
          value={formData.namaGrup || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
          placeholder="Contoh: Arisan Ceria Keluarga"
          required
        />
      </div>
    </div>
  );
}