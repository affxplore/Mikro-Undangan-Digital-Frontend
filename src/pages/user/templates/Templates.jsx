import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import useTemplates from "../../../api/templates/useTemplates";
import useCategories from "../../../api/categories/useCategories";
import ModalForm from "./components/ModalForm";
import useInvitations from "../../../api/invitations/useInvitations";
import PreviewTemplateModal from "./PreviewTemplateModal";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../api/auth/useAuth";
import { FaStar, FaCheckCircle } from "react-icons/fa";

const initialFormData = {
  name: "",
  tanggal: "",
  noWa: "",
  // Pernikahan
  namaPria: "",
  namaWanita: "",
  // Ulang Tahun
  namaPerayaan: "",
  ulangTahunKe: "",
  // Aqiqah & Khitanan
  namaAnak: "",
  namaOrangTua: "",
  // Acara Formal & Syukuran
  namaPenyelenggara: "",
  // Grand Opening
  namaUsaha: "",
  // Arisan
  namaGrup: "",
  // Natal
  namaAcara: "",
  // Graduation
  namaWisudawan: "",
  // Party
  namaPesta: "",
};

export default function TemplatesPage() {
  const [searchParams] = useSearchParams();
  const categoryNameFromUrl = searchParams.get('category');
  const [filters, setFilters] = useState({
    page: 1,
    limit: 9,
    search: "",
    category_id: "",
    label: "",
  });

  const [showPopup, setShowPopup] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateToView, setTemplateToView] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user } = useAuth();
  const { createFull: createFullInvitation } = useInvitations();
  const navigate = useNavigate();

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {
    data: templates,
    pagination,
    loading,
    getList: getTemplates,
  } = useTemplates();

  const { data: categories, getList: getCategories } = useCategories();

  const memoizedGetTemplates = useCallback(getTemplates, []);

  useEffect(() => {
    memoizedGetTemplates(filters);
  }, [filters, memoizedGetTemplates]);

  useEffect(() => {
    getCategories({ limit: 999 });
  }, [getCategories]);

  useEffect(() => {
    if (categoryNameFromUrl && categories.length > 0) {
    // Cari kategori yang namanya cocok (case insensitive)
    const matchedCategory = categories.find(
      (c) => c.name.toLowerCase() === categoryNameFromUrl.toLowerCase()
    );

    if (matchedCategory) {
      setFilters((prev) => ({
        ...prev,
        category_id: matchedCategory.id,
        page: 1,
      }));
    }
  }
}, [categoryNameFromUrl, categories]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const UpgradeConfirmation = ({ closeToast }) => (
    <div>
      <p className="font-semibold mb-2">Template ini hanya untuk pengguna Pro.</p>
      <p className="mb-4 text-sm">Apakah Anda ingin upgrade sekarang?</p>
      <div className="flex gap-2 justify-end mt-2">
        <button
          onClick={() => {
            navigate('/dashboard/upgrade');
            closeToast();
          }}
          className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Upgrade
        </button>
        <button
          onClick={closeToast}
          className="px-4 py-1.5 bg-slate-200 text-slate-800 rounded-md text-sm font-medium hover:bg-slate-300 transition-colors"
        >
          Batal
        </button>
      </div>
    </div>
  );

  const handleGunakanClick = (template) => {
    const isPremiumTemplate = template.label === 'premium';
    const isFreeUser = user.subscription?.slug === 'free';

    // Jika pengguna paket 'Free' mencoba menggunakan template 'Premium'
    if (isPremiumTemplate && isFreeUser) {
      toast.info(<UpgradeConfirmation />, {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        icon: "🚀"
      });
    } else {
      // Izinkan jika: template gratis, ATAU pengguna adalah paket berbayar (Basic, Pro, Business).
      setSelectedTemplate(template);
      setFormData(initialFormData);
      setShowPopup(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        template_id: selectedTemplate.id,
        name: formData.name,
        acara: formData.tanggal,
        owner_1:
          formData.namaPria ||
          formData.namaPerayaan ||
          formData.namaAnak ||
          formData.namaPenyelenggara ||
          formData.namaUsaha ||
          formData.namaGrup ||
          formData.namaAcara ||
          formData.namaWisudawan ||
          formData.namaPesta ||
          "",
        owner_2: formData.namaWanita || formData.namaOrangTua || "",
        no_hp: formData.noWa,
      };

      const newInvitation = await createFullInvitation(payload);

      toast.success("Undangan berhasil dibuat!");
      setShowPopup(false);

      if (newInvitation && newInvitation.project_id) {
        navigate(`/invitations/edit/${newInvitation.project_id}`);
      }
    } catch (error) {
      toast.error("Gagal membuat undangan.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <header className="bg-white shadow px-6 py-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-blue-700 tracking-tight">
          Pilih Desain Undangan Anda
        </h1>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* /* Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full sm:w-1/3">
            <input
              type="text"
              placeholder="Cari nama template..."
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full px-4 py-3 rounded-lg border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm bg-white"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="relative w-full sm:w-auto" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full sm:w-64 px-4 py-3 rounded-lg border border-blue-100 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm text-gray-700 flex justify-between items-center"
            >
              <span className="truncate">
                {filters.category_id
                  ? categories.find((c) => c.id === filters.category_id)?.name
                  : "✨ Semua Kategori"}
              </span>
              <svg
                className={`w-5 h-5 text-blue-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <div
              className={`absolute z-10 w-full mt-1 bg-white border border-blue-100 rounded-lg shadow-lg max-h-60 overflow-y-auto transition-all duration-200 ${
                isOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              <div
                className="py-2 px-4 hover:bg-blue-50 cursor-pointer transition-colors duration-150 flex items-center space-x-2"
                onClick={() => {
                  handleFilterChange({
                    target: { name: "category_id", value: "" },
                  });
                  setIsOpen(false);
                }}
              >
                <span className="text-lg">✨</span>
                <span>Semua Kategori</span>
              </div>
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`py-2 px-4 hover:bg-blue-50 cursor-pointer transition-colors duration-150 ${
                    filters.category_id === category.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => {
                    handleFilterChange({
                      target: { name: "category_id", value: category.id },
                    });
                    setIsOpen(false);
                  }}
                >
                  {category.name}
                </div>
              ))}
            </div>
          </div>
          <select
            name="label"
            value={filters.label}
            onChange={handleFilterChange}
            className="w-full sm:w-auto px-4 py-3 rounded-lg border border-blue-100 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm text-gray-700"
          >
            <option value="">Semua Label</option>
            <option value="free">
              Free
            </option>
            <option value="premium">
              Premium
            </option>
          </select>
        </div>

        {/* Card List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {!loading &&
            templates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1"
              >
                {/* Thumbnail */}
                <div className="relative w-full aspect-video bg-gradient-to-br from-slate-200 to-slate-100 animate-pulse">
                  <iframe
                    src={template.previewUrl}
                    title={template.title}
                    className="w-full h-full border-0 rounded-t-xl"
                    scrolling="no"
                  />

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => setTemplateToView(template)}
                      className="px-4 py-2 rounded-lg bg-white text-gray-800 font-medium shadow hover:bg-gray-100 transition"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => handleGunakanClick(template)}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
                    >
                      Gunakan
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex flex-col gap-2">
                  <h2
                    className="text-lg font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors"
                    title={template.title}
                  >
                    {template.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="self-start text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {template.category?.name || "Tanpa Kategori"}
                    </span>
                    {template.label === "premium" ? (
                      <span className="flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">
                        <FaStar className="text-amber-500" />
                        <span>Premium</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full">
                        <FaCheckCircle className="text-green-500" />
                        <span>Free</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center mt-10 items-center gap-4">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition"
              disabled={pagination.currentPage === 1}
            >
              Prev
            </button>
            <span className="text-lg font-medium text-gray-700">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition"
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Form Modal */}
      <ModalForm
        open={showPopup}
        onClose={() => setShowPopup(false)}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        selectedTemplate={selectedTemplate}
      />

      {/* Preview Modal */}
      <PreviewTemplateModal
        open={Boolean(templateToView)}
        onClose={() => setTemplateToView(null)}
        templateData={templateToView}
      />
    </div>
  );
}
