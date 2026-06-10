// /* eslint-disable no-unused-vars */
// import React from "react";
// import { FaUsers, FaMoneyBillWave, FaCalendarAlt, FaShoppingCart, FaChartLine, FaGift } from "react-icons/fa";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";

// export default function DashboardAdmin() {
//   // Dummy data
//   const stats = {
//     totalUsers: 200,
//     activeUsers: 150,
//     totalInvites: 300,
//     activeInvites: 200,
//     totalVisits: 5000,
//     totalTransactions: 120,
//     revenue: 2500000,
//     totalTemplates: 45,
//   };

//   const userGrowthData = [
//     { month: "Jan", users: 20 },
//     { month: "Feb", users: 30 },
//     { month: "Mar", users: 50 },
//     { month: "Apr", users: 40 },
//     { month: "Mei", users: 60 },
//   ];

//   const transactionData = [
//     { month: "Jan", transactions: 10 },
//     { month: "Feb", transactions: 15 },
//     { month: "Mar", transactions: 25 },
//     { month: "Apr", transactions: 20 },
//     { month: "Mei", transactions: 30 },
//   ];

//   const popularPackages = [
//     { name: "Paket Free", value: 50 },
//     { name: "Paket Lite", value: 30 },
//     { name: "Paket Pro", value: 20 },
//   ];

//   const COLORS = ["#3b82f6", "#10b981", "#f59e0b"]; // biru, hijau, kuning

//   const StatCard = ({ icon: Icon, title, value, colorFrom, colorTo, borderColor }) => (
//     <div className={`flex flex-row items-center p-4 rounded-lg shadow bg-gradient-to-b ${colorFrom} ${colorTo} border-b-4 ${borderColor}`}>
//       <div className="flex-shrink pr-4">
//         <div className={`rounded-full p-2.5 ${borderColor}`}>
//           <Icon className="w-6 h-6 text-white" />
//         </div>
//       </div>
//       <div className="flex-1 text-right md:text-center">
//         <h5 className="font-bold uppercase text-sm text-gray-600">{title}</h5>
//         <h3 className="font-bold text-2xl">{value.toLocaleString()}</h3>
//       </div>
//     </div>
//   );

//   return (
//     <div className="bg-white shadow rounded-lg font-sans p-6">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard Admin</h2>
//       <p className="text-gray-600 mb-6">Selamat datang di halaman dashboard admin.</p>

//       {/* Statistik Singkat */}
//       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
//         <StatCard icon={FaUsers} title="Total Pengguna" value={stats.totalUsers} colorFrom="from-blue-200" colorTo="to-blue-100" borderColor="border-blue-500" />
//         <StatCard icon={FaUsers} title="Pengguna Aktif" value={stats.activeUsers} colorFrom="from-green-200" colorTo="to-green-100" borderColor="border-green-500" />
//         <StatCard icon={FaGift} title="Total Undangan" value={stats.totalInvites} colorFrom="from-yellow-200" colorTo="to-yellow-100" borderColor="border-yellow-500" />
//         <StatCard icon={FaGift} title="Undangan Aktif" value={stats.activeInvites} colorFrom="from-pink-200" colorTo="to-pink-100" borderColor="border-pink-500" />
//         <StatCard icon={FaChartLine} title="Total Kunjungan" value={stats.totalVisits} colorFrom="from-purple-200" colorTo="to-purple-100" borderColor="border-purple-500" />
//         <StatCard icon={FaShoppingCart} title="Total Transaksi" value={stats.totalTransactions} colorFrom="from-orange-200" colorTo="to-orange-100" borderColor="border-orange-500" />
//         <StatCard icon={FaMoneyBillWave} title="Pendapatan" value={`Rp ${stats.revenue.toLocaleString()}`} colorFrom="from-teal-200" colorTo="to-teal-100" borderColor="border-teal-500" />
//         <StatCard icon={FaGift} title="Total Template" value={stats.totalTemplates} colorFrom="from-indigo-200" colorTo="to-indigo-100" borderColor="border-indigo-500" />
//       </div>

