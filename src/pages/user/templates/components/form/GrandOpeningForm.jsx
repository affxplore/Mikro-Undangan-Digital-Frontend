export default function GrandOpeningForm({ formData, handleChange }) {
  return (
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
    </div>
  );
}