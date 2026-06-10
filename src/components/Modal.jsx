import React, { useEffect, useRef } from "react";

// Definisikan kelas ukuran Tailwind CSS untuk berbagai prop size modal
const SIZE_CLASS = {
  sm: "max-w-sm",       // ~384px
  md: "max-w-md",       // ~448px
  lg: "max-w-lg",       // ~512px
  xl: "max-w-xl",       // ~576px
  "2xl": "max-w-2xl",   // ~672px
  "3xl": "max-w-3xl",   // ~768px
  "4xl": "max-w-4xl",   // ~896px
  "5xl": "max-w-5xl",   // ~1024px
  "6xl": "max-w-6xl",   // ~1152px
  "7xl": "max-w-7xl",   // ~1280px
  full: "max-w-[95vw]", // Lebar viewport 95%
  fullscreen: "max-w-[100vw] h-[100vh] md:h-[90vh] rounded-none", // Mode layar penuh
};

/**
 * Komponen Modal generik.
 *
 * @param {object} props - Properti komponen.
 * @param {boolean} props.open - Status Tampil/Sembunyi modal.
 * @param {string} props.title - Judul modal.
 * @param {Function} props.onClose - Fungsi callback saat modal ditutup.
 * @param {React.ReactNode} props.children - Konten isi modal.
 * @param {React.RefObject} [props.initialFocusRef] - Ref ke elemen yang akan difokus saat modal terbuka.
 * @param {keyof SIZE_CLASS} [props.size="4xl"] - Ukuran modal (default: "4xl").
 * @param {React.ReactNode} [props.footer] - Elemen React untuk ditampilkan di area footer modal.
 * @param {boolean} [props.closeOnOverlay=true] - Apakah klik overlay akan menutup modal.
 * @param {boolean} [props.hideClose=false] - Sembunyikan tombol close standar di header.
 */
function Modal({
  open,
  title,
  onClose,
  children,
  initialFocusRef,
  size = "4xl",
  footer,
  closeOnOverlay = true,
  hideClose = false,
}) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose); // Gunakan ref untuk memastikan callback selalu terbaru di event listener
  const hasFocusedRef = useRef(false);

  // Update ref callback jika prop onClose berubah
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Efek untuk menangani event listener keyboard (Escape) dan fokus awal
  useEffect(() => {
    if (!open) {
      hasFocusedRef.current = false; // Reset status fokus saat modal ditutup
      return;
    }

    // Handler penutupan modal dengan tombol Escape
    const onKey = (e) => {
      if (e.key === "Escape") {
        onCloseRef.current?.();
      }
    };
    window.addEventListener("keydown", onKey);

    // Logika untuk fokus otomatis pada elemen pertama yang interaktif
    if (!hasFocusedRef.current) {
      const target =
        initialFocusRef?.current || // Prioritaskan initialFocusRef jika ada
        dialogRef.current?.querySelector(
          // Cari elemen interaktif pertama di dalam modal
          "[data-autofocus], input, textarea, select, button, [contenteditable='true']"
        );
      target?.focus();
      hasFocusedRef.current = true;
    }

    // Cleanup event listener saat komponen unmount atau state open berubah
    return () => window.removeEventListener("keydown", onKey);
  }, [open, initialFocusRef]);

  // Jangan render apapun jika modal tidak terbuka
  if (!open) return null;

  // Handler untuk menutup modal saat area overlay (latar belakang) diklik
  const handleOverlayMouseDown = (e) => {
    if (e.target === e.currentTarget && closeOnOverlay) {
      onCloseRef.current?.();
    }
  };

  // Mencegah event klik di dalam konten modal menyebar ke overlay
  const stopPropagation = (e) => e.stopPropagation();

  // Tentukan kelas CSS berdasarkan prop size
  const sizeClass = SIZE_CLASS[size] || SIZE_CLASS["4xl"];
  const isFullscreen = size === "fullscreen";

  return (
    <div
      onMouseDown={handleOverlayMouseDown}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 md:p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        ref={dialogRef}
        onMouseDown={stopPropagation}
        className={[
          "w-[98%] md:w-auto bg-white shadow-2xl outline-none transition-all duration-200 ease-out",
          "flex flex-col", // Layout flex kolom (header, body, footer)
          isFullscreen ? "" : "rounded-2xl", // Terapkan border radius kecuali fullscreen
          sizeClass, // Terapkan kelas ukuran dinamis
          isFullscreen ? "max-h-[100vh]" : "max-h-[90vh]", // Batas tinggi modal
          "animate-[fadeIn_0.12s_ease-out]", // Animasi kemunculan modal
        ].join(" ")}
        tabIndex={-1} // Memungkinkan elemen div menerima fokus secara programatik
      >
        {/* Header Modal */}
        <div className="px-6 py-4 border-b sticky top-0 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 flex items-center justify-between z-10">
          <h2 id="modal-title" className="text-lg md:text-xl font-semibold text-gray-800">
            {title}
          </h2>
          {!hideClose && (
            <button
              onClick={() => onCloseRef.current?.()}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Tutup"
            >
              {/* Icon close (✕) */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Body Modal */}
        <div className="px-6 py-5 overflow-auto flex-1">
          {children}
        </div>

        {/* Footer Modal (Opsional) */}
        {footer && (
          <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-end gap-3 sticky bottom-0 z-10">
            {footer}
          </div>
        )}
      </div>

      {/* CSS Kustom untuk Animasi */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </div>
  );
}

export default Modal;