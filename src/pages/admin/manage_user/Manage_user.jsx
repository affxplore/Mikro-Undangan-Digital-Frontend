// File: src/pages/admin/management/ManageUser.jsx

// Impor React dan hooks
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";

// Impor Ikon (sesuaikan dengan ikon yang Anda inginkan, saya gunakan ikon dari Staff)
import {
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  ShieldBan,
  ShieldCheck,
  RefreshCw,
  Save,
  X,
  User as UserIcon, // Ikon user default
} from "lucide-react";

// Impor hooks dan komponen kustom
import useUsers from "../../../api/users/useUsers"; // Hook data user
import Pagination from "../../../components/Pagination";
import AlertConfirmation from "../../../components/AlertConfirmation";

// Helper debounce
const debounce = (fn, ms = 400) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

// Helper class name
const cls = (...a) => a.filter(Boolean).join(" ");

function UserFormModal({ open, onClose, initial, onSubmit }) {
  // const initialFormState = {
  //   nama: "",
  //   username: "",
  //   password: "",
  //   email: "",
  //   no_telp: "",
  //   status: true,
  // };
  // const [form, setForm] = useState(initialFormState);

  // const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null); // State untuk preview gambar
  const [selectedFile, setSelectedFile] = useState(null); // State untuk file yang akan diupload

  const isEdit = Boolean(initial?.id);

useEffect(() => {
    if (open) {
      // Hanya set preview gambar saat modal dibuka/data initial berubah
      setImagePreview(initial?.profilePicture || null);
      setSelectedFile(null);
      setErrors({});
    }
  }, [open, initial]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Buat URL preview lokal untuk file yang baru dipilih
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

const validate = () => {
  const e = {};

  // Validasi Nama
  if (!form.nama || !form.nama.trim()) {
    e.nama = "Nama wajib diisi";
  }
  
  // Validasi Username
  if (!form.username || !form.username.trim()) {
    e.username = "Username wajib diisi";
  }

  // Validasi Password (hanya saat tambah baru)
  if (!isEdit && (!form.password || !form.password.trim())) {
    e.password = "Password wajib diisi";
  }

  // --- VALIDASI TAMBAHAN YANG HILANG ---
  // Validasi Email
  if (!form.email || !form.email.trim()) {
    e.email = "Email wajib diisi";
  } else if (!(form.email.includes("@") && form.email.includes("."))) {
    // Cek format email hanya jika email sudah diisi
    e.email = "Format email tidak valid";
  }

  // Validasi No. Telp
  if (!form.no_telp || !form.no_telp.trim()) {
    e.no_telp = "No. Telp wajib diisi";
  }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();

    // 1. Ambil semua data form menggunakan new FormData(e.target)
    const formData = new FormData(ev.target);
    
    // --- Validasi Manual Sederhana ---
    const nama = formData.get("full_name");
    const username = formData.get("username");
    const email = formData.get("email");
    const no_telp = formData.get("whatsapp_number");
    const password = formData.get("password");

    if (!nama || !nama.trim()) {
        toast.error("Nama wajib diisi.");
        return;
    }
    if (!email || !email.trim()) {
        toast.error("Email wajib diisi.");
        return;
    }
     if (!no_telp || !no_telp.trim()) {
        toast.error("No. Telp wajib diisi.");
        return;
    }
    if (!isEdit && (!password || !password.trim())) {
        toast.error("Password wajib diisi saat membuat user baru.");
        return;
    }
        formData.append("role_id", 3); // Hardcode role_id
    if (!password) {
      formData.delete("password"); // Hapus password jika kosong (untuk update)
    }
    if (selectedFile) {
      formData.append("profilePicture", selectedFile);
    }

    onSubmit(formData);
  };


  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-2">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
          <h3 className="text-lg font-semibold">
            {isEdit ? "Edit Pengguna" : "Tambah Pengguna"}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-black/5">
            <X size={18} />
          </button>
        </div>

         <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5">     {/* --- Bagian Upload Foto --- */}
            <div className="sm:col-span-1 flex flex-col items-center">
              <label className="text-sm mb-2">Foto Profil</label>
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-28 h-28 rounded-full object-cover border border-neutral-300 mb-2"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-neutral-100 flex items-center justify-center border mb-2">
                  <UserIcon size={40} className="text-neutral-400" />
                </div>
              )}
                <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />
            </div>

            {/* --- Bagian Form Data --- */}
            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                <label className="text-sm">Nama</label>
                <input
                  name="full_name" // Gunakan name_backend
                  defaultValue={initial?.nama || ""} // Gunakan defaultValue
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none border-neutral-300 bg-white"
                  placeholder="Nama lengkap"
                />
              </div>
              <div>
                <label className="text-sm">Username</label>
                <input
                  name="username" // Gunakan name_backend
                  defaultValue={initial?.username || ""} // Gunakan defaultValue
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none border-neutral-300 bg-white"
                  placeholder="Username unik"
                />
              </div>
              <div>
                <label className="text-sm">Email</label>
                <input
                  name="email" // Gunakan name_backend
                  type="email"
                  defaultValue={initial?.email || ""} // Gunakan defaultValue
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none border-neutral-300 bg-white"
                  placeholder="email@contoh.com"
                />
              </div>
              <div>
                <label className="text-sm">No. Telp</label>
                <input
                  name="whatsapp_number" // Gunakan name_backend
                  defaultValue={initial?.no_telp || ""} // Gunakan defaultValue
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none border-neutral-300 bg-white"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm">Password {isEdit && <span className="opacity-60">(kosongkan jika tidak ganti)</span>}</label>
                <input
                  name="password" // Gunakan name_backend
                  type="password"
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none border-neutral-300 bg-white"
                  placeholder={isEdit ? "(opsional)" : "Password"}
                />
              </div>
              <div className="flex items-center gap-3 sm:col-span-2">
                <input
                  name="status" // Gunakan name_backend
                  type="checkbox"
                  defaultChecked={initial?.status ?? true} // Gunakan defaultChecked
                  id="status-modal"
                  value="true" // Nilai yang dikirim saat dicentang
                />
                <label htmlFor="status-modal" className="select-none">Aktif?</label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-neutral-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white flex items-center gap-2"
            >
              <Save size={16} /> Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===================================================================
