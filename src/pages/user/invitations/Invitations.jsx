import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom"; // <-- TAMBAHKAN IMPORT INI
import {
  FaEllipsisV,
  FaEdit,
  FaEye,
  FaTrash,
  FaCheckCircle,
  FaPlus,
  FaSearch,
  FaShareAlt,
} from "react-icons/fa";
import useInvitations from "../../../api/invitations/useInvitations";
import Pagination from "../../../components/Pagination";
import { toast } from "react-toastify";
import useCategories from "../../../api/categories/useCategories"; // <-- 2. Impor hook kategori

// Helper debounce untuk input pencarian
function debounce(fn, ms) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, ms);
  };
}

const InvitationsPage = () => {
  const navigate = useNavigate(); // <-- 2. Inisialisasi hook navigate
  const {
    data: invitations,
    loading,
    pagination,
    getList,
    remove,
    update,
    activate,
  } = useInvitations();

  const { data: categories, getList: getCategories } = useCategories();

  // State untuk filter dan paginasi
  const [filters, setFilters] = useState({
    page: 1,
    limit: 6,
    search: "",
    category_id: "",
    sort: "createdAt:desc", // <-- Urutan default: yang terbaru dulu
  });

  // State untuk UI interaktif
  const [activeDropdown, setActiveDropdown] = useState(0);
  const dropdownRefs = useRef({}); // Use an object to hold refs for each dropdown
  const dropdownButtonRefs = useRef({}); // Use an object to hold refs for each button

  // Fetch data kategori saat komponen dimuat
  useEffect(() => {
    getCategories({ limit: 999 }); // Ambil semua kategori untuk filter
  }, [getCategories]);

  // Fetch data saat filter berubah
  useEffect(() => {
    getList(filters);
  }, [filters, getList]);

  // Effect to handle closing dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown) {
        const dropdown = dropdownRefs.current[activeDropdown];
        const button = dropdownButtonRefs.current[activeDropdown];

        if (
          dropdown &&
          !dropdown.contains(event.target) &&
          button &&
          !button.contains(event.target)
        ) {
          setActiveDropdown(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown]); // Re-run when activeDropdown changes

  const handleShare = (invitationId) => {
    navigate(`/invitations/${invitationId}/share`);
  };

  // --- Handlers ---
  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  // --- Handlers ---
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const debouncedSearch = React.useCallback(
    debounce((value) => {
      handleFilterChange("search", value);
    }, 500),
    []
  );

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleCreateNew = () => {
    navigate("/dashboard/templates"); // Arahkan ke halaman template
  };

  const handleEdit = (projectId) => {
    // <-- Parameter ini seharusnya projectId
    if (!projectId) {
      toast.error(
        "Tidak dapat membuka editor karena Project ID tidak ditemukan."
      );
      return;
    }
    const url = `/invitations/edit/${projectId}`;
    window.open(url, "_blank");
  };

  const handleActivate = async (invitation) => {
    console.log(
      `[InvitationsPage] handleActivate called for invitation ID: ${invitation.id}, current status: ${invitation.status}`
    ); // Added console.log
    try {
      if (invitation.status === "aktif") {
        await update(invitation.id, { status: "nonaktif" });
        toast.info("Undangan dinonaktifkan.");
      } else {
        await activate(invitation.id);
      }
      getList(filters);
    } catch (error) {
      const errorMessage =
        error.response?.data?.meta?.message || "Terjadi kesalahan.";
      toast.error(errorMessage);
      if (error.response?.status === 403) {
        setTimeout(() => {
          navigate("/dashboard/upgrade");
        }, 2000);
      }
    }
  };

  const handleDelete = (id) => {
    const deleteAction = async () => {
      try {
        await remove(id);
        getList(filters);
        toast.success("Undangan berhasil dihapus!");
      } catch (error) {
        console.error("Gagal menghapus undangan:", error);
        toast.error("Gagal menghapus undangan.");
      }
    };

    toast(
      ({ closeToast }) => (
        <div className="p-2">
          <p className="font-bold text-slate-800">Konfirmasi Hapus</p>
          <p className="text-sm text-slate-600 mt-1">
            Anda yakin ingin menghapus undangan ini?
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={closeToast}
              className="px-4 py-2 text-sm rounded-md bg-slate-200 hover:bg-slate-300 font-semibold"
            >
              Batal
            </button>
            <button
              onClick={() => {
                deleteAction();
                closeToast();
              }}
              className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 font-semibold"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        style: {
          width: "350px",
        },
      }
    );
  };

  const handlePreview = (invitation) => {
    if (!invitation.project || !invitation.project.id) {
      // Check for project_id
      toast.error(
        "Project ID tidak ditemukan. Tidak dapat menampilkan pratinjau."
      );
      return;
    }
    const url = `/preview/${invitation.project.id}`; // Use the new preview route
    console.log("Generated Preview URL:", url); // Add this line
    window.open(url, "_blank");
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* --- HEADER DAN FILTER BARU --- */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                My Invitations
              </h1>
              <p className="text-slate-500 mt-1">
                Kelola semua undangan yang telah Anda buat.
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-blue-700 transition-colors font-semibold"
            >
              <FaPlus size={14} />
              Buat Undangan Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama undangan..."
                onChange={(e) => debouncedSearch(e.target.value)}
                className="border rounded-lg px-10 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filters.category_id}
              onChange={(e) =>
                handleFilterChange("category_id", e.target.value)
              }
              className="border rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
              className="border rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="createdAt:desc">Terbaru</option>
              <option value="createdAt:asc">Terlama</option>
              <option value="name:asc">Nama (A-Z)</option>
              <option value="name:desc">Nama (Z-A)</option>
              {/* <option value="acara:asc">Tanggal Acara (Terdekat)</option>
              <option value="acara:desc">Tanggal Acara (Terjauh)</option> */}
            </select>
          </div>
        </div>
        {/* --- AKHIR HEADER DAN FILTER BARU --- */}

        {/* Grid Kartu Undangan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading && (
            <p className="col-span-full text-center py-10 text-slate-500">
              Loading invitations...
            </p>
          )}
          {!loading && invitations.length === 0 && (
            <p className="col-span-full text-center py-10 text-slate-500">
              Anda belum membuat undangan.
            </p>
          )}
          {!loading &&
            invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden"
              >
                {/* Kiri: Preview Template */}
                <div className="w-full md:w-5/12 p-4 flex-shrink-0">
                  <div className="w-full h-full min-h-[300px] bg-slate-100 rounded-lg overflow-hidden shadow-inner">
                    {invitation.project?.template?.previewUrl ? (
                      <iframe
                        src={invitation.project.template.previewUrl}
                        title={`Preview of ${invitation.name}`}
                        className="w-full h-full border-0 pointer-events-none" // pointer-events-none agar tidak bisa di-scroll
                        scrolling="no"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        No Preview
                      </div>
                    )}
                  </div>
                </div>

                {/* Kanan: Detail Undangan */}
                <div className="w-full md:w-7/12 p-6 flex flex-col justify-between relative">
                  <div>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        invitation.status === "aktif"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {invitation.status}
                    </span>
                    <h2
                      className="text-2xl font-bold text-slate-800 mt-2 truncate"
                      title={invitation.name}
                    >
                      {invitation.name}
                    </h2>
                    <p className="text-slate-500 text-sm">
                      {invitation.owner_1}
                      {invitation.owner_2 && ` & ${invitation.owner_2}`}
                    </p>
                    <p className="text-slate-600 font-medium mt-3">
                      {new Date(invitation.acara).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Tombol Aktivasi di Tengah Bawah */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full px-6">
                    <button
                      onClick={() => handleActivate(invitation)}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white transition-colors duration-300 ${
                        invitation.status === "aktif"
                          ? "bg-amber-500 hover:bg-amber-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      <FaCheckCircle />
                      <span>
                        {invitation.status === "aktif"
                          ? "Nonaktifkan"
                          : "Aktifkan Undangan"}
                      </span>
                    </button>
                  </div>

                  {/* Dropdown Elipsis di Pojok Kanan Atas */}
                  <div className="absolute top-6 right-6">
                    <button
                      onClick={() =>
                        setActiveDropdown((prev) =>
                          prev === invitation.id ? null : invitation.id
                        )
                      }
                      className="text-slate-500 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100"
                      ref={(el) =>
                        (dropdownButtonRefs.current[invitation.id] = el)
                      }
                    >
                      <FaEllipsisV />
                    </button>

                    {activeDropdown === invitation.id && (
                      <div
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border"
                        ref={(el) => (dropdownRefs.current[invitation.id] = el)}
                      >
                        <button
                          onClick={() => handleEdit(invitation.project_id)} // <-- Gunakan invitation.project_id
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        >
                          <FaEdit className="mr-2" /> Edit Design
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handlePreview(invitation); // Pass the full invitation object
                            setActiveDropdown(null); // Close dropdown after action
                          }}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        >
                          <FaEye className="mr-2" /> Preview
                        </button>
                        {invitation.status === "aktif" && (
                          <button
                            onClick={() => handleShare(invitation.id)}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                          >
                            <FaShareAlt className="mr-2" /> Share
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(invitation.id);
                            setActiveDropdown(null); // Close dropdown after action
                          }}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <FaTrash className="mr-2" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <Pagination
            current={pagination.currentPage}
            totalPages={pagination.totalPages}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default InvitationsPage;
