import React from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";

const VARIANT_STYLES = {
  danger: {
    accent: "from-rose-500 via-red-500 to-orange-500",
    iconRing: "bg-rose-100 text-rose-600",
    confirm: "bg-rose-600 hover:bg-rose-500 text-white shadow-[0_10px_30px_-12px_rgba(244,63,94,0.9)]",
    confirmOutline: "border-rose-200 text-rose-600 hover:bg-rose-50",
  },
  success: {
    accent: "from-emerald-500 via-teal-500 to-cyan-500",
    iconRing: "bg-emerald-100 text-emerald-600",
    confirm: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_10px_30px_-12px_rgba(16,185,129,0.9)]",
    confirmOutline: "border-emerald-200 text-emerald-600 hover:bg-emerald-50",
  },
  info: {
    accent: "from-blue-500 via-indigo-500 to-purple-500",
    iconRing: "bg-blue-100 text-blue-600",
    confirm: "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_10px_30px_-12px_rgba(59,130,246,0.9)]",
    confirmOutline: "border-blue-200 text-blue-600 hover:bg-blue-50",
  },
};

const AlertConfirmation = ({
  open,
  icon: Icon = AlertTriangle,
  variant = "info",
  title,
  description,
  highlight,
  meta,
  confirmText = "Ya, lanjutkan",
  cancelText = "Batal",
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!open) return null;

  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.info;

  const handleOverlayClick = (event) => {
    if (loading) return;
    if (event.target === event.currentTarget) {
      onCancel?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center px-4 py-10"
      role="dialog"
      aria-modal="true"
      onMouseDown={handleOverlayClick}
    >
      <div className="absolute inset-0 bg-neutral-950/50 backdrop-blur-sm transition-opacity" />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-neutral-900/10">
        <span className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-br ${styles.accent}`} />

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-500 shadow-lg transition hover:text-neutral-800 focus-visible:outline-none"
          aria-label="Tutup konfirmasi"
        >
          <X size={18} />
        </button>

        <div className="relative px-6 pt-14 pb-6 sm:px-8">
          <div className="flex flex-col items-center text-center">
            <div
              className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white shadow-[0_18px_45px_-20px_rgba(15,23,42,0.6)] ${styles.iconRing}`}
            >
              <Icon size={30} />
            </div>
            <div className="space-y-3">
              {meta ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600 shadow-sm">
                  {meta}
                </span>
              ) : null}
              <h3 className="text-2xl font-semibold text-neutral-900">{title}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{description}</p>
              {highlight ? (
                <div className="rounded-2xl border border-black/5 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 shadow-inner">
                  {highlight}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 bg-neutral-50/80 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-600 transition hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20 sm:w-auto"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${styles.confirm} ${loading ? "opacity-80" : ""} sm:w-auto`}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            <span>{loading ? "Memproses..." : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertConfirmation;
