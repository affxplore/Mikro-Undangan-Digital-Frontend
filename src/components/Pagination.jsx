import React from "react";

// Helper sederhana untuk menggabungkan class name secara kondisional
const cls = (...a) => a.filter(Boolean).join(" ");

export default function Pagination({ current, totalPages, onChange }) {
  const maxButtons = 7; // Jumlah tombol nomor maksimal yang ditampilkan
  const pages = [];
  const half = Math.floor(maxButtons / 2);

  let start = Math.max(1, current - half);
  let end = Math.min(totalPages, start + maxButtons - 1);

  if (end - start + 1 < maxButtons) {
    start = Math.max(1, end - maxButtons + 1);
  }

  for (let p = start; p <= end; p++) {
    pages.push(p);
  }

  // Jangan tampilkan komponen paginasi jika hanya ada satu halaman atau kurang
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      <button
        className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white disabled:opacity-50"
        disabled={current <= 1}
        onClick={() => onChange(1)}
      >
        {"<<"}
      </button>
      <button
        className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white disabled:opacity-50"
        disabled={current <= 1}
        onClick={() => onChange(current - 1)}
      >
        {"<"}
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={cls(
            "px-3 py-1.5 rounded-xl border",
            p === current
              ? "bg-blue-500 text-white border-blue-500"
              : "border-neutral-300 bg-white"
          )}
        >
          {p}
        </button>
      ))}

      <button
        className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white disabled:opacity-50"
        disabled={current >= totalPages}
        onClick={() => onChange(current + 1)}
      >
        {">"}
      </button>
      <button
        className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white disabled:opacity-50"
        disabled={current >= totalPages}
        onClick={() => onChange(totalPages)}
      >
        {">>"}
      </button>
    </div>
  );
}