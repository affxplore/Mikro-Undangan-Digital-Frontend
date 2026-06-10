export default function UlangTahunForm({ formData, handleChange }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-blue-700">Nama (Yang Berulang Tahun / Acara)</label>
        <input
          type="text"
          name="namaPerayaan"
          value={formData.namaPerayaan || ""}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-700">Ulang Tahun Ke (Opsional)</label>
        <input
          type="number"
          name="ulangTahunKe"
          value={formData.ulangTahunKe || ""}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        />
      </div>
    </>
  );
}