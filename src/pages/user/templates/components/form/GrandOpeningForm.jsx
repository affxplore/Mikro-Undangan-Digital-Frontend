export default function GrandOpeningForm({ formData, handleChange }) {
  return (
<<<<<<< HEAD
    <div>
      <label className="block text-sm font-medium text-blue-700">Nama Usaha/Toko</label>
      <input type="text" name="namaUsaha" value={formData.namaUsaha || ""} onChange={handleChange} className="border rounded px-3 py-2 w-full" required />
=======
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1"> Nama Usaha/Toko </label>
        <input 
          type="text" 
          name="namaUsaha" 
          value={formData.namaUsaha || ""} 
          onChange={handleChange} 
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400" 
          placeholder="Contoh: Coffee Shop Sejahtera"
          required 
        />
      </div>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
    </div>
  );
}