export default function AqiqahForm({ formData, handleChange }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-blue-700">Nama Anak</label>
        <input
          type="text"
          name="namaAnak"
          value={formData.namaAnak || ""}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700">Nama Orang Tua</label>
        <input
          type="text"
          name="namaOrangTua"
          value={formData.namaOrangTua || ""}
          className="border rounded px-3 py-2 w-full"
          placeholder="Contoh: Bpk. Budi & Ibu Citra"
        />
      </div>
    </>
  );
}