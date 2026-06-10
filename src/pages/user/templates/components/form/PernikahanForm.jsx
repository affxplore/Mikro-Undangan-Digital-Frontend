export default function PernikahanForm({ formData, handleChange }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-blue-700">Nama Pria</label>
        <input
          type="text"
          name="namaPria"
          value={formData.namaPria || ""}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700">Nama Wanita</label>
        <input
          type="text"
          name="namaWanita"
          value={formData.namaWanita || ""}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
          required
        />
      </div>
    </>
  );
}