export default function ArisanForm({ formData, handleChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-blue-700">Nama Grup Arisan</label>
      <input
        type="text"
        name="namaGrup"
        value={formData.namaGrup || ""}
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full"
        required
      />
    </div>
  );
}