export default function MeetingForm({ formData, handleChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-blue-700">Nama Perusahaan/Organisasi</label>
      <input type="text" name="namaPenyelenggara" value={formData.namaPenyelenggara || ""} onChange={handleChange} className="border rounded px-3 py-2 w-full" required />
    </div>
  );
}