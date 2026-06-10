export default function NatalForm({ formData, handleChange }) {
  return (
    <>
    
      <div>
        <label className="block text-sm font-medium">Nama Acara</label>
        <input
          type="text"
          name="namaAcara"
          value={formData.namaAcara || ""}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        />
      </div>
    </>
  );
}