// KOMPONEN UTAMA (ManageUser)
// ===================================================================
export default function ManageUser() {
  // --- State dan Hooks ---
  const {
    data: list,
    loading,
    pagination,
    getList,
    create,
    update,
    remove,
    toggleStatus,
  } = useUsers();

  const [filters, setFilters] = useState({ q: "", status: "" });
  const [sort, setSort] = useState("id:asc");
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null,
    row: null,
    nextStatus: null,
  });
  const [confirmLoading, setConfirmLoading] = useState(false);

  // --- Parameter Konstan untuk Halaman Ini ---
  const ROLE_ID_TO_MANAGE = 3;

  // --- Memoized Debounce Function ---
  const debouncedGetList = useCallback(
    debounce((params) => getList(params), 400),
    [getList]
  );

  // --- Pengambilan Data Awal ---
  useEffect(() => {
    getList({ role_id: ROLE_ID_TO_MANAGE, sort: sort, page: 1 });
  }, [getList]);

  // --- Event Handlers ---
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = {
      ...newFilters,
      page: 1,
      role_id: ROLE_ID_TO_MANAGE,
      sort: sort,
    };

    if (key !== "q") {
      getList(params);
    } else {
      debouncedGetList(params);
    }
  };

  const handleSortChange = (newSortValue) => {
    setSort(newSortValue);
    getList({
      ...filters,
      page: 1,
      role_id: ROLE_ID_TO_MANAGE,
      sort: newSortValue,
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setFilters({ q: "", status: "" });
    setSort("id:asc");
    try {
      await getList({
        role_id: ROLE_ID_TO_MANAGE,
        sort: "id:asc",
        page: 1,
      });
    } catch (error) {
      toast.error("Gagal memuat ulang data.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handlePageChange = (p) => {
    getList({ ...filters, page: p, role_id: ROLE_ID_TO_MANAGE, sort: sort });
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    getList({
      ...filters,
      page: 1,
      limit: newSize,
      role_id: ROLE_ID_TO_MANAGE,
      sort: sort,
    });
  };

  // --- CRUD Handlers ---
  const openAdd = () => {
    setEditRow(null);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditRow(row);
    setModalOpen(true);
  };

  const closeConfirmDialog = useCallback(() => {
    if (confirmLoading) return;
    setConfirmDialog({ open: false, type: null, row: null, nextStatus: null });
  }, [confirmLoading]);

  const handleConfirmAction = async () => {
    if (!confirmDialog.type || !confirmDialog.row) return;

    setConfirmLoading(true);
    const { type, row, nextStatus } = confirmDialog;

    try {
      if (type === "delete") {
        await remove(row.id);
        toast.success("Pengguna berhasil dihapus.");
      } else if (type === "toggle") {
        await toggleStatus(row.id, nextStatus);
        toast.success("Status pengguna berhasil diubah.");
      }

      await getList({
        ...filters,
        page: pagination.currentPage,
        role_id: ROLE_ID_TO_MANAGE,
        sort: sort,
      });

      setConfirmDialog({ open: false, type: null, row: null, nextStatus: null });
    } catch (e) {
      if (type === "delete") {
        toast.error("Gagal menghapus pengguna.");
      } else {
        toast.error("Gagal mengubah status.");
      }
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleDelete = (row) => {
    setConfirmDialog({ open: true, type: "delete", row, nextStatus: null });
  };

  const handleToggle = (row) => {
    setConfirmDialog({
      open: true,
      type: "toggle",
      row,
      nextStatus: !row.status,
    });
  };


  const confirmRow = confirmDialog.row;
  const confirmIsDelete = confirmDialog.type === "delete";
  const confirmNextStatus = confirmDialog.nextStatus;
  const confirmVariant = confirmIsDelete
    ? "danger"
    : confirmNextStatus
    ? "success"
    : "danger";
  const confirmIcon = confirmIsDelete
    ? Trash2
    : confirmNextStatus
    ? ShieldCheck
    : ShieldBan;
  const confirmTitle = confirmIsDelete
    ? "Hapus Pengguna"
    : confirmNextStatus
    ? "Aktifkan Pengguna"
    : "Nonaktifkan Pengguna";
  const confirmDescription = confirmIsDelete
    ? "Pengguna akan dihapus secara permanen dari sistem. Tindakan ini tidak dapat dibatalkan."
    : confirmNextStatus
    ? "Pengguna akan mendapatkan kembali akses penuh ke platform."
    : "Pengguna tidak akan dapat login hingga Anda mengaktifkannya kembali.";
  const confirmHighlight = confirmRow ? (
    <div className="space-y-2 text-left">
      <p className="text-base font-semibold text-neutral-900">{confirmRow.nama}</p>
      <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">@{confirmRow.username}</p>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500">
        <span>{confirmRow.email || "Belum ada email"}</span>
        <span className="opacity-30">|</span>
        <span>{confirmRow.no_telp || "Belum ada no. telp"}</span>
      </div>
      {confirmDialog.type === "toggle" ? (
        <div className="flex items-center gap-2 text-xs text-neutral-600">
          <span>Status sekarang:</span>
          <span
            className={confirmRow.status ? "font-semibold text-emerald-600" : "font-semibold text-rose-600"}
          >
            {confirmRow.status ? "Aktif" : "Nonaktif"}
          </span>
        </div>
      ) : null}
    </div>
  ) : null;
  const confirmActionText = confirmIsDelete
    ? "Ya, hapus"
    : confirmNextStatus
    ? "Aktifkan sekarang"
    : "Nonaktifkan";
  const handleSubmitForm = async (payload) => {
    // Hanya menerima satu parameter 'payload' (yaitu FormData)
    try {
      if (editRow) {
        await update(editRow.id, payload); // Langsung kirim payload FormData ke fungsi update
        toast.success("Data pengguna berhasil diperbarui!");
      } else {
        await create(payload); // Langsung kirim payload FormData ke fungsi create
        toast.success("Pengguna baru berhasil ditambahkan!");
      }
      setModalOpen(false);
      getList({
        ...filters,
        page: pagination.currentPage,
        role_id: ROLE_ID_TO_MANAGE,
        sort: sort,
      });
    } catch (e) {
      const errorMessage =
        e.response?.data?.message || e.message || "Terjadi kesalahan server";
      toast.error(`Gagal menyimpan: ${errorMessage}`);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Manage Customer</h1>
          <p className="text-sm text-neutral-600">
            Kelola data customer yang terdaftar.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openAdd}
            className="px-3 py-2 rounded-xl bg-indigo-600 text-white flex items-center gap-2"
          >
            <Plus size={18} /> Tambah Customer
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
            size={18}
          />
          <input
            className="w-full pl-10 pr-3 py-2 rounded-xl border border-neutral-300 bg-white"
            placeholder="Cari nama, username, email..."
            value={filters.q}
            onChange={(e) => handleFilterChange("q", e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter size={18} className="text-neutral-500" />
          <select
            className="rounded-xl border px-3 py-2 border-neutral-300 bg-white"
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="true">Aktif</option>
            <option value="false">Nonaktif</option>
          </select>
          <select
            className="rounded-xl border px-3 py-2 border-neutral-300 bg-white"
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="id:asc">Urutan Default</option>
            <option value="full_name:asc">Nama (A-Z)</option>
            <option value="full_name:desc">Nama (Z-A)</option>
            <option value="createdAt:desc">Terbaru Bergabung</option>
            <option value="createdAt:asc">Paling Lama Bergabung</option>
          </select>
          <button
            onClick={handleRefresh}
            className="px-3 py-2 rounded-xl border border-neutral-300 bg-white flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            title="Reload Data"
            disabled={loading || isRefreshing}
          >
            <RefreshCw
              size={16}
              className={cls(isRefreshing && "animate-spin")}
            />
          </button>
        </div>
      </div>

      {/* Tabel */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-200">
        <div className="max-h-[60vh] overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-center px-4 py-3 w-[5%]">No</th>
                <th className="text-left px-4 py-3 w-[25%]">Nama</th>
                <th className="text-left px-4 py-3 w-[10%]">Foto</th>
                {/* {" "} */}

                <th className="text-left px-4 py-3 w-[25%]">Kontak</th>
                <th className="text-center px-4 py-3 w-[15%]">Status</th>
                <th className="text-center px-4 py-3 w-[20%]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading && list.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-neutral-600"
                  >
                    Loading...
                  </td>
                </tr>
              )}
              {!loading && list.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-neutral-600"
                  >
                    Tidak ada data customer.
                  </td>
                </tr>
              )}
              {list.map((row, index) => (
                <tr
                  key={row.id}
                  className="border-b last:border-0 border-neutral-200 hover:bg-neutral-50"
                >
                  <td className="px-4 py-2 text-center">
                    {(pagination.currentPage - 1) * pagination.limit +
                      index +
                      1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{row.nama}</div>
                    <div className="text-neutral-500">@{row.username}</div>
                  </td>
                  <td className="px-4 py-3">
                    {/* {" "} */}
                    {/* Kolom Foto Profil */}
                    <img
                      src={
                        row.profilePicture ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          row.nama
                        )}&background=random`
                      }
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div>{row.email || "-"}</div>
                    <div className="text-neutral-600">{row.no_telp || "-"}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.status ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-green-100 text-green-700 px-2.5 py-1 text-xs font-medium">
                        <ShieldCheck size={14} /> Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full bg-red-100 text-red-700 px-2.5 py-1 text-xs font-medium">
                        <ShieldBan size={14} /> Nonaktif
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleToggle(row)}
                        className={cls(
                          "px-2.5 py-1.5 rounded-xl border text-xs flex items-center gap-1.5",
                          row.status
                            ? "border-red-300 text-red-700"
                            : "border-green-300 text-green-700"
                        )}
                        title={row.status ? "Nonaktifkan" : "Aktifkan"}
                      >
                        {row.status ? (
                          <ShieldBan size={14} />
                        ) : (
                          <ShieldCheck size={14} />
                        )}{" "}
                        {row.status ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                      <button
                        onClick={() => openEdit(row)}
                        className="px-2.5 py-1.5 rounded-xl border text-xs flex items-center gap-1.5"
                        title="Edit"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(row)}
                        className="px-2.5 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 border-red-300 text-red-700"
                        title="Hapus"
                      >
                        <Trash2 size={14} /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginasi */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-gray-50 border-t">
        <div className="flex items-center gap-2 text-sm">
          <span>Tampilkan:</span>
          <select
            className="px-2 py-1 rounded-md border bg-white"
            value={pagination.limit}
            onChange={handlePageSizeChange}
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="text-gray-600">
            Total: {pagination.totalRows} • Halaman {pagination.currentPage} /{" "}
            {pagination.totalPages}
          </span>
        </div>
        <Pagination
          current={pagination.currentPage}
          totalPages={pagination.totalPages}
          onChange={handlePageChange}
        />
      </div>

      <UserFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={editRow}
        onSubmit={handleSubmitForm}
      />
      <AlertConfirmation
        open={confirmDialog.open}
        icon={confirmIcon}
        variant={confirmVariant}
        title={confirmTitle}
        description={confirmDescription}
        highlight={confirmHighlight}
        meta={confirmIsDelete ? "Penghapusan pengguna" : "Perubahan status"}
        confirmText={confirmActionText}
        cancelText="Batal"
        onCancel={closeConfirmDialog}
        onConfirm={handleConfirmAction}
        loading={confirmLoading}
      />
    </div>
  );
}