//       {/* Grafik */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//         <div className="p-4 rounded-lg shadow border">
//           <h3 className="font-semibold mb-4">Pengguna Baru per Bulan</h3>
//           <ResponsiveContainer width="100%" height={250}>
//             <LineChart data={userGrowthData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//         <div className="p-4 rounded-lg shadow border">
//           <h3 className="font-semibold mb-4">Transaksi per Bulan</h3>
//           <ResponsiveContainer width="100%" height={250}>
//             <BarChart data={transactionData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="transactions" fill="#10b981" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Statistik Platform */}
//       <div className="p-4 rounded-lg shadow border mt-6">
//         <h3 className="font-semibold mb-4">Statistik Platform</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          
//           {/* Penyimpanan Server */}
//           <div className="text-center">
//             <h4 className="text-lg font-bold text-gray-700 mb-2">Penyimpanan Server</h4>
//             <ResponsiveContainer width="100%" height={250}>
//               <PieChart>
//                 <Pie
//                   data={[
//                     { name: "Terpakai", value: 120 },
//                     { name: "Tersisa", value: 380 },
//                   ]}
//                   dataKey="value"
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={50}
//                   outerRadius={80}
//                   label
//                 >
//                   <Cell fill="#3b82f6" />
//                   <Cell fill="#10b981" />
//                 </Pie>
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//             <p className="mt-2 text-gray-600">120 GB / 500 GB</p>
//           </div>

//           {/* Paket Populer */}
//           <div className="text-center">
//             <h4 className="text-lg font-bold text-gray-700 mb-2">Paket Populer</h4>
//             <ResponsiveContainer width="100%" height={250}>
//               <PieChart>
//                 <Pie
//                   data={popularPackages}
//                   dataKey="value"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={80}
//                   label
//                 >
//                   {popularPackages.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }










// /* eslint-disable no-unused-vars */
// import React, { useEffect } from "react";
// import { FaUsers, FaMoneyBillWave, FaCalendarAlt, FaShoppingCart, FaChartLine, FaGift } from "react-icons/fa";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";
// import { useDashboard } from "../../../api/dashboard/useDashboard"; // <== pakai hook

// export default function DashboardAdmin() {
//   const { adminStats, loading, error, fetchAdminStats } = useDashboard();

//   useEffect(() => {
//     fetchAdminStats(); // ambil data pas pertama render
//   }, [fetchAdminStats]);

//   if (loading) return <p className="p-4">Loading data dashboard...</p>;
//   if (error) return <p className="p-4 text-red-500">{error}</p>;
//   if (!adminStats) return null;

//   // Data dari API
//   const stats = {
//     totalUsers: adminStats.totalUsers || 0,
//     activeUsers: adminStats.activeUsers || 0,
//     totalInvites: adminStats.totalInvites || 0,
//     activeInvites: adminStats.activeInvites || 0,
//     totalVisits: adminStats.totalVisits || 0,
//     totalTransactions: adminStats.totalTransactions || 0,
//     revenue: adminStats.revenue || 0,
//     totalTemplates: adminStats.totalTemplates || 0,
//   };

//   // Grafik user growth (ambil dari API)
//   const userGrowthData = adminStats.userGrowth || [];

//   // Grafik transaksi bulanan (ambil dari API)
//   const transactionData = adminStats.transactionStats || [];

//   // Paket populer dari API
//   const popularPackages = adminStats.popularPackages || [];

//   // Penyimpanan server dari API
//   const serverStorage = adminStats.serverStorage || { used: 0, free: 0, total: 0 };

//   const COLORS = ["#3b82f6", "#10b981", "#f59e0b"]; // biru, hijau, kuning

