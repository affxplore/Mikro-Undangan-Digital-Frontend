/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  ArrowLeft,
} from "lucide-react";
import useUsers from "../../../api/users/useUsers";
import Pagination from "../../../components/Pagination";
// import apiService from "../../../api/apiService"; // 1. Impor apiService
import useRole from "../../../api/role/useRole"; // Impor useRole untuk mendapatkan daftar role
import { toast } from "react-toastify";

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

// Komponen Modal (tidak ada perubahan)
function StaffFormModal({ open, onClose, initial, onSubmit, roles = [] }) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const isEdit = Boolean(initial?.id);

  useEffect(() => {
    if (open) {
      // Set nilai awal form, pastikan menggunakan role_id
      setForm({
        nama: initial?.nama || "",
        username: initial?.username || "",
        password: "",
        email: initial?.email || "",
        no_telp: initial?.no_telp || "",
        role_id: initial?.role_id || roles[0]?.id || "", // Gunakan role_id
        status: initial?.status ?? true,
      });
      setErrors({});
    }
  }, [open, initial, roles]);

  const validate = () => {
    const e = {};
    if (!form.nama || !form.nama.trim()) e.nama = "Nama wajib";
    if (!form.username || !form.username.trim()) e.username = "Username wajib";
    if (!isEdit && (!form.password || !form.password.trim()))
      e.password = "Password wajib";
    if (form.email && !(form.email.includes("@") && form.email.includes(".")))
      e.email = "Email tidak valid";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const payload = { ...form };
    if (isEdit && !payload.password) delete payload.password;

    // Konversi role_id ke angka sebelum submit
    payload.role_id = parseInt(payload.role_id, 10);
    onSubmit(payload);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-2">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
          <h3 className="text-lg font-semibold">
            {isEdit ? "Edit Staff" : "Tambah Staff"}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-black/5">
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5"
        >
          <div>
            <label className="text-sm">Nama</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none border-neutral-300 bg-white"
              value={form.nama}
              onChange={(e) => setForm((s) => ({ ...s, nama: e.target.value }))}
              placeholder="Nama lengkap"
            />
            {errors.nama && (
              <p className="text-xs text-red-600 mt-1">{errors.nama}</p>
            )}
          </div>
          <div>
            <label className="text-sm">Username</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none border-neutral-300 bg-white"
              value={form.username}
              onChange={(e) =>
                setForm((s) => ({ ...s, username: e.target.value }))
              }
              placeholder="Username unik"
            />
            {errors.username && (
              <p className="text-xs text-red-600 mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="text-sm">
              Password{" "}
              {isEdit && (
                <span className="opacity-60">(kosongkan jika tidak ganti)</span>
              )}
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none border-neutral-300 bg-white"
              value={form.password}
              onChange={(e) =>
                setForm((s) => ({ ...s, password: e.target.value }))
              }
              placeholder={isEdit ? "(opsional)" : "Password"}
            />
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="text-sm">Role</label>
            {/* Ubah select untuk bekerja dengan role_id */}
            <select
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none border-neutral-300 bg-white"
              value={form.role_id}
              onChange={(e) =>
                setForm((s) => ({ ...s, role_id: e.target.value }))
              }
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm">Email</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none border-neutral-300 bg-white"
              value={form.email}
              onChange={(e) =>
                setForm((s) => ({ ...s, email: e.target.value }))
              }
              placeholder="email@contoh.com"
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="text-sm">No. Telp</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none border-neutral-300 bg-white"
              value={form.no_telp}
              onChange={(e) =>
                setForm((s) => ({ ...s, no_telp: e.target.value }))
              }
              placeholder="08xxxxxxxxxx"
            />
          </div>
          <div className="flex items-center gap-3 sm:col-span-2">
            <input
              id="status"
              type="checkbox"
              className="scale-110"
              checked={form.status}
              onChange={(e) =>
                setForm((s) => ({ ...s, status: e.target.checked }))
              }
            />
            <label htmlFor="status" className="select-none">
              Aktif?
            </label>
          </div>

          <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-2">
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

// Komponen Utama
export default function Staff() {
  const navigate = useNavigate();
  const {
    data: list,
    loading,
    error,
    pagination,
    getList,
    create,
    update,
    remove,
    toggleStatus,
  } = useUsers();

  const [filters, setFilters] = useState({ q: "", role_id: "", status: "" }); // Ganti 'role' menjadi 'role_id'
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  // const [availableRoles, setAvailableRoles] = useState([]);
  // const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [sort, setSort] = useState("id:asc");
  const [isRefreshing, setIsRefreshing] = useState(false); 
  const initialFilters = { q: "", role_id: "", status: "" };
  const initialSort = "id:asc";

  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: null, row: null, nextStatus: null });
  const [confirmLoading, setConfirmLoading] = useState(false);


  // 2. Buat fungsi untuk fetch roles dari backend
  const { rolesData: allRoles, rolesLoading } = useRole();

  const debouncedGetList = useCallback(
    debounce((params) => getList(params), 400),
    [getList] // Tambahkan dependensi jika diperlukan oleh hook useUsers
  );
  // 3. Gunakan useMemo untuk memfilter peran yang akan ditampilkan di dropdown.
  // Logika: Tampilkan semua role KECUALI role dengan id 3.
  const availableRoles = useMemo(() => {
    if (Array.isArray(allRoles)) {
      return allRoles.filter((role) => role.id !== 3);
    }
    return [];
  }, [allRoles]);

  // 3. Panggil fetchRoles saat komponen pertama kali dimuat
  useEffect(() => {
    getList({ exclude_role_id: 3, sort: sort, ...filters, page: 1 });
  }, []);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters };
    if (key === "role_id") {
      newFilters[key] = value === "" ? "" : parseInt(value, 10);
    } else {
      newFilters[key] = value;
    }
    setFilters(newFilters);

    if (key !== "q") {
      getList({ ...newFilters, page: 1, exclude_role_id: 3, sort: sort });
    } else {
      // 2. Gunakan kembali debouncedGetList di sini untuk pencarian
      debouncedGetList({ ...newFilters, page: 1, exclude_role_id: 3, sort: sort });
    }
  };

