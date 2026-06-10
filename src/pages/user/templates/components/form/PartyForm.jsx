export default function PartyForm({ formData, handleChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-blue-700">Judul Pesta / Nama Acara</label>
      <input
        type="text"
        name="namaPesta"
        value={formData.namaPesta || ""}
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full"
        placeholder="Contoh: Pesta Kebun Budi"
        required
      />
    </div>
  );
}