//   const StatCard = ({ icon: Icon, title, value, colorFrom, colorTo, borderColor }) => (
//     <div className={`flex flex-row items-center p-4 rounded-lg shadow bg-gradient-to-b ${colorFrom} ${colorTo} border-b-4 ${borderColor}`}>
//       <div className="flex-shrink pr-4">
//         <div className={`rounded-full p-2.5 ${borderColor}`}>
//           <Icon className="w-6 h-6 text-white" />
//         </div>
//       </div>
//       <div className="flex-1 text-right md:text-center">
//         <h5 className="font-bold uppercase text-sm text-gray-600">{title}</h5>
//         <h3 className="font-bold text-2xl">{typeof value === "number" ? value.toLocaleString() : value}</h3>
//       </div>
//     </div>
//   );

//   return (
//     <div className="bg-white shadow rounded-lg font-sans p-6">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard Admin</h2>
//       <p className="text-gray-600 mb-6">Selamat datang di halaman dashboard admin.</p>

//       {/* Statistik Singkat */}
//       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
//         <StatCard icon={FaUsers} title="Total Pengguna" value={stats.totalUsers} colorFrom="from-blue-200" colorTo="to-blue-100" borderColor="border-blue-500" />
//         <StatCard icon={FaUsers} title="Pengguna Aktif" value={stats.activeUsers} colorFrom="from-green-200" colorTo="to-green-100" borderColor="border-green-500" />
//         <StatCard icon={FaGift} title="Total Undangan" value={stats.totalInvites} colorFrom="from-yellow-200" colorTo="to-yellow-100" borderColor="border-yellow-500" />
//         <StatCard icon={FaGift} title="Undangan Aktif" value={stats.activeInvites} colorFrom="from-pink-200" colorTo="to-pink-100" borderColor="border-pink-500" />
//         <StatCard icon={FaChartLine} title="Total Kunjungan" value={stats.totalVisits} colorFrom="from-purple-200" colorTo="to-purple-100" borderColor="border-purple-500" />
//         <StatCard icon={FaShoppingCart} title="Total Transaksi" value={stats.totalTransactions} colorFrom="from-orange-200" colorTo="to-orange-100" borderColor="border-orange-500" />
//         <StatCard icon={FaMoneyBillWave} title="Pendapatan" value={`Rp ${stats.revenue.toLocaleString()}`} colorFrom="from-teal-200" colorTo="to-teal-100" borderColor="border-teal-500" />
//         <StatCard icon={FaGift} title="Total Template" value={stats.totalTemplates} colorFrom="from-indigo-200" colorTo="to-indigo-100" borderColor="border-indigo-500" />
//       </div>

//       {/* Grafik */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//         <div className="p-4 rounded-lg shadow border">
//           <h3 className="font-semibold mb-4">Pengguna Baru per Bulan</h3>
//           <ResponsiveContainer width="100%" height={250}>
//             <LineChart data={userGrowthData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//         <div className="p-4 rounded-lg shadow border">
//           <h3 className="font-semibold mb-4">Transaksi per Bulan</h3>
//           <ResponsiveContainer width="100%" height={250}>
//             <BarChart data={transactionData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="transactions" fill="#10b981" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Statistik Platform */}
//       <div className="p-4 rounded-lg shadow border mt-6">
//         <h3 className="font-semibold mb-4">Statistik Platform</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
//           {/* Penyimpanan Server */}
//           <div className="text-center">
//             <h4 className="text-lg font-bold text-gray-700 mb-2">Penyimpanan Server</h4>
//             <ResponsiveContainer width="100%" height={250}>
//               <PieChart>
//                 <Pie
//                   data={[
//                     { name: "Terpakai", value: serverStorage.used },
//                     { name: "Tersisa", value: serverStorage.free },
//                   ]}
//                   dataKey="value"
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={50}
//                   outerRadius={80}
//                   label
//                 >
//                   <Cell fill="#3b82f6" />
//                   <Cell fill="#10b981" />
//                 </Pie>
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//             <p className="mt-2 text-gray-600">
//               {serverStorage.used} GB / {serverStorage.total} GB
//             </p>
//           </div>

//           {/* Paket Populer */}
//           <div className="text-center">
//             <h4 className="text-lg font-bold text-gray-700 mb-2">Paket Populer</h4>
//             <ResponsiveContainer width="100%" height={250}>
//               <PieChart>
//                 <Pie data={popularPackages} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
//                   {popularPackages.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




