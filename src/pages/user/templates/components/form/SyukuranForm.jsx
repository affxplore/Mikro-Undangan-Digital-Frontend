export default function SyukuranForm({ formData, handleChange }) {
  return (
<<<<<<< HEAD
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
=======
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Penyelenggara / Keluarga</label>
        <input
          type="text"
          name="namaPenyelenggara"
          value={formData.namaPenyelenggara || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
          placeholder="Contoh: Keluarga Bpk. Budi"
          required
        />
      </div>
    </div>
  );
}
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
