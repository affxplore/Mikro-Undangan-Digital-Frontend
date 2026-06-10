import React from "react";
import { Link } from "react-router-dom";

export default function EmptyState({ page, to }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <img src="/empty.png" alt="Empty" className="w-32 h-32 mb-4 opacity-50" />
      <h3 className="text-gray-500 text-lg mb-2">Belum Ada {page}</h3>
      <p className="text-sm text-gray-400 mb-4 text-center">
        Klik Tambah {page} Pilih Jenis {page} Isi Seluruh Data Klik Simpan Klik Preview
      </p>
      <Link to={to} className="bg-blue-500 text-white px-4 hover:bg-blue-700 py-2 rounded">Tambah {page}</Link>
    </div>
  );
}
