import React from "react";
import { AnimatePresence, motion } from "framer-motion";

// Impor semua komponen form sesuai struktur folder kamu
import PernikahanForm from "./form/PernikahanForm";
import UlangTahunForm from "./form/UlangTahunForm";
import AqiqahForm from "./form/AqiqahForm";
import NatalForm from "./form/NatalForm";
import SyukuranForm from "./form/SyukuranForm";
import MeetingForm from "./form/MeetingForm";
import SeminarForm from "./form/SeminarForm";
import GrandOpeningForm from "./form/GrandOpeningForm";
import ArisanForm from "./form/ArisanForm";
import KhitananForm from "./form/KhitananForm";
import GraduationForm from "./form/GraduationForm";
import PartyForm from "./form/PartyForm";

const ModalForm = ({
  open,
  onClose,
  formData,
  handleChange,
  handleSubmit,
  selectedTemplate,
}) => {
  if (!open) return null;

  const categoryName = selectedTemplate?.category?.name || "";

  // 1. Logika Render Form Tambahan (Dinamis)
  const renderFormContent = () => {
    const props = { formData, handleChange };

    switch (categoryName.toLowerCase()) {
      case "pernikahan": return <PernikahanForm {...props} />;
      case "ulang tahun": return <UlangTahunForm {...props} />;
      case "aqiqah": return <AqiqahForm {...props} />;
      case "natal": return <NatalForm {...props} />;
      case "syukuran": return <SyukuranForm {...props} />;
      case "meeting": return <MeetingForm {...props} />;
      case "seminar": return <SeminarForm {...props} />;
      case "grand opening": return <GrandOpeningForm {...props} />;
      case "arisan": return <ArisanForm {...props} />;
      case "khitanan": return <KhitananForm {...props} />;
      case "graduation": return <GraduationForm {...props} />;
      case "party": return <PartyForm {...props} />;
      default:
        return <p className="text-sm text-gray-500 italic">Silakan isi detail acara di bawah.</p>;
    }
  };

  // 2. Logika Placeholder Dinamis Lengkap
  const getDynamicPlaceholder = () => {
    const category = categoryName.toLowerCase();
    switch (category) {
      case "pernikahan": return "Contoh: Pernikahan Budi & Ani";
      case "aqiqah": return "Contoh: Aqiqah Putra Kami - Rayyan";
      case "arisan": return "Contoh: Arisan Bulanan Mawar";
      case "graduation": return "Contoh: Syukuran Kelulusan Siska, S.Kom";
      case "grand opening": return "Contoh: Grand Opening Toko Berkah";
      case "khitanan": return "Contoh: Khitanan Ananda Rizky";
      case "meeting": return "Contoh: Rapat Koordinasi Tahunan";
      case "natal": return "Contoh: Perayaan Natal Pemuda 2026";
      case "party": return "Contoh: Birthday Party Ke-17 Keisha";
      case "seminar": return "Contoh: Seminar Nasional Teknologi";
      case "syukuran": return "Contoh: Syukuran Rumah Baru Budi";
      case "ulang tahun": return "Contoh: Ulang Tahun Azura ke-5";
      default: return "Contoh: Undangan Acara Saya";
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto"
        >
          {/* Header Section */}
          <div className="mb-6">
            <button
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={onClose}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Buat Undangan</h2>
            <p className="text-sm text-gray-500 mt-1">
              Template: <span className="font-semibold text-blue-600">{selectedTemplate?.title}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Nama Undangan */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Undangan</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder={getDynamicPlaceholder()}
                required
              />
            </div>

            {/* Input No WA */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">No WhatsApp</label>
              <input
                type="text"
                name="noWa"
                value={formData.noWa || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Contoh: 08123456789"
                required
              />
            </div>

            {/* Area Form Dinamis */}
            <div className="py-2 border-y border-gray-50">
              {renderFormContent()}
            </div>

            {/* TANGGAL ACARA - MENGGUNAKAN NATIVE HTML5 DATE */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tanggal Acara</label>
              <input
                type="date"
                name="tanggal"
                value={formData.tanggal || ""}
                onChange={handleChange}
                // Native input patuh pada w-full dan tidak akan terpotong
                className="w-full block border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white cursor-pointer transition-all text-gray-700"
                required
              />
            </div>

            {/* Tombol Aksi */}
            <div className="flex items-center justify-end gap-3 pt-6 mt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-md transition-all active:scale-95"
              >
                Buat Undangan
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ModalForm;