const handleRefresh = async () => {
    setIsRefreshing(true); // Mulai animasi loading

    // 1. Reset state filter ke nilai awal
    setFilters(initialFilters);
    setSort(initialSort);

    try {
      // 2. Panggil getList dengan parameter yang sudah direset
      await getList({
        ...initialFilters,
        sort: initialSort,
        page: 1, // Selalu kembali ke halaman 1 saat reset total
        exclude_role_id: 3,
      });
    } catch (error) {
      toast.error("Gagal memuat ulang data.");
    } finally {
      setIsRefreshing(false); // Hentikan animasi loading
    }
  };

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

  const openDeleteDialog = (row) => {
    setConfirmDialog({ open: true, type: "delete", row, nextStatus: null });
  };

  const openToggleDialog = (row) => {
    setConfirmDialog({ open: true, type: "toggle", row, nextStatus: !row.status });
  };

  const handleConfirmDialog = async () => {
    if (!confirmDialog.type || !confirmDialog.row) return;

    setConfirmLoading(true);
    const { type, row, nextStatus } = confirmDialog;

    try {
      if (type === "delete") {
        await remove(row.id);
        toast.success("User berhasil dihapus.");
      } else if (type === "toggle") {
        await toggleStatus(row.id, nextStatus);
        toast.success("Status user berhasil diubah.");
      }

      await getList({ ...filters, exclude_role_id: 3 });
      setConfirmDialog({ open: false, type: null, row: null, nextStatus: null });
    } catch (e) {
      if (type === "delete") {
        toast.error("Gagal menghapus user." + String(e.message || e));
      } else {
        toast.error("Gagal mengubah status." + String(e.message || e));
      }
    } finally {
      setConfirmLoading(false);
    }
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
    ? "Hapus Staff"
    : confirmNextStatus
    ? "Aktifkan Staff"
    : "Nonaktifkan Staff";
  const confirmDescription = confirmIsDelete
    ? "Staff akan dihapus secara permanen dari daftar."
    : confirmNextStatus
    ? "Staff ini akan dapat mengakses platform lagi."
    : "Staff akan kehilangan akses hingga diaktifkan kembali.";
  const confirmHighlight = confirmRow ? (
    <div className="space-y-2 text-left">
      <p className="text-base font-semibold text-neutral-900">{confirmRow.nama}</p>
      <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">@{confirmRow.username}</p>
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
    try {
      if (editRow) {
        await update(editRow.id, payload);
        // 2. Tampilkan notifikasi sukses untuk edit
        toast.success("Data staff berhasil diperbarui!");
      } else {
        await create(payload);
        // 2. Tampilkan notifikasi sukses untuk tambah baru
        toast.success("Staff baru berhasil ditambahkan!");
      }
      setModalOpen(false);
      await getList({ ...filters, exclude_role_id: 3 });
    } catch (e) {
      // 3. Tampilkan notifikasi error
      const errorMessage =
        e.response?.data?.message || e.message || "Terjadi kesalahan server";
      toast.error(`Gagal menyimpan: ${errorMessage}`);
    }
  };
  const handlePageChange = (p) => {
    getList({ ...filters, page: p, exclude_role_id: 3, sort: sort }); // Tambahkan sort
  };
  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    getList({
      ...filters,
      page: 1,
      limit: newSize,
      exclude_role_id: 3,
      sort: sort,
    }); // Tambahkan sort
  };

  const handleSortChange = (newSortValue) => {
    setSort(newSortValue);
    // Panggil getList dengan filter yang ada dan urutan baru
    getList({ ...filters, page: 1, exclude_role_id: 3, sort: newSortValue });
  };
  // Fungsi ini tidak lagi digunakan karena dropdown-nya dihapus
  // const handleLimitChange = (e) => { ... };

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200" title="Kembali">
            <ArrowLeft className="text-gray-700" size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Manage Staff</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Kelola staff dan tetapkan role.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* 1. Tombol Reload di sini dihapus */}
          <button
            onClick={openAdd}
            className="px-3 py-2 rounded-xl bg-indigo-600 text-white flex items-center gap-2"
          >
            <Plus size={18} /> Tambah Staff
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
            placeholder="Cari nama, username..."
            value={filters.q}
            onChange={(e) => handleFilterChange("q", e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {" "}
          {/* Gunakan flex-wrap jika layar kecil */}
          <Filter size={18} className="text-neutral-500" />
          {/* Filter Role */}
          <select
            className="rounded-xl border px-3 py-2 border-neutral-300 bg-white"
            value={filters.role_id}
            onChange={(e) => handleFilterChange("role_id", e.target.value)}
            disabled={rolesLoading} // 5. Tambahkan disabled saat loading roles
          >
            <option value="">Semua Role</option>
            {availableRoles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          {/* Filter Status */}
          <select
            className="rounded-xl border px-3 py-2 border-neutral-300 bg-white"
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="true">Aktif</option>
            <option value="false">Nonaktif</option>
          </select>
          {/* ===== TAMBAHAN: Dropdown Urutan/Sort ===== */}
          <select
            className="rounded-xl border px-3 py-2 border-neutral-300 bg-white" // Sesuaikan style dengan filter lain
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="id:asc">Urutan Default</option>
            <option value="full_name:asc">Nama (A-Z)</option>
            <option value="full_name:desc">Nama (Z-A)</option>
            <option value="createdAt:desc">Terbaru Dibuat</option>
            <option value="createdAt:asc">Terlama Dibuat</option>
            <option value="isActive:desc">Aktif (Asc)</option>
            <option value="isActive:asc">Aktif (Desc)</option>
            {/* Catatan: Label untuk boolean bisa membingungkan. 
              Saran label yang lebih jelas untuk isActive:
              <option value="isActive:desc">Status (Aktif Dahulu)</option>
              <option value="isActive:asc">Status (Nonaktif Dahulu)</option>
            */}
          </select>
          {/* 2. Dropdown item per halaman diganti dengan tombol Reload */}
          <button
            onClick={handleRefresh}
            className="px-3 py-2 rounded-xl border border-neutral-300 bg-white flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            title="Reload Data"
            disabled={loading || isRefreshing} // Nonaktifkan tombol saat loading
          >
            <RefreshCw
              size={16}
              className={cls(
                "text-neutral-600",
                isRefreshing && "animate-spin" // Tambahkan animasi putar jika isRefreshing true
              )}
            />
          </button>
        </div>
      </div>

      {/* Tabel */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-200">
        <div className="max-h-[60vh] overflow-auto">
          <table className="min-w-full text-sm table-fixed">
            <thead className="sticky top-0 bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-center px-4 py-3 w-[25%]">No</th>
                <th className="text-left px-4 py-3 w-[15%]">Name</th>
                <th className="text-left px-4 py-3 w-[10%]">Role</th>
                <th className="text-left px-4 py-3 w-[20%]">Contact</th>
                <th className="text-center px-4 py-3 w-[10%]">Status</th>
                <th className="text-center px-4 py-3 w-[20%]">Action</th>
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
                    Tidak ada data
                  </td>
                </tr>
              )}

              {list.map((row, index) => (
                <tr
                  key={row.id}
                  className="border-b last:border-0 border-neutral-200 hover:bg-neutral-50"
                >
                  {/* {" "} */}
                  <td className="px-4 py-2 text-center">
                    {(pagination.currentPage - 1) * pagination.limit +
                      index +
                      1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{row.nama}</div>
                    <div className="text-neutral-500">@{row.username}</div>
                  </td>
                  {/* <td className="px-4 py-3">{row.username}</td> */}
                  <td className="px-4 py-3">{row.role || "-"}</td>
                  <td className="px-4 py-3">
                    <div>{row.email || "-"}</div>
                    <div className="text-neutral-600">{row.no_telp || "-"}</div>
                  </td>
                  <td className="px-4 py-3">
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
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openToggleDialog(row)}
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
                        onClick={() => openDeleteDialog(row)}
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

      {/* ===== PERUBAHAN FOOTER PAGINASI DIMULAI DI SINI ===== */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-gray-50 border-t">
        <div className="flex items-center gap-2 text-sm">
          <span>Tampilkan:</span>
          <select
            className="px-2 py-1 rounded-md border bg-white"
            value={pagination.limit || 10}
            onChange={handlePageSizeChange}
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="text-gray-600">
            Total: {pagination.totalRows || 0} • Halaman{" "}
            {pagination.currentPage || 1} / {pagination.totalPages || 1}
          </span>
        </div>
        <Pagination
          current={pagination.currentPage || 1}
          totalPages={pagination.totalPages || 1}
          onChange={handlePageChange}
        />
      </div>

      <StaffFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={editRow}
        onSubmit={handleSubmitForm}
        roles={availableRoles} // 6. Pastikan modal juga menggunakan availableRoles yang sudah difilter
      />
      <AlertConfirmation
        open={confirmDialog.open}
        icon={confirmIcon}
        variant={confirmVariant}
        title={confirmTitle}
        description={confirmDescription}
        highlight={confirmHighlight}
        meta={confirmIsDelete ? "Penghapusan staff" : "Perubahan status"}
        confirmText={confirmActionText}
        cancelText="Batal"
        onCancel={closeConfirmDialog}
        onConfirm={handleConfirmDialog}
        loading={confirmLoading}
      />
    </div>
  );
}
