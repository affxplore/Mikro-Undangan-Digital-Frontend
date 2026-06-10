export default function SyukuranForm({ formData, handleChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-blue-700">Nama Penyelenggara / Keluarga</label>
      <input
        type="text"
        name="namaPenyelenggara"
        value={formData.namaPenyelenggara || ""}
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full"
        placeholder="Contoh: Keluarga Bpk. Budi"
        required
      />
    </div>
  );
}
