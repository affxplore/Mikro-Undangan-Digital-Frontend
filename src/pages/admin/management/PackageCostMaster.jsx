import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useDiscount from "../../../api/discount/useDiscount";
import Pagination from "../../../components/Pagination";
import { FaArrowLeft } from "react-icons/fa";
import { Trash2 } from "lucide-react";

import { toast } from "react-toastify";
import AlertConfirmation from "../../../components/AlertConfirmation";
// Helper format tanggal biar rapih
const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function PackageCostPage() {
  const {
    data,
    loading,
    error,
    pagination,
    getList,
    create,
    update,
    remove,
  } = useDiscount();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    id: null,
    name: "",
    promo: "",
    voucher: "",
  });

  const [confirmDialog, setConfirmDialog] = useState({ open: false, pkg: null });
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [sortConfig, setSortConfig] = useState({
    key: "createdAt", // default sorting
    direction: "desc",
  });

  useEffect(() => {
    getList({ page: pagination.currentPage, limit: pagination.limit });
  }, [getList, pagination.currentPage, pagination.limit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddOrUpdatePackage = async () => {
    if (!form.name || !form.promo || !form.voucher) {
      toast.error("Nama, promo, dan voucher wajib diisi.");
      return;
    }

    try {
      if (form.id) {
        await update(form.id, form);
        toast.success("Paket berhasil diperbarui.");
      } else {
        await create(form);
        toast.success("Paket baru berhasil disimpan.");
      }

      setForm({ id: null, name: "", promo: "", voucher: "" });
      getList({ page: pagination.currentPage, limit: pagination.limit });
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Terjadi kesalahan saat menyimpan paket.";
      toast.error(message);
    }
  };

  const handleEditPackage = (pkg) => {
    setForm({
      id: pkg.id,
      name: pkg.name,
      promo: pkg.promo,
      voucher: pkg.voucher,
    });
  };

  const openDeleteDialog = (pkg) => {
    setConfirmDialog({ open: true, pkg });
  };

  const closeDeleteDialog = () => {
    if (confirmLoading) return;
    setConfirmDialog({ open: false, pkg: null });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.pkg) return;

    setConfirmLoading(true);
    try {
      await remove(confirmDialog.pkg.id);
      toast.success("Paket berhasil dihapus.");
      getList({ page: pagination.currentPage, limit: pagination.limit });
      setConfirmDialog({ open: false, pkg: null });
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Terjadi kesalahan saat menghapus paket.";
      toast.error(message);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ id: null, name: "", promo: "", voucher: "" });
  };

  const handlePageChange = (newPage) => {
    getList({ page: newPage });
  };

  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);
    getList({ page: 1, limit: newLimit });
  };

  // Handle sorting toggle
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  // Sort data berdasarkan config
  const confirmPackage = confirmDialog.pkg;
  const confirmHighlight = confirmPackage ? (
    <div className="space-y-2 text-left">
      <p className="text-base font-semibold text-neutral-900">{confirmPackage.name}</p>
      <div className="text-xs text-neutral-600">Promo: {confirmPackage.promo}% | Voucher: {confirmPackage.voucher}</div>
    </div>
  ) : null;

  const sortedData = [...data].sort((a, b) => {
    const aVal = new Date(a[sortConfig.key]);
    const bVal = new Date(b[sortConfig.key]);

    if (sortConfig.direction === "asc") {
      return aVal - bVal;
    }
    return bVal - aVal;
  });

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200" title="Kembali">
          <FaArrowLeft className="text-gray-700 text-lg" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Manajemen Paket dan Harga</h1>
          <p className="text-gray-500 text-sm mt-0.5">Atur harga, promo, dan voucher diskon.</p>
        </div>
      </div>

      {/* Form Tambah/Edit Paket */}
      <div className="mb-6 p-4 border rounded-lg shadow-sm">
        <h2 className="font-semibold mb-2">
          {form.id ? "Edit Paket" : "Tambah Paket"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Nama Paket"
            value={form.name}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="promo"
            placeholder="Promo"
            value={form.promo}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="voucher"
            placeholder="Voucher Diskon"
            value={form.voucher}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleAddOrUpdatePackage}
            className={`px-4 py-2 rounded text-white ${
              form.id
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {form.id ? "Update Paket" : "Simpan Paket"}
          </button>
          {form.id && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
            >
              Batal
            </button>
          )}
        </div>
      </div>

      {/* Tabel Paket */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border">Nama Paket</th>
              <th className="py-2 px-4 border">Promo</th>
              <th className="py-2 px-4 border">Voucher Diskon</th>
              <th
                className="py-2 px-4 border cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("createdAt")}
              >
                Dibuat Pada{" "}
                {sortConfig.key === "createdAt" &&
                  (sortConfig.direction === "asc" ? "â†‘" : "â†“")}
              </th>
              <th
                className="py-2 px-4 border cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("updatedAt")}
              >
                Diperbarui Pada{" "}
                {sortConfig.key === "updatedAt" &&
                  (sortConfig.direction === "asc" ? "â†‘" : "â†“")}
              </th>
              <th className="py-2 px-4 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((pkg) => (
                <tr key={pkg.id} className="text-center">
                  <td className="py-2 px-4 border">{pkg.name}</td>
                  <td className="py-2 px-4 border">{pkg.promo} %</td>
                  <td className="py-2 px-4 border">{pkg.voucher}</td>
                  <td className="py-2 px-4 border">
                    {formatDate(pkg.createdAt)}
                  </td>
                  <td className="py-2 px-4 border">
                    {formatDate(pkg.updatedAt)}
                  </td>
                  <td className="py-2 px-4 border flex justify-center gap-2">
                    <button
                      onClick={() => handleEditPackage(pkg)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteDialog(pkg)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="py-2 px-4 border text-center text-gray-500"
                >
                  Tidak ada paket
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-gray-50 border-t">
        <div className="flex items-center gap-2 text-sm">
          <span>Tampilkan:</span>
          <select
            className="px-2 py-1 rounded-md border bg-white"
            value={pagination.limit}
            onChange={handleLimitChange}
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="text-gray-600">
            Total: {pagination.totalRows} | Halaman {pagination.currentPage} /{" "}
            {pagination.totalPages}
          </span>
        </div>
        <Pagination
          current={pagination.currentPage}
          totalPages={pagination.totalPages}
          onChange={handlePageChange}
        />
      </div>
      <AlertConfirmation
        open={confirmDialog.open}
        icon={Trash2}
        variant="danger"
        title="Hapus Paket"
        description="Paket akan dihapus secara permanen dari daftar."
        highlight={confirmHighlight}
        meta="Penghapusan paket"
        confirmText="Ya, hapus"
        cancelText="Batal"
        onCancel={closeDeleteDialog}
        onConfirm={handleConfirmDelete}
        loading={confirmLoading}
      />
    </div>
  );
}
