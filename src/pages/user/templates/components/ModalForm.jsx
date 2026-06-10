import React from "react";
import { AnimatePresence, motion } from "framer-motion";
// Impor semua komponen form baru
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

  const renderFormContent = () => {
    const categoryName = selectedTemplate?.category?.name || "";

    switch (categoryName.toLowerCase()) {
      case "pernikahan":
        return (
          <PernikahanForm formData={formData} handleChange={handleChange} />
        );
      case "ulang tahun":
        return (
          <UlangTahunForm formData={formData} handleChange={handleChange} />
        );
      case "aqiqah":
        return <AqiqahForm formData={formData} handleChange={handleChange} />;
      case "natal":
        return <NatalForm formData={formData} handleChange={handleChange} />;
      case "syukuran":
        return <SyukuranForm formData={formData} handleChange={handleChange} />;
      case "meeting":
        return <MeetingForm formData={formData} handleChange={handleChange} />;
      case "seminar":
        return <SeminarForm formData={formData} handleChange={handleChange} />;
      case "grand opening":
        return (
          <GrandOpeningForm formData={formData} handleChange={handleChange} />
        );
      case "arisan":
        return <ArisanForm formData={formData} handleChange={handleChange} />;
      case "khitanan":
        return <KhitananForm formData={formData} handleChange={handleChange} />;
      case "graduation":
        return (
          <GraduationForm formData={formData} handleChange={handleChange} />
        );
      case "party":
        return <PartyForm formData={formData} handleChange={handleChange} />;
      default:
        return (
          <p className="text-sm text-gray-500">
            Tidak ada form tambahan untuk kategori ini.
          </p>
        );
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed bg-black/60 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-lg"
        >
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={onClose}
              >
                ✕
              </button>

              <h2 className="text-xl font-bold mb-4 text-blue-700">
                Buat Undangan
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Template:{" "}
                <span className="font-semibold">{selectedTemplate?.title}</span>
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Render form dinamis di sini */}
                {/* {renderFormContent()} */}

                {/* --- FIELD UMUM DITAMBAHKAN DI SINI --- */}
                <div>
                  <label className="block text-sm font-medium text-blue-700">
                    Nama Undangan
                  </label>
                  <input
                    type="text"
                    name="name" // Sesuaikan dengan key di backend
                    value={formData.name || ""}
                    onChange={handleChange}
                    className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Contoh: Undangan Acara XYZ"
                    required
                  />
                </div>

                {/* Field umum yang selalu ada */}
                <div>
                  <label className="block text-sm font-medium text-blue-700">
                    No WA
                  </label>
                  <input
                    type="text"
                    name="noWa"
                    value={formData.noWa || ""}
                    onChange={handleChange}
                    className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                    maxLength={15}
                    inputMode="numeric"
                    required
                  />
                </div>

                {/* Render form dinamis di sini */}
                {renderFormContent()}

                {/* --- FIELD UMUM DITAMBAHKAN DI SINI --- */}
                <div>
                  <label className="block text-sm font-medium text-blue-700">
                    Tanggal Acara
                  </label>
                  <input
                    type="date"
                    name="tanggal"
                    value={formData.tanggal || ""}
                    onChange={handleChange}
                    className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 rounded-md"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Buat Undangan
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Komponen helper agar tidak mengulang kode
const FormField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value || ""}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
    />
  </div>
);

export default ModalForm;
