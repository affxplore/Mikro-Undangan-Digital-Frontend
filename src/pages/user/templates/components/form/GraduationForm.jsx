export default function GraduationForm({ formData, handleChange }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-blue-700">Nama Wisudawan/ti</label>
        <input
          type="text"
          name="namaWisudawan"
          value={formData.namaWisudawan || ""}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700">Gelar / Jurusan (Opsional)</label>
        <input
          type="text"
          name="gelar"
          value={formData.gelar || ""}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        />
      </div>
    </>
  );
}