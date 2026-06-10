export default function NatalForm({ formData, handleChange }) {
  return (
<<<<<<< HEAD
    <>
    
      <div>
        <label className="block text-sm font-medium">Nama Acara</label>
=======
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1"> Nama Acara </label>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
        <input
          type="text"
          name="namaAcara"
          value={formData.namaAcara || ""}
          onChange={handleChange}
<<<<<<< HEAD
          className="border rounded px-3 py-2 w-full"
        />
      </div>
    </>
  );
}
=======
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
          placeholder="Contoh: Perayaan Natal Pemuda 2026"
          required
        />
      </div>
    </div>
  );
}
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
