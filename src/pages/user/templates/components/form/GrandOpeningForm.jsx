export default function GrandOpeningForm({ formData, handleChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-blue-700">Nama Usaha/Toko</label>
      <input type="text" name="namaUsaha" value={formData.namaUsaha || ""} onChange={handleChange} className="border rounded px-3 py-2 w-full" required />
    </div>
  );
}