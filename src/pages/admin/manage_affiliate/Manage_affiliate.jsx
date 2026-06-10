import React, { useState } from "react";
import {
  FaSearch,
  FaUsers,
  FaDollarSign,
  FaChartLine,
} from "react-icons/fa";

const dummyPackages = [
  { id: 1, name: "Basic", commission: "50.000" },
  { id: 2, name: "Pro", commission: "75.000" },
  { id: 3, name: "Business", commission: "100.000" },
];

const dummyUsers = [
  { id: 1, name: "Faiz", referral: "ABC123", total: "200.000", used_code: "5" },
  { id: 2, name: "Ardi", referral: "XYZ789", total: "500.000", used_code: "7" },
  { id: 3, name: "Budi", referral: "LMN456", total: "300.000", used_code: "6" },
  { id: 4, name: "Rina", referral: "DEF987", total: "600.000", used_code: "8" },
  { id: 5, name: "Andi", referral: "GHI123", total: "150.000", used_code: "4" },
  { id: 6, name: "Fani", referral: "JKL321", total: "350.000", used_code: "9" },
  { id: 7, name: "Sarah", referral: "MNO654", total: "450.000", used_code: "5" },
  { id: 8, name: "Lina", referral: "PQR852", total: "700.000", used_code: "10" },
  { id: 9, name: "Deni", referral: "STU753", total: "250.000", used_code: "3" },
  { id: 10, name: "Maya", referral: "VWX246", total: "400.000", used_code: "7" },
  { id: 11, name: "Agus", referral: "YZA678", total: "550.000", used_code: "6" },
  { id: 12, name: "Vera", referral: "BCD910", total: "600.000", used_code: "8" },
  { id: 13, name: "Irma", referral: "EFG121", total: "650.000", used_code: "4" },
  { id: 14, name: "Krisna", referral: "HIJ314", total: "350.000", used_code: "9" },
  { id: 15, name: "Tina", referral: "KLM415", total: "500.000", used_code: "10" },
  { id: 16, name: "Nina", referral: "NOP516", total: "600.000", used_code: "5" },
  { id: 17, name: "Arif", referral: "QRS617", total: "450.000", used_code: "8" },
  { id: 18, name: "Rudi", referral: "TUV718", total: "300.000", used_code: "6" },
  { id: 19, name: "Eka", referral: "WXY819", total: "550.000", used_code: "7" },
  { id: 20, name: "Miftah", referral: "ZAB920", total: "400.000", used_code: "6" },
];

const dummyReferralHistory = [
  {
    date: "2025-08-01",
    orderId: "ORD001",
    customer: "Adi",
    package: "Basic",
    commission: "100.000",
    status: "Approved",
  },
  {
    date: "2025-08-02",
    orderId: "ORD002",
    customer: "Bobi",
    package: "Pro",
    commission: "125.000",
    status: "Pending",
  },
];

const dummyWithdrawals = [
  { date: "2025-08-05", method: "Bank", amount: "500.000", status: "Success" },
  {
    date: "2025-08-10",
    method: "E-Wallet",
    amount: "300.000",
    status: "Pending",
  },
];

const ManageAffiliate = () => {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of users per page

  // Filter users based on search input
  const filteredUsers = dummyUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.referral.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate the current page data
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Total number of pages
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Pagination handler
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="-ml-3.5 -mt-4 mb-4 font-bold text-slate-800 text-3xl">
        Manage Affiliate
      </h1>
      <p className="-ml-3 -mt-2 mb-4 text-slate-800 text-base">
        Kelola Data yang berhubungan dengan Affiliate, seperti paket komisi,
        total komisi tiap user, dan riwayat referral.
      </p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow flex items-center">
          <FaUsers className="text-3xl text-blue-500 mr-4" />
          <div>
            <div className="text-gray-500 text-sm">Total Affiliator</div>
            <div className="text-xl font-bold">150</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow flex items-center">
          <FaDollarSign className="text-3xl text-green-500 mr-4" />
          <div>
            <div className="text-gray-500 text-sm">Total Commission</div>
            <div className="text-xl font-bold">Rp 5.000.000</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow flex items-center">
          <FaChartLine className="text-3xl text-purple-500 mr-4" />
          <div>
            <div className="text-gray-500 text-sm">Commissions Paid</div>
            <div className="text-xl font-bold">Rp 2.500.000</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search affiliate..."
            className="w-full pl-10 pr-4 py-2 rounded shadow border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Table Komisi Tiap Paket */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-bold mb-4">Paket Komisi</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Nama Paket</th>
              <th className="p-2 border">Komisi Referral</th>
            </tr>
          </thead>
          <tbody>
            {dummyPackages.map((p) => (
              <tr key={p.id}>
                <td className="p-2 border">{p.id}</td>
                <td className="p-2 border">{p.name}</td>
                <td className="p-2 border">Rp {p.commission}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Total Komisi Tiap User */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-bold mb-4">Komisi Pengguna</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Nama User</th>
              <th className="p-2 border">Kode Referral</th>
              <th className="p-2 border">Total Komisi</th>
              <th className="p-2 border">Total Referal Digunakan</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((u) => (
              <tr key={u.id}>
                <td className="p-2 border">{u.id}</td>
                <td className="p-2 border">{u.name}</td>
                <td className="p-2 border text-center">{u.referral}</td>
                <td className="p-2 border text-center">Rp {u.total}</td>
                <td className="p-2 border text-center">{u.used_code}</td>
                <td className="p-2 border space-x-2 text-center">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                    onClick={() => setSelectedUser(u)}
                  >
                    Detail
                  </button>
                  <button className="px-2 py-1 bg-red-500 text-white rounded text-sm">
                    Banned
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Previous
          </button>
          <div className="flex items-center space-x-2">
            <span>Page {currentPage} of {totalPages}</span>
          </div>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* Popup Detail */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-3/4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Detail User: {selectedUser.name}</h2>

            {/* Riwayat Referral */}
            <h3 className="text-lg font-semibold mb-2">Riwayat Referral</h3>
            <table className="w-full border mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Tanggal</th>
                  <th className="p-2 border">Order ID</th>
                  <th className="p-2 border">Customer</th>
                  <th className="p-2 border">Nama Paket</th>
                  <th className="p-2 border">Komisi</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {dummyReferralHistory.map((r, i) => (
                  <tr key={i}>
                    <td className="p-2 border">{r.date}</td>
                    <td className="p-2 border">{r.orderId}</td>
                    <td className="p-2 border">{r.customer}</td>
                    <td className="p-2 border">{r.package}</td>
                    <td className="p-2 border">Rp {r.commission}</td>
                    <td className="p-2 border">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Riwayat Penarikan */}
            <h3 className="text-lg font-semibold mb-2">Riwayat Penarikan</h3>
            <table className="w-full border mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Tanggal</th>
                  <th className="p-2 border">Metode</th>
                  <th className="p-2 border">Jumlah</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {dummyWithdrawals.map((w, i) => (
                  <tr key={i}>
                    <td className="p-2 border">{w.date}</td>
                    <td className="p-2 border">{w.method}</td>
                    <td className="p-2 border">Rp {w.amount}</td>
                    <td className="p-2 border">{w.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAffiliate;
