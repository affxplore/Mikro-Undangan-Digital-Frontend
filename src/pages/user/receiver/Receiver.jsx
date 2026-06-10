import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Search, UserPlus, Download, CheckCircle, Clock, XCircle, X, Trash2, Edit, Users, FileSpreadsheet } from "lucide-react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import useReceiveInvs from "../../../api/receive-inv/useReceiveInvs";
import useInvitations from "../../../api/invitations/useInvitations";
import Pagination from "../../../components/Pagination"; // 1. Impor komponen Pagination

// Helper debounce untuk input pencarian
function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export default function ReceiverPage() {
  const [filters, setFilters] = useState({
    invitation_id: "",
    search: "",
    status: "all", // "all", "pending", "accepted", "declined"
    page: 1,
    limit: 10,
  });

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentGuest, setCurrentGuest] = useState(null);

  // --- PANGGIL HOOKS ---
  const { data: guests, pagination, loading, getList, create, update, remove } = useReceiveInvs();
  const { data: invitations, getList: getInvitationList } = useInvitations();

  // Ambil daftar undangan untuk dropdown filter
  useEffect(() => {
    getInvitationList({ limit: 999 });
  }, [getInvitationList]);

  useEffect(() => {
    console.log("Current filters:", filters);
    console.log("Available invitations:", invitations);
    if (filters.invitation_id) {
      getList(filters);
    }
  }, [filters, getList, invitations]); // Added invitations to dependency array

  const debouncedSearch = useCallback(debounce((value) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }));
  }, 500), []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const openModal = (guest = null) => {
    if (guest) {
      setIsEditMode(true);
      setCurrentGuest(guest);
    } else {
      setIsEditMode(false);
      setCurrentGuest({ recipient: '', phone_number: '', email: '', status: 'pending' });
    }
    setShowModal(true);
  };

  const handleModalSubmit = async () => {
    if (!currentGuest.recipient || !filters.invitation_id) {
      toast.error("Nama tamu dan pilihan undangan wajib diisi.");
      return;
    }

    const payload = {
      ...currentGuest,
      invitation_id: filters.invitation_id
    };

    if (isEditMode) {
      await update(currentGuest.id, payload);
    } else {
      await create(payload);
    }
    
    getList(filters); // Refresh data
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    // Menggunakan toast konfirmasi custom untuk UX yang lebih baik
    toast.warn(
      ({ closeToast }) => (
        <div>
          <p className="font-bold">Konfirmasi Hapus</p>
          <p>Anda yakin ingin menghapus tamu ini?</p>
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={closeToast} className="px-3 py-1 text-sm rounded bg-gray-200">Batal</button>
            <button onClick={async () => {
              try {
                await remove(id);
                getList(filters); // Refresh data
                toast.success("Tamu berhasil dihapus.");
              } catch (error) {
                toast.error("Gagal menghapus tamu.");
              }
              closeToast();
            }} className="px-3 py-1 text-sm rounded bg-red-600 text-white">Ya, Hapus</button>
          </div>
        </div>
      ), { autoClose: false, closeOnClick: false }
    );
  };

  // Export to CSV
  const exportToCSV = () => {
    const selectedInvitation = invitations.find(inv => inv.id === Number(filters.invitation_id));
    const invitationName = selectedInvitation ? selectedInvitation.name : "guests";
    const sanitizedName = invitationName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    const filename = `${sanitizedName}_guest.csv`;

    const worksheet = XLSX.utils.json_to_sheet(guests);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Guests");
    XLSX.writeFile(workbook, filename);
  };

  // Statistik dihitung dari data pagination yang kembali dari backend
  const stats = useMemo(() => ({
    total: pagination?.totalRows || 0,
    // Note: Untuk stats pending/accepted, idealnya backend memberikan data agregat
    // untuk sementara kita hitung dari data yang tampil di halaman ini saja.
    pending: guests.filter(g => g.status === "pending").length,
    accepted: guests.filter(g => g.status === "accepted").length,
  }), [pagination, guests]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Daftar Penerima
        </h1>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-xl shadow-lg hover:scale-105 transition"
          >
            <FileSpreadsheet size={18} /> Export CSV
          </button>
          <button
            onClick={() => openModal()}
            disabled={!filters.invitation_id}
            className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus size={18} /> Tambah Tamu
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl flex items-center gap-3 shadow">
          <Users className="text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Total Tamu</p>
            <p className="text-xl font-semibold">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl flex items-center gap-3 shadow">
          <Clock className="text-orange-500" />
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-xl font-semibold">{stats.pending}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl flex items-center gap-3 shadow">
          <CheckCircle className="text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Diterima</p>
            <p className="text-xl font-semibold">{stats.accepted}</p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <select
          value={filters.invitation_id}
          onChange={(e) => handleFilterChange('invitation_id', e.target.value)}
          className="bg-white px-3 py-2 rounded-xl shadow"
        >
          <option value="">Pilih Undangan Terlebih Dahulu</option>
          {invitations.map(inv => (
            <option key={inv.id} value={inv.id}>{inv.name}</option>
          ))}
        </select>
        <div className="flex items-center bg-white px-3 py-2 rounded-xl flex-1 shadow">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Cari tamu..."
            className="bg-transparent w-full outline-none"
            onChange={(e) => debouncedSearch(e.target.value)}
            disabled={!filters.invitation_id}
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="bg-white px-3 py-2 rounded-xl shadow"
          disabled={!filters.invitation_id}
        >
          <option value="all">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="declined">Declined</option>
        </select>
      </div>

      {/* Guest Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50">
              <th className="text-left p-4">Nama</th>
              <th className="text-left p-4">Kontak</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-4 text-center text-gray-500">Memuat data...</td></tr>
            ) : !filters.invitation_id ? (
              <tr><td colSpan="5" className="p-4 text-center text-gray-500">Silakan pilih undangan untuk melihat daftar tamu.</td></tr>
            ) : guests.map((g) => (
              <tr key={g.id} className="hover:bg-blue-50 transition">
                <td className="p-4 font-medium">{g.recipient}</td>
                <td className="p-4 text-gray-600">{g.phoneNumber}</td>
                <td className="p-4 text-gray-600">{g.email}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm capitalize ${
                      g.status === "accepted" ? "bg-green-100 text-green-600"
                      : g.status === "pending" ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}>{g.status}</span>
                </td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => openModal(g)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"><Edit size={16}/></button>
                  <button onClick={() => handleDelete(g.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 2. Tambahkan UI Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            current={pagination.currentPage}
            totalPages={pagination.totalPages}
            onChange={handlePageChange}
          />
        </div>
      )}

      {/* Modal Tambah/Edit Tamu */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              {isEditMode ? 'Edit Tamu' : 'Tambah Tamu Baru'}
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="guest-name" className="text-sm font-medium text-gray-600">Nama Tamu</label>
                <input id="guest-name" type="text" placeholder="Nama Tamu" className="mt-1 w-full px-4 py-2 rounded-xl bg-gray-100 outline-none"
                  value={currentGuest.recipient || ''}
                  onChange={(e) => setCurrentGuest({ ...currentGuest, recipient: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="guest-contact" className="text-sm font-medium text-gray-600">Kontak (WhatsApp/Phone)</label>
                <input id="guest-contact" type="text" placeholder="Kontak (WhatsApp/Phone)" className="mt-1 w-full px-4 py-2 rounded-xl bg-gray-100 outline-none"
                  value={currentGuest.phone_number || ''}
                  onChange={(e) => setCurrentGuest({ ...currentGuest, phone_number: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="guest-email" className="text-sm font-medium text-gray-600">Email (Opsional)</label>
                <input id="guest-email" type="email" placeholder="Email (Opsional)" className="mt-1 w-full px-4 py-2 rounded-xl bg-gray-100 outline-none"
                  value={currentGuest.email || ''}
                  onChange={(e) => setCurrentGuest({ ...currentGuest, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="guest-status" className="text-sm font-medium text-gray-600">Status</label>
                <select id="guest-status" className="mt-1 w-full px-4 py-2 rounded-xl bg-gray-100 outline-none"
                  value={currentGuest.status || 'pending'}
                  onChange={(e) => setCurrentGuest({ ...currentGuest, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
              <button
                onClick={handleModalSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg hover:scale-105 transition disabled:opacity-70"
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}