/* eslint-disable no-unused-vars */import React, { useEffect } from "react";
import {
  FaUsers,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaShoppingCart,
  FaChartLine,
  FaGift,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useDashboard } from "../../../api/dashboard/useDashboard";

export default function DashboardAdmin() {
  const { adminStats, loading, error, fetchAdminStats } = useDashboard();

  useEffect(() => {
    fetchAdminStats();
  }, [fetchAdminStats]);

  if (loading) return <p className="p-4">Loading data dashboard...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!adminStats) return null;

  // langsung destructure sesuai response API
  const {
    totalUsers,
    activeUsers,
    totalInvitations,
    activeInvitations,
    totalVisits,
    totalTransactions,
    totalRevenue,
    totalTemplates,
    newUsersPerMonth,
    transactionsPerMonth,
    paketPopuler,
  } = adminStats;

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

  const StatCard = ({ icon: Icon, title, value, colorFrom, colorTo, borderColor }) => (
    <div
      className={`flex flex-row items-center p-4 rounded-lg shadow bg-gradient-to-b ${colorFrom} ${colorTo} border-b-4 ${borderColor}`}
    >
      <div className="flex-shrink pr-4">
        <div className={`rounded-full p-2.5 ${borderColor}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="flex-1 text-right md:text-center">
        <h5 className="font-bold uppercase text-sm text-gray-600">{title}</h5>
        <h3 className="font-bold text-2xl">
          {typeof value === "number" ? value.toLocaleString() : value}
        </h3>
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow rounded-lg font-sans p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard Admin</h2>
      <p className="text-gray-600 mb-6">
        Selamat datang di halaman dashboard admin.
      </p>

      {/* Statistik Singkat */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          icon={FaUsers}
          title="Total Pengguna"
          value={totalUsers}
          colorFrom="from-blue-200"
          colorTo="to-blue-100"
          borderColor="border-blue-500"
        />
        <StatCard
          icon={FaUsers}
          title="Pengguna Aktif"
          value={activeUsers}
          colorFrom="from-green-200"
          colorTo="to-green-100"
          borderColor="border-green-500"
        />
        <StatCard
          icon={FaGift}
          title="Total Undangan"
          value={totalInvitations}
          colorFrom="from-yellow-200"
          colorTo="to-yellow-100"
          borderColor="border-yellow-500"
        />
        <StatCard
          icon={FaGift}
          title="Undangan Aktif"
          value={activeInvitations}
          colorFrom="from-pink-200"
          colorTo="to-pink-100"
          borderColor="border-pink-500"
        />
        <StatCard
          icon={FaChartLine}
          title="Total Kunjungan"
          value={totalVisits}
          colorFrom="from-purple-200"
          colorTo="to-purple-100"
          borderColor="border-purple-500"
        />
        <StatCard
          icon={FaShoppingCart}
          title="Total Transaksi"
          value={totalTransactions}
          colorFrom="from-orange-200"
          colorTo="to-orange-100"
          borderColor="border-orange-500"
        />
        <StatCard
          icon={FaMoneyBillWave}
          title="Pendapatan"
          value={`Rp ${totalRevenue.toLocaleString()}`}
          colorFrom="from-teal-200"
          colorTo="to-teal-100"
          borderColor="border-teal-500"
        />
        <StatCard
          icon={FaGift}
          title="Total Template"
          value={totalTemplates}
          colorFrom="from-indigo-200"
          colorTo="to-indigo-100"
          borderColor="border-indigo-500"
        />
      </div>

      {/* Grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="p-4 rounded-lg shadow border">
          <h3 className="font-semibold mb-4">Pengguna Baru per Bulan</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={newUsersPerMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="p-4 rounded-lg shadow border">
          <h3 className="font-semibold mb-4">Transaksi per Bulan</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={transactionsPerMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Paket Populer */}
      <div className="p-4 rounded-lg shadow border mt-6">
        <h3 className="font-semibold mb-4">Paket Populer</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={paketPopuler}
              dataKey="total"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {paketPopuler.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
