import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaFileExport,
  FaFileImport,
  FaTrash,
  FaEdit,
  FaSort,
  FaSync,
  FaSortUp,
  FaSortDown,
  FaSearch,
  FaArrowLeft,
} from "react-icons/fa";
import useSystemContent from "../../../api/system_content/useSystemContent";
import Pagination from "../../../components/Pagination";
import { format } from "date-fns"; // 1. Impor fungsi format
import { id } from "date-fns/locale"; // 2. Impor locale Bahasa Indonesia
import { toast } from "react-toastify";
import apiService from "../../../api/apiService"; // <-- Impor apiService

// 1. Definisikan custom hook untuk mendeteksi klik di luar elemen
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Jangan lakukan apa-apa jika klik terjadi di dalam elemen ref atau turunannya
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

export default function SystemContentPage() {
  const navigate = useNavigate();
  const {
    data: contentList,
    loading,
    pagination,
    getList,
    getTypes,
    create,
    update,
    remove,
  } = useSystemContent();

  const [typeOptions, setTypeOptions] = useState([]);
  // 1. Tambahkan state untuk sorting
  const [filters, setFilters] = useState({
    page: 1, limit: 10, search: "", status: "", type: "",
    sort: "id", // Kolom default
    order: "desc", // Arah default
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({});
  const [jsonError, setJsonError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // 1. Tambahkan state dan ref untuk dropdown modal
  const [isModalTypeDropdownOpen, setIsModalTypeDropdownOpen] = useState(false);
  const typeDropdownRef = useRef(null);
  const modalTypeDropdownRef = useRef(null);

  // 2. Terapkan hook "click outside" untuk kedua dropdown
  const statusDropdownRef = useRef(null);
  useOnClickOutside(typeDropdownRef, () => setIsTypeDropdownOpen(false));
  useOnClickOutside(modalTypeDropdownRef, () => setIsModalTypeDropdownOpen(false));
  useOnClickOutside(statusDropdownRef, () => setIsStatusDropdownOpen(false));
  
  // Ambil data (daftar konten dan tipe unik) setiap kali filter berubah
  const memoizedGetList = useCallback(getList, []);
  const memoizedGetTypes = useCallback(getTypes, []);

  useEffect(() => {
    // 5. Debouncing untuk filter pencarian
    const timer = setTimeout(() => {
    const backendFilter = {
      search: filters.search || undefined,
      status: filters.status || undefined,
      type: filters.type || undefined,
    };
      memoizedGetList({
        page: filters.page,
        limit: filters.limit,
        filter: JSON.stringify(backendFilter),
        sort: `${filters.sort}:${filters.order}`, // 2. Kirim parameter sort ke hook
      });
    }, filters.search ? 300 : 0); // Tambahkan delay hanya saat ada input pencarian

    return () => clearTimeout(timer);
  }, [filters, memoizedGetList]);

  // Hanya ambil daftar tipe sekali saat komponen dimuat
  useEffect(() => {
    const fetchTypes = async () => {
      const types = await memoizedGetTypes();
      setTypeOptions(types);
    };
    fetchTypes();
  }, [memoizedGetTypes]);

  // Handler untuk mengubah filter
  const handleFilterChange = (key, value) => {
    // 5. Jangan reset page jika hanya limit yang berubah
    if (key === "limit") {
      setFilters((prev) => ({ ...prev, limit: value }));
    } else {
      setFilters((prev) => ({ ...prev, page: 1, [key]: value }));
    }
  };

  // 3. Buat handler untuk mengubah sorting
  const handleSort = (column) => {
    setFilters(prev => {
      if (prev.sort === column) {
        // Jika kolom sama, balik arahnya
        return { ...prev, page: 1, order: prev.order === 'asc' ? 'desc' : 'asc' };
      }
      // Jika kolom baru, set default ke 'asc'
      return { ...prev, page: 1, sort: column, order: 'asc' };
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const defaultFilters = {
      page: 1,
      limit: 10,
      search: "",
      status: "",
      type: "",
      sort: "id",
      order: "desc",
    };
    setFilters(defaultFilters);
    // Tidak perlu memanggil getList secara manual karena useEffect akan terpicu
    // oleh perubahan `filters`. Cukup set state refresh.
    await new Promise(resolve => setTimeout(resolve, 50)); // Beri sedikit waktu untuk state update
    setIsRefreshing(false);
    toast.info("Data dimuat ulang.");
  };


  const openModal = (item = null) => {
    setIsModalTypeDropdownOpen(false); // Pastikan dropdown modal tertutup saat dibuka
    if (item) {
      setEditingItem(item);
      setForm({
        key: item.key, title: item.title, type: item.type,
        isActive: item.isActive, content: item.content || "",
        config: JSON.stringify(item.config || {}, null, 2),
      });
    } else {
      setEditingItem(null);
      setForm({ key: "", title: "", type: "", new_type: "", isActive: true, content: "", config: "{}" });
    }
    setModalOpen(true);
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "type") {
      setForm((f) => ({ ...f, type: value, new_type: "" }));
    } else if (name === "new_type") {
      setForm((f) => ({ ...f, new_type: value, type: "" }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
       setJsonError(""); // Reset error setiap kali mencoba menyimpan
      const parsedConfig = form.config ? JSON.parse(form.config) : {};
      const finalType = (form.new_type || form.type).trim();
      if (!finalType) {
        toast.error("Tipe harus dipilih atau diisi."); return;
      }
      // const parsedConfig = form.config ? JSON.parse(form.config) : {};
      const payload = { ...form, config: parsedConfig, type: finalType };
      delete payload.new_type; // Hapus field sementara

      if (editingItem) {
        // Saat mengedit, kita seharusnya tidak mengirim 'key' karena itu adalah pengenal unik
        // yang tidak boleh diubah. Backend mungkin menolaknya jika ada.
        const updatePayload = { ...payload };
        delete updatePayload.key;
        await update(editingItem.id, updatePayload);
      } else {
        const createPayload = { ...payload };
        delete createPayload.id; // Pastikan tidak ada ID saat membuat data baru
        await create(createPayload);
      }

      setModalOpen(false);
      // 2. Refresh daftar tipe jika ada tipe baru yang dibuat
      if (form.new_type) {
        const types = await memoizedGetTypes();
        setTypeOptions(types);
      }
    } catch (e) {
      // 3. Penanganan error yang lebih spesifik
      if (e instanceof SyntaxError) {
        setJsonError("Format JSON di 'Config' tidak valid.");
      } else {
        toast.error(e.response?.data?.meta?.message || "Gagal menyimpan konten.");
        console.error(e);
      }
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus item ini?")) {
      await remove(id); // 4. Refresh data setelah hapus
      getList(filters);
    }
  };

  function exportJSON() {
    const data = JSON.stringify(contentList, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `system-content-export-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importJSON(file) {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!Array.isArray(parsed))
          throw new Error("Format tidak valid, diharapkan array objek");
        // Persist imported items one by one
        for (const item of parsed) {
          const payload = {
            key: item.key,
            title: item.title,
            type: item.type,
            active:
              item.status || item.isActive
                ? item.status === "active" || item.isActive === true
                : false,
            content: item.content || "",
            config: item.config || {},
          };
          await create(payload);
        }
        getList(filters);
        alert("Import berhasil");
      } catch (e) {
        alert("Gagal import: " + e.message);
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200" title="Kembali">
            <FaArrowLeft className="text-gray-700 text-lg" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Konten Sistem</h1>
            <p className="text-gray-500 text-sm mt-0.5">Kelola konten dan konfigurasi sistem.</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors text-sm font-medium"
            onClick={() => openModal()}
          >
            <FaPlus />
            Tambah
          </button>
          <button
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-700 transition-colors text-sm font-medium"
            onClick={exportJSON}
          >
            <FaFileExport />
            Export
          </button>
          <label className="flex items-center gap-2 bg-slate-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-slate-700 transition-colors cursor-pointer text-sm font-medium">
            <FaFileImport /> Import
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0])
                  importJSON(e.target.files[0]);
              }}
            />
          </label>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto] gap-3 mb-4 items-center">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Cari berdasarkan key atau title..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="border rounded-lg px-3 py-2 w-full pl-10 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-colors"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        {/* Custom Dropdown untuk Tipe */}
        <div className="relative" ref={typeDropdownRef}> {/* 4. Pasang ref di sini */}
          <button
            onClick={() => setIsTypeDropdownOpen(prev => !prev)}
            className="border rounded-lg px-3 py-2 bg-white w-full text-left flex justify-between items-center hover:border-gray-400 transition-colors"
          >
            <span className="capitalize">{filters.type || "Semua Tipe"}</span>
            <svg className={`w-4 h-4 transition-transform ${isTypeDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          {isTypeDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg">
              <ul className="max-h-40 overflow-y-auto"> {/* Batasi tinggi dan aktifkan scroll */}
                <li
                  onClick={() => {
                    handleFilterChange("type", "");
                    setIsTypeDropdownOpen(false);
                  }}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Semua Tipe
                </li>
                {typeOptions.map((type) => (
                  <li
                    key={type}
                    onClick={() => {
                      handleFilterChange("type", type);
                      setIsTypeDropdownOpen(false);
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer capitalize"
                  >
                    {type}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Custom Dropdown untuk Status */}
        <div className="relative" ref={statusDropdownRef}>
          <button
            onClick={() => setIsStatusDropdownOpen(prev => !prev)}
            className="border rounded-lg px-3 py-2 bg-white w-full text-left flex justify-between items-center hover:border-gray-400 transition-colors"
          >
            <span className="capitalize">{filters.status === '' ? "Semua Status" : (filters.status === 'true' ? 'Aktif' : 'Tidak Aktif')}</span>
            <svg className={`w-4 h-4 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          {isStatusDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg">
              <ul className="max-h-40 overflow-y-auto">
                <li onClick={() => { handleFilterChange("status", ""); setIsStatusDropdownOpen(false); }} className="px-3 py-2 hover:bg-gray-100 cursor-pointer">Semua Status</li>
                <li onClick={() => { handleFilterChange("status", "true"); setIsStatusDropdownOpen(false); }} className="px-3 py-2 hover:bg-gray-100 cursor-pointer">Aktif</li>
                <li onClick={() => { handleFilterChange("status", "false"); setIsStatusDropdownOpen(false); }} className="px-3 py-2 hover:bg-gray-100 cursor-pointer">Tidak Aktif</li>
              </ul>
            </div>
          )}
        </div>

        <button
          onClick={handleRefresh}
          className="p-2.5 rounded-lg border bg-white flex items-center justify-center disabled:opacity-60 hover:bg-gray-100 active:bg-gray-200 transition-colors"
          title="Muat Ulang Data"
          disabled={loading || isRefreshing}
        >
          <FaSync className={isRefreshing ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow">
        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-100 z-10 shadow-sm">
              <tr>
                {/* Ganti checkbox dengan kolom nomor */}
                <th className="px-4 py-3 w-10 text-center font-medium text-gray-600">No.</th>
                {/* 4. Buat header kolom bisa diklik untuk sorting */}
                <th className="px-4 py-3 cursor-pointer hover:bg-gray-200 text-left font-medium text-gray-600" onClick={() => handleSort('key')}>
                  <div className="flex items-center gap-1">
                    Key {filters.sort === 'key' ? (filters.order === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort className="text-gray-400" />}
                  </div>
                </th>
                <th className="px-4 py-3 cursor-pointer hover:bg-gray-200 text-left font-medium text-gray-600" onClick={() => handleSort('title')}>
                  <div className="flex items-center gap-1">
                    Title {filters.sort === 'title' ? (filters.order === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort className="text-gray-400" />}
                  </div>
                </th>
                <th className="px-4 py-3 cursor-pointer hover:bg-gray-200 text-left font-medium text-gray-600" onClick={() => handleSort('type')}>
                  <div className="flex items-center gap-1">
                    Tipe {filters.sort === 'type' ? (filters.order === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort className="text-gray-400" />}
                  </div>
                </th>
                <th className="px-4 py-3 cursor-pointer hover:bg-gray-200 text-left font-medium text-gray-600" onClick={() => handleSort('createdAt')}>
                  <div className="flex items-center gap-1">
                    Created {filters.sort === 'createdAt' ? (filters.order === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort className="text-gray-400" />}
                  </div>
                </th>
                <th className="px-4 py-3 cursor-pointer hover:bg-gray-200 text-left font-medium text-gray-600" onClick={() => handleSort('updatedAt')}>
                  <div className="flex items-center gap-1">
                    Updated {filters.sort === 'updatedAt' ? (filters.order === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort className="text-gray-400" />}
                  </div>
                </th>
                <th className="px-4 py-3 w-28 cursor-pointer hover:bg-gray-200 text-center font-medium text-gray-600" onClick={() => handleSort('isActive')}>
                  <div className="flex items-center justify-center gap-1">
                    Status {filters.sort === 'isActive' ? (filters.order === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort className="text-gray-400" />}
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Aksi</th>
              </tr>
            </thead>
          <tbody className="bg-white">
            {loading && (
              <tr>
                <td colSpan={8} className="text-center p-4 text-gray-500">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && contentList.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center p-4 text-gray-500">
                  Tidak ada data
                </td>
              </tr>
            )}
            {!loading &&
              contentList.map((item, index) => (
                <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                  {/* Ganti checkbox dengan nomor baris */}
                  <td className="px-4 py-3 text-center text-gray-500">
                    {(pagination.currentPage - 1) * filters.limit + index + 1}
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-800">{item.key}</td>
                  <td className="px-4 py-3 text-gray-800">{item.title}</td>
                  <td className="px-4 py-3 capitalize text-gray-600">{item.type}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {/* Tampilkan tanggal createdAt dengan format yang sama */}
                    {item.createdAt && !isNaN(new Date(item.createdAt))
                      ? format(new Date(item.createdAt), "dd MMMM yyyy, HH:mm", {
                          locale: id,
                        })
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {/* Perbaikan: Cek jika tanggal valid sebelum ditampilkan */}
                    {item.updatedAt && !isNaN(new Date(item.updatedAt))
                      ? format(new Date(item.updatedAt), "dd MMMM yyyy, HH:mm", {
                          locale: id,
                        })
                      : "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.isActive ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100 hover:text-blue-800 transition-colors" onClick={() => openModal(item)} title="Edit"><FaEdit /></button>
                      <button className="p-1.5 rounded-full text-red-600 hover:bg-red-100 hover:text-red-800 transition-colors" onClick={() => handleDelete(item.id)} title="Hapus"><FaTrash /></button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

     

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-white border-t rounded-b-lg">
        <div className="flex items-center gap-2 text-sm">
          <span>Tampilkan:</span>
          <select
            className="px-2 py-1.5 rounded-md border bg-white focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
            value={filters.limit}
            onChange={(e) =>
              handleFilterChange("limit", Number(e.target.value))
            }
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="text-gray-600">
            Total: {pagination.totalRows || pagination.total || 0} • Halaman{" "}
            {pagination.currentPage || pagination.page || 1} /{" "}
            {pagination.totalPages || 1}
          </span>
        </div>
        <Pagination
          current={pagination.currentPage || pagination.page || 1}
          totalPages={pagination.totalPages || 0}
          onChange={(p) => handleFilterChange("page", p)}
        />
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          {/* Perlebar modal untuk mengakomodasi 2 kolom */}
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editingItem ? "Edit Konten" : "Tambah Konten"}
            </h2>
            {/* Ubah layout menjadi grid 2 kolom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 max-h-[75vh] md:max-h-none overflow-y-auto md:overflow-visible pr-2 -mr-2 md:pr-0 md:mr-0">
              {/* Kolom Kiri */}
              <div className="flex flex-col gap-4">
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">Key</span>
                  <input
                    name="key"
                    placeholder="e.g., 'promo_banner'"
                    value={form.key}
                    onChange={handleFormChange}
                    className="border rounded-lg px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-colors"
                    disabled={!!editingItem}
                  />
                  {editingItem && (
                    <span className="text-xs text-gray-500">
                      Key tidak dapat diubah.
                    </span>
                  )}
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">Title</span>
                  <input
                    name="title"
                    placeholder="Judul konten"
                    value={form.title}
                    onChange={handleFormChange}
                    className="border rounded px-2 py-1"
                  />
                </label>
                {/* 3. Ganti <select> dengan dropdown kustom */}
                <div className="relative" ref={modalTypeDropdownRef}>
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-700">Pilih Tipe yang Sudah Ada</span>
                    <button
                      type="button"
                      onClick={() => setIsModalTypeDropdownOpen(prev => !prev)}
                      disabled={!!form.new_type}
                      className="border rounded-lg px-3 py-2 bg-white w-full text-left flex justify-between items-center disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <span className="capitalize">{form.type || "-- Pilih Tipe --"}</span>
                      <svg className={`w-4 h-4 transition-transform ${isModalTypeDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  </label>
                  {isModalTypeDropdownOpen && !form.new_type && (
                    <div className="absolute z-20 mt-1 w-full bg-white border rounded shadow-lg">
                      <ul className="max-h-32 overflow-y-auto"> {/* Batasi tinggi dan aktifkan scroll */}
                        <li
                          onClick={() => { handleFormChange({ target: { name: 'type', value: '' } }); setIsModalTypeDropdownOpen(false); }}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          -- Pilih Tipe --
                        </li>
                        {typeOptions.map((t) => (
                          <li
                            key={t}
                            onClick={() => { handleFormChange({ target: { name: 'type', value: t } }); setIsModalTypeDropdownOpen(false); }}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer capitalize"
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="text-center text-sm text-gray-500">atau</div>

                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">Buat Tipe Baru</span>
                  <input
                    type="text"
                    name="new_type"
                    placeholder="Tulis tipe baru..."
                    className="border rounded-lg px-3 py-2 disabled:bg-gray-100"
                    value={form.new_type}
                    onChange={handleFormChange}
                    disabled={!!form.type} // Nonaktif jika dropdown dipilih
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">Status</span>
                  <select
                    className="border rounded-lg px-3 py-2 bg-white"
                    value={form.isActive}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        isActive: e.target.value === "true",
                      }))
                    }
                  >
                    <option value={true}>Aktif</option>
                    <option value={false}>Tidak Aktif</option>
                  </select>
                </label>
              </div>

              {/* Kolom Kanan */}
              <div className="flex flex-col gap-4">
                <label className="flex flex-col gap-1 h-full">
                  <span className="text-sm font-medium text-gray-700">Content</span>
                  <textarea
                    placeholder="Isi konten (bisa berisi HTML)"
                    className="border rounded-lg px-3 py-2 flex-grow"
                    value={form.content}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, content: e.target.value }))
                    }
                    rows={8}
                  ></textarea>
                </label>
                <label className="flex flex-col gap-1 h-full">
                  <span className="text-sm font-medium text-gray-700">Config (JSON)</span>
                  <textarea
                    placeholder="Konfigurasi tambahan dalam format JSON"
                    className="border rounded-lg px-3 py-2 font-mono text-sm flex-grow"
                    value={form.config}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, config: e.target.value }))
                    }
                    rows={10}
                  ></textarea>
                </label>
              </div>
              {jsonError && (
                <span className="text-red-500 text-sm">{jsonError}</span>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button
                className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                onClick={() => setModalOpen(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                onClick={handleSave}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
