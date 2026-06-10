import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaEdit, FaArrowLeft } from 'react-icons/fa'; 
import usePayment from "../../../api/payment/usePayment";
import Pagination from "../../../components/Pagination";

function debounce(fn, ms) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {      
      fn.apply(this, args);
    }, ms);
  };
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const {
    data,
    loading,
    error,
    pagination,
    getList,
    create,
    update,
    remove, // Nama fungsi yang benar adalah 'remove'
  } = usePayment();

  const [modalOpen, setModalOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState({
    id: null,
    name: "",
    active: true,
    accountNumber: "",
    qrCode: "",
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("id:asc");
  
  const [selectedIds, setSelectedIds] = useState(new Set());

  const debouncedGetList = useCallback(
    debounce((params) => {
      getList({ ...params, page: 1 });
    }, 500),
    [getList]
  );

  useEffect(() => {
    getList({ sort: sort });
  }, [getList]);

  const handleSelectRow = (id) => {
    setSelectedIds(prevSelectedIds => {
      const newSelectedIds = new Set(prevSelectedIds);
      if (newSelectedIds.has(id)) {
        newSelectedIds.delete(id);
      } else {
        newSelectedIds.add(id);
      }
      return newSelectedIds;
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIdsOnPage = new Set(data.map(item => item.id));
      setSelectedIds(allIdsOnPage);
    } else {
      setSelectedIds(new Set());
    }
  };
  
  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;

    if (window.confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.size} item terpilih?`)) {
      try {
        // Ganti 'deletePayment' menjadi 'remove'
        await Promise.all(
          Array.from(selectedIds).map(id => remove(id))
        );
        setSelectedIds(new Set());
        getList({ page: 1, limit: pagination.limit, search: search, status: statusFilter, sort: sort });
      } catch (error) {
        alert("Gagal menghapus beberapa item.");
        console.error(error);
      }
    }
  };
  
  const handleSearchChange = (e) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    debouncedGetList({ search: newSearch, status: statusFilter, sort: sort });
  };
  
  const handleStatusFilterChange = (e) => {
    const newStatus = e.target.value;
    setStatusFilter(newStatus);
    getList({ page: 1, search: search, status: newStatus, sort: sort });
  };
  
  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSort(newSort);
    getList({ page: 1, search: search, status: statusFilter, sort: newSort });
  };

  const handlePageChange = (newPage) => {
    getList({ page: newPage, search: search, status: statusFilter, sort: sort });
  };
  
  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);
    getList({ page: 1, limit: newLimit, search: search, status: statusFilter, sort: sort });
  };
  
  const openModal = (payment = { id: null, name: "", active: true, accountNumber: "", qrCode: "" }) => {
    setCurrentPayment(payment);
    setModalOpen(true);
  };

  const closeModal = () => {
    setCurrentPayment({ id: null, name: "", active: true, accountNumber: "", qrCode: "" });
    setModalOpen(false);
  };

  const savePayment = async () => {
    if (!currentPayment.name.trim()) {
      alert("Nama metode tidak boleh kosong");
      return;
    }

    try {
      if (currentPayment.id) {
        await update(currentPayment.id, currentPayment); // Menggunakan 'update'
      } else {
        await create(currentPayment); // Menggunakan 'create'
      }
      closeModal();
      getList({ page: pagination.currentPage, limit: pagination.limit, search: search, status: statusFilter, sort: sort });
    } catch (error) {
      alert("Error saving payment method");
      console.error(error);
    }
  };

  const isAllSelectedOnPage = data.length > 0 && data.every(item => selectedIds.has(item.id));

  if (loading && data.length === 0) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-8">Error loading data: {error.message}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200" title="Kembali">
          <FaArrowLeft className="text-gray-700 text-lg" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Metode Pembayaran</h1>
          <p className="text-gray-500 text-sm mt-0.5">Kelola semua cara pembayaran yang tersedia di sistem Anda.</p>
        </div>
      </div>
      
      {/* ===== TOOLBAR BARU ===== */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-3">
        {/* Grup Kiri: Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <input
            type="text"
            placeholder="🔍 Cari metode..."
            value={search}
            onChange={handleSearchChange}
            className="border border-slate-300 rounded-md p-2 text-sm w-full sm:w-60"
          />
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="border border-slate-300 rounded-md p-2 text-sm w-full sm:w-auto"
          >
            <option value="">Semua Status</option>
            <option value="true">Aktif</option>
            <option value="false">Nonaktif</option>
          </select>
          <select
            value={sort}
            onChange={handleSortChange}
            className="border border-slate-300 rounded-md p-2 text-sm w-full sm:w-auto"
          >
            <option value="id:asc">Urutan Default</option>
            <option value="name:asc">Nama (A-Z)</option>
            <option value="name:desc">Nama (Z-A)</option>
            <option value="isActive:desc">Aktif (Asc)</option>
            <option value="isActive:asc">Aktif (Desc)</option>
          </select>
        </div>
        
        {/* Grup Kanan: Tombol Aksi */}
        <div className="flex gap-3">
          {/* Tombol Hapus Terpilih */}
          <button
            onClick={handleDeleteSelected}
            disabled={selectedIds.size === 0}
            className={`p-3 rounded-md shadow-lg flex items-center justify-center transition duration-200 ${
              selectedIds.size > 0
                ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 text-white"
                : "bg-gray-300 cursor-not-allowed text-white"
            }`}
            title="Hapus Item Terpilih"
          >
            <FaTrash />
          </button>

          {/* Tombol Tambah */}
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-indigo-400 hover:to-violet-500 text-white p-3 rounded-md shadow-lg flex items-center justify-center"
            title="Tambah Metode Pembayaran"
          >
            <FaPlus />
          </button>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-hidden rounded-lg shadow border border-gray-200">
        <table className="w-full border-collapse">
          <thead className="bg-blue-50 text-gray-700">
            <tr>
              <th className="border px-4 py-3 w-12">
                <input 
                  type="checkbox" 
                  className="w-4 h-4"
                  checked={isAllSelectedOnPage}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="border px-4 py-3">No</th>
              <th className="border px-4 py-3">Nama Metode</th>
              <th className="border px-4 py-3">No. Rek</th>
              <th className="border px-4 py-3">QR Code</th>
              <th className="border px-4 py-3">Status</th>
              <th className="border px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.length > 0 ? (
              data.map((p, index) => (
                <tr key={p.id} className={`text-center transition ${selectedIds.has(p.id) ? 'bg-blue-100' : 'hover:bg-gray-50'}`}>
                  <td className="border px-4 py-2">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4"
                      checked={selectedIds.has(p.id)}
                      onChange={() => handleSelectRow(p.id)}
                    />
                  </td>
                  <td className="border px-4 py-2">{(pagination.currentPage - 1) * pagination.limit + index + 1}</td>
                  <td className="border px-4 py-2 font-medium">{p.name}</td>
                  <td className="border px-4 py-2 text-gray-600">{p.accountNumber || "-"}</td>
                  <td className="border px-4 py-2">
                    {p.qrCode ? (
                      <img src={p.qrCode} alt="QR Code" className="w-8 h-8 mx-auto object-cover rounded shadow" />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        p.active ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      }`}
                    >
                      {p.active ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="border px-4 py-2 pl-12">
                    <button
                      onClick={() => openModal(p)}
                      className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 cursor-pointer transition"
                    >
                      <FaEdit className="text-blue-500 text-xs" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="border px-4 py-4 text-center text-gray-500">
                  Tidak ada data yang cocok dengan filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-gray-50 border-t">
          <div className="flex items-center gap-2 text-sm">
            <span>Tampilkan:</span>
            <select
              className="px-2 py-1 rounded-md border bg-white"
              value={pagination.limit}
              onChange={handleLimitChange}
            >
              {[10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span className="text-gray-600">
              Total: {pagination.totalRows} • Halaman {pagination.currentPage} / {pagination.totalPages}
            </span>
          </div>
          <Pagination
            current={pagination.currentPage}
            totalPages={pagination.totalPages}
            onChange={handlePageChange}
          />
        </div>
      </div>
      
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-96 animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {currentPayment.id ? "✏️ Edit Metode" : "➕ Tambah Metode"}
            </h2>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-600">Nama Metode</label>
              <input
                type="text"
                className="border px-3 py-2 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                value={currentPayment.name}
                onChange={(e) =>
                  setCurrentPayment({ ...currentPayment, name: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-600">No. Rekening</label>
              <input
                type="text"
                className="border px-3 py-2 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                value={currentPayment.accountNumber}
                onChange={(e) =>
                  setCurrentPayment({
                    ...currentPayment,
                    accountNumber: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-600">QR Code (File)</label>
              <input
                type="file" // Ubah jadi tipe file
                className="border px-3 py-2 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                onChange={(e) =>
                  setCurrentPayment({
                    ...currentPayment,
                    qrCode: e.target.files[0], // Ambil file-nya
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label className="flex items-center gap-2 text-gray-600 text-sm">
                <input
                  type="checkbox"
                  checked={currentPayment.active}
                  onChange={(e) =>
                    setCurrentPayment({
                      ...currentPayment,
                      active: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                Aktif
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg border shadow hover:bg-gray-100 transition"
                onClick={closeModal}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-blue-500 text-white shadow hover:bg-blue-600 transition"
                onClick={savePayment}
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