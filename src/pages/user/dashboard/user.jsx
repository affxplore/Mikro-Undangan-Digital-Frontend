// import React, { useState, useMemo, useEffect } from "react";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   CartesianGrid,
//   ResponsiveContainer,
//   ComposedChart,
// } from "recharts";
// import { Plus, Bell } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// // Dashboard Halaman Utama - single file React + Tailwind component
// // Catatan: komponen ini memakai TailwindCSS, lucide-react (ikon), recharts untuk grafik, dan framer-motion untuk animasi.

// export default function DashboardUser() {
//   // Dummy data
//   const [invitationsActive, setInvitationsActive] = useState(8);
//   const [visitorCount, setVisitorCount] = useState(1254);
//   const [rsvpAccepted, setRsvpAccepted] = useState(742);

//   const initialChart = [
//     { date: "Aug 9", visits: 120, rsvp: 78 },
//     { date: "Aug 10", visits: 180, rsvp: 95 },
//     { date: "Aug 11", visits: 220, rsvp: 120 },
//     { date: "Aug 12", visits: 200, rsvp: 112 },
//     { date: "Aug 13", visits: 270, rsvp: 160 },
//     { date: "Aug 14", visits: 300, rsvp: 175 },
//     { date: "Aug 15", visits: 364, rsvp: 302 },
//   ];

//   const [chartData, setChartData] = useState(initialChart);

//   const [notifications, setNotifications] = useState([
//     {
//       id: 1,
//       title: "Sistem: Pembaruan keamanan",
//       time: "1 jam lalu",
//       badge: "update",
//     },
//     {
//       id: 2,
//       title: "Promo: Diskon template 20%",
//       time: "2 hari lalu",
//       badge: "promo",
//     },
//     {
//       id: 3,
//       title: "Reminder: Undangan " + "Reza & Nabila",
//       time: "3 hari lalu",
//       badge: "info",
//     },
//   ]);

//   const [activities, setActivities] = useState([
//     { id: 1, text: "Undangan 'Reza & Nabila' dibuat", time: "3 hari" },
//     { id: 2, text: "120 pengunjung hari ini", time: "14 jam" },
//     {
//       id: 3,
//       text: "50 RSVP diterima untuk acara 'Launch Party'",
//       time: "1 hari",
//     },
//   ]);

//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [newInviteTitle, setNewInviteTitle] = useState("");
//   const [filterRange, setFilterRange] = useState("7d");

//   // derived totals
//   const totals = useMemo(() => {
//     const totalVisits = chartData.reduce((s, d) => s + d.visits, 0);
//     const totalRsvps = chartData.reduce((s, d) => s + d.rsvp, 0);
//     return { totalVisits, totalRsvps };
//   }, [chartData]);

//   // simulate small live update for visitor count
//   useEffect(() => {
//     const t = setInterval(() => {
//       setVisitorCount((v) => v + Math.floor(Math.random() * 6));
//     }, 5000);
//     return () => clearInterval(t);
//   }, []);

//   function handleCreateInvite(e) {
//     e.preventDefault();
//     if (!newInviteTitle.trim()) return;
//     // add activity & bump invitation count
//     const id = Date.now();
//     setActivities((a) => [
//       { id, text: `Undangan '${newInviteTitle}' dibuat`, time: "baru saja" },
//       ...a,
//     ]);
//     setInvitationsActive((n) => n + 1);
//     setNewInviteTitle("");
//     setShowCreateModal(false);
//   }

//   function handleClearNotification(id) {
//     setNotifications((n) => n.filter((x) => x.id !== id));
//   }

//   function changeRange(r) {
//     setFilterRange(r);
//     // for demo: change chart data to show variations
//     if (r === "7d") setChartData(initialChart);
//     if (r === "30d") {
//       const data = Array.from({ length: 8 }).map((_, i) => ({
//         date: `Jul ${8 + i * 3}`,
//         visits: 120 + i * 30,
//         rsvp: 60 + i * 18,
//       }));
//       setChartData(data);
//     }
//   }

//   // Tambahkan di state
//   const [isNotifOpen, setIsNotifOpen] = useState(false);

//   // Fungsi toggle
//   function toggleNotif() {
//     setIsNotifOpen((prev) => !prev);
//   }

//   // Tutup popover kalau klik di luar
//   useEffect(() => {
//     function handleClickOutside(e) {
//       if (!e.target.closest(".notif-container")) {
//         setIsNotifOpen(false);
//       }
//     }
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   return (
//     <div className="min-h-screen bg-white p-6 md:p-10 text-slate-800">
//       <header className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
//             Halo, Selamat Datang!
//           </h1>
//           <p className="text-sm text-slate-500 mt-1">
//             Ringkasan aktivitas dan performa undangan kamu.
//           </p>
//         </div>
//         <div className="flex items-center space-x-3">
//           <div className="relative notif-container">
//             <button
//               onClick={toggleNotif}
//               className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition"
//               aria-label="Notifikasi"
//             >
//               <Bell />
//               <span className="text-sm font-medium">Notifikasi</span>
//               {notifications.length > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
//                   {notifications.length}
//                 </span>
//               )}
//             </button>

//             {isNotifOpen && (
//               <div className="absolute right-0 mt-2  w-72 bg-white border rounded-lg shadow-lg p-3 z-20">
//                 <h4 className="font-medium mb-2">Pemberitahuan</h4>
//                 <div className="space-y-2 max-h-44 overflow-auto">
//                   {notifications.map((n) => (
//                     <div
//                       key={n.id}
//                       className="flex items-start justify-between bg-slate-50 p-2 rounded"
//                     >
//                       <div>
//                         <div className="text-sm font-semibold">{n.title}</div>
//                         <div className="text-xs text-slate-500">{n.time}</div>
//                       </div>
//                       <div className="flex flex-col items-end">
//                         <span className="text-xs px-2 py-0.5 rounded text-white bg-blue-500">
//                           {n.badge}
//                         </span>
//                         <button
//                           onClick={() => handleClearNotification(n.id)}
//                           className="text-xs text-slate-400 hover:text-red-500 mt-2"
//                         >
//                           Hapus
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                   {notifications.length === 0 && (
//                     <div className="text-sm text-slate-500">
//                       Tidak ada notifikasi.
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

        
//         </div>
       
//       </header>

//       <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* left column: stats & chart */}
//         <section className="lg:col-span-2 space-y-6">
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <motion.div
//               whileHover={{ y: -4 }}
//               className="p-4 rounded-2xl bg-gradient-to-tr from-white to-blue-50 border border-blue-100 shadow-sm"
//             >
//               <div className="text-sm text-slate-500">
//                 Jumlah undangan aktif
//               </div>
//               <div className="mt-2 text-2xl font-bold text-slate-900">
//                 {invitationsActive}
//               </div>
//               <div className="text-xs text-slate-400 mt-1">
//                 termasuk template tersimpan
//               </div>
//             </motion.div>

//             <motion.div
//               whileHover={{ y: -4 }}
//               className="p-4 rounded-2xl bg-gradient-to-tr from-white to-blue-50 border border-blue-100 shadow-sm"
//             >
//               <div className="text-sm text-slate-500">
//                 Jumlah kunjungan undangan
//               </div>
//               <div className="mt-2 text-2xl font-bold text-slate-900">
//                 {visitorCount.toLocaleString()}
//               </div>
//               <div className="text-xs text-slate-400 mt-1">
//                 total pengunjung keseluruhan
//               </div>
//             </motion.div>

//             <motion.div
//               whileHover={{ y: -4 }}
//               className="p-4 rounded-2xl bg-gradient-to-tr from-white to-blue-50 border border-blue-100 shadow-sm"
//             >
//               <div className="text-sm text-slate-500">Jumlah RSVP diterima</div>
//               <div className="mt-2 text-2xl font-bold text-slate-900">
//                 {rsvpAccepted.toLocaleString()}
//               </div>
//               <div className="text-xs text-slate-400 mt-1">
//                 hadir + konfirmasi
//               </div>
//             </motion.div>
//           </div>

//           <div className="bg-white border rounded-2xl shadow-sm p-4">
//             <div className="flex items-center justify-between mb-3">
//               <h3 className="text-lg font-medium">Kunjungan & RSVP</h3>
//               <div className="flex items-center gap-2">
//                 <div className="text-sm text-slate-500">Range:</div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => changeRange("7d")}
//                     className={`px-3 py-1 rounded ${
//                       filterRange === "7d"
//                         ? "bg-blue-600 text-white"
//                         : "bg-slate-100 text-slate-700"
//                     }`}
//                   >
//                     7 hari
//                   </button>
//                   <button
//                     onClick={() => changeRange("30d")}
//                     className={`px-3 py-1 rounded ${
//                       filterRange === "30d"
//                         ? "bg-blue-600 text-white"
//                         : "bg-slate-100 text-slate-700"
//                     }`}
//                   >
//                     30 hari
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="w-full h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <ComposedChart
//                   data={chartData}
//                   margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="visits" barSize={16} />
//                   <Line
//                     type="monotone"
//                     dataKey="rsvp"
//                     stroke="#1E40AF"
//                     strokeWidth={3}
//                   />
//                 </ComposedChart>
//               </ResponsiveContainer>
//             </div>

//             <div className="mt-3 text-sm text-slate-500 flex gap-6">
//               <div>
//                 Total kunjungan:{" "}
//                 <span className="font-semibold text-slate-800 ml-1">
//                   {totals.totalVisits}
//                 </span>
//               </div>
//               <div>
//                 Total RSVP:{" "}
//                 <span className="font-semibold text-slate-800 ml-1">
//                   {totals.totalRsvps}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white border rounded-2xl shadow-sm p-4">
//             <h3 className="text-lg font-medium mb-3">Aktivitas Terbaru</h3>
//             <ul className="space-y-3">
//               {activities.map((a) => (
//                 <li key={a.id} className="flex items-start justify-between">
//                   <div>
//                     <div className="text-sm font-medium">{a.text}</div>
//                     <div className="text-xs text-slate-400">{a.time}</div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </section>

//         {/* right column: notifications, quick actions, small stats */}
//         <aside className="space-y-6">
//           <div className="p-4 rounded-2xl bg-gradient-to-tr from-blue-50 to-white border border-blue-100 shadow-sm">
//             <h4 className="text-sm text-slate-700 font-medium">Quick Action</h4>
//             <div className="mt-3 grid grid-cols-1 gap-2">
//               <button
//                 onClick={() => setShowCreateModal(true)}
//                 className="w-full py-2 px-3 rounded-lg bg-blue-600 text-white flex items-center justify-center gap-2"
//               >
//                 <Plus /> Buat Undangan
//               </button>
//               <button
//                 onClick={() => {
//                   setVisitorCount(0);
//                   setRsvpAccepted(0);
//                 }}
//                 className="w-full py-2 px-3 rounded-lg border border-slate-200 text-slate-700"
//               >
//                 Reset Statistik (demo)
//               </button>
//             </div>
//           </div>

//           <div className="p-4 rounded-2xl border bg-white shadow-sm">
//             <h4 className="text-sm font-medium mb-2">Pemberitahuan & Promo</h4>
//             <div className="space-y-2">
//               {notifications.map((n) => (
//                 <div
//                   key={n.id}
//                   className="text-sm bg-slate-50 p-2 rounded flex items-center justify-between"
//                 >
//                   <div>
//                     <div className="font-medium">{n.title}</div>
//                     <div className="text-xs text-slate-400">{n.time}</div>
//                   </div>
//                   <div className="text-xs px-2 py-0.5 rounded text-white bg-blue-500">
//                     {n.badge}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="p-4 rounded-2xl border bg-white shadow-sm">
//             <h4 className="text-sm font-medium mb-2">Statistik Singkat</h4>
//             <div className="text-sm text-slate-600">Rasio RSVP / Kunjungan</div>
//             <div className="mt-3 text-2xl font-bold">
//               {Math.round((rsvpAccepted / Math.max(visitorCount, 1)) * 100)}%
//             </div>
//             <div className="mt-2 text-xs text-slate-400">
//               berdasarkan angka saat ini
//             </div>
//           </div>
//         </aside>
//       </main>

//       {/* modal buat undangan */}
//       <AnimatePresence>
//         {showCreateModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-40 flex items-center justify-center p-4"
//           >
//             <div
//               className="absolute inset-0 bg-black/30"
//               onClick={() => setShowCreateModal(false)}
//             />
//             <motion.form
//               onSubmit={handleCreateInvite}
//               initial={{ y: 20 }}
//               animate={{ y: 0 }}
//               exit={{ y: 20 }}
//               className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 z-50 border"
//             >
//               <h3 className="text-lg font-semibold mb-2">Buat Undangan Baru</h3>
//               <p className="text-sm text-slate-500 mb-4">
//                 Isi judul undangan dan simpan. (Demo — tidak terhubung ke
//                 backend)
//               </p>
//               <label className="block mb-3">
//                 <div className="text-xs text-slate-600 mb-1">
//                   Judul Undangan
//                 </div>
//                 <input
//                   value={newInviteTitle}
//                   onChange={(e) => setNewInviteTitle(e.target.value)}
//                   className="w-full border rounded px-3 py-2"
//                   placeholder="Contoh: Pernikahan Ira & Bima"
//                 />
//               </label>

//               <div className="flex items-center justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowCreateModal(false)}
//                   className="px-4 py-2 rounded bg-slate-100"
//                 >
//                   Batal
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 rounded bg-blue-600 text-white"
//                 >
//                   Simpan & Buat
//                 </button>
//               </div>
//             </motion.form>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }









// import React, { useState, useMemo, useEffect } from "react";
// import {
//   Line,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   CartesianGrid,
//   ResponsiveContainer,
//   ComposedChart,
// } from "recharts";
// import { Plus, Bell } from "lucide-react";
// import { motion } from "framer-motion";

// // hooks
// import { useDashboard } from "../../../api/dashboard/useDashboard";
// import useUserNotification from "../../../api/user_notification/useUserNotification";

// // utils
// import { formatTimeAgo } from "../../../utils/Time";

// export default function DashboardUser() {
//   const { userStats, fetchUserStats } = useDashboard();
//   const {
//     data: notifications,
//     getList: getNotifications,
//     remove: removeNotification,
//   } = useUserNotification();

//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [newInviteTitle, setNewInviteTitle] = useState("");
//   const [filterRange, setFilterRange] = useState("7d");
//   const [isNotifOpen, setIsNotifOpen] = useState(false);

//   useEffect(() => {
//     fetchUserStats();
//     getNotifications();
//   }, [fetchUserStats, getNotifications]);

//   // ambil data dari userStats
//   const invitationsActive = userStats?.activeInvitations ?? 0;
//   const visitorCount = userStats?.totalVisitors ?? 0;
//   const rsvpAccepted = userStats?.totalRSVP ?? 0;

//   const chartData =
//     userStats?.visitsAndRSVP?.map((item) => ({
//       date: item.day,
//       visits: item.visitors,
//       rsvp: item.rsvp,
//     })) ?? [];

//   const activities =
//     userStats?.recentActivities?.map((a) => ({
//       id: a.id,
//       text: `Undangan '${a.title}' dibuat`,
//       time: new Date(a.createdAt).toLocaleDateString("id-ID", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//       }),
//     })) ?? [];

//   // derived totals
//   const totals = useMemo(() => {
//     const totalVisits = chartData.reduce((s, d) => s + d.visits, 0);
//     const totalRsvps = chartData.reduce((s, d) => s + d.rsvp, 0);
//     return { totalVisits, totalRsvps };
//   }, [chartData]);

//   // toggle notif
//   function toggleNotif() {
//     setIsNotifOpen((prev) => !prev);
//   }

//   useEffect(() => {
//     function handleClickOutside(e) {
//       if (!e.target.closest(".notif-container")) {
//         setIsNotifOpen(false);
//       }
//     }
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   function handleCreateInvite(e) {
//     e.preventDefault();
//     if (!newInviteTitle.trim()) return;
//     setNewInviteTitle("");
//     setShowCreateModal(false);
//     // TODO: sambungin ke API create undangan kalo udah ada
//   }

//   // warna type notif
//   const typeColors = {
//     info: "bg-blue-500",
//     promo: "bg-green-500",
//     update: "bg-purple-500",
//     maintenance: "bg-orange-500",
//   };

//   return (
//     <div className="min-h-screen bg-white p-6 md:p-10 text-slate-800">
//       {/* Header */}
//       <header className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
//             Halo, Selamat Datang!
//           </h1>
//           <p className="text-sm text-slate-500 mt-1">
//             Ringkasan aktivitas dan performa undangan kamu.
//           </p>
//         </div>
//         <div className="flex items-center space-x-3">
//           <div className="relative notif-container">
//             <button
//               onClick={toggleNotif}
//               className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition"
//               aria-label="Notifikasi"
//             >
//               <Bell />
//               <span className="text-sm font-medium">Notifikasi</span>
//               {notifications.length > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
//                   {notifications.length}
//                 </span>
//               )}
//             </button>

//             {isNotifOpen && (
//               <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg p-3 z-20">
//                 <h4 className="font-medium mb-2">Pemberitahuan</h4>
//                 <div className="space-y-2 max-h-44 overflow-auto">
//                   {notifications.map((n) => (
//                     <div
//                       key={n.id}
//                       className="flex items-start justify-between bg-slate-50 p-2 rounded"
//                     >
//                       <div>
//                         <div className="text-sm font-semibold">{n.title}</div>
//                         <div className="text-xs text-slate-500">
//                           {formatTimeAgo(n.createdAt)}
//                         </div>
//                       </div>
//                       <div className="flex flex-col items-end">
//                         {n.type && (
//                           <span
//                             className={`text-xs px-2 py-0.5 rounded text-white ${
//                               typeColors[n.type] || "bg-gray-500"
//                             }`}
//                           >
//                             {n.type}
//                           </span>
//                         )}
//                         <button
//                           onClick={() => removeNotification(n.id)}
//                           className="text-xs text-slate-400 hover:text-red-500 mt-2"
//                         >
//                           Hapus
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                   {notifications.length === 0 && (
//                     <div className="text-sm text-slate-500">
//                       Tidak ada notifikasi.
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* left column: stats & chart */}
//         <section className="lg:col-span-2 space-y-6">
//           {/* Stats */}
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <motion.div className="p-4 rounded-2xl bg-blue-50 border shadow-sm">
//               <div className="text-sm text-slate-500">Jumlah undangan aktif</div>
//               <div className="mt-2 text-2xl font-bold text-slate-900">
//                 {invitationsActive}
//               </div>
//               <div className="text-xs text-slate-400 mt-1">
//                 termasuk template tersimpan
//               </div>
//             </motion.div>
//             <motion.div className="p-4 rounded-2xl bg-blue-50 border shadow-sm">
//               <div className="text-sm text-slate-500">Jumlah kunjungan</div>
//               <div className="mt-2 text-2xl font-bold text-slate-900">
//                 {visitorCount.toLocaleString()}
//               </div>
//               <div className="text-xs text-slate-400 mt-1">
//                 total pengunjung keseluruhan
//               </div>
//             </motion.div>
//             <motion.div className="p-4 rounded-2xl bg-blue-50 border shadow-sm">
//               <div className="text-sm text-slate-500">Jumlah RSVP diterima</div>
//               <div className="mt-2 text-2xl font-bold text-slate-900">
//                 {rsvpAccepted.toLocaleString()}
//               </div>
//               <div className="text-xs text-slate-400 mt-1">
//                 hadir + konfirmasi
//               </div>
//             </motion.div>
//           </div>

//           {/* Chart */}
//           <div className="bg-white border rounded-2xl shadow-sm p-4">
//             <h3 className="text-lg font-medium mb-3">Kunjungan & RSVP</h3>
//             <div className="w-full h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <ComposedChart data={chartData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="visits" barSize={16} />
//                   <Line
//                     type="monotone"
//                     dataKey="rsvp"
//                     stroke="#1E40AF"
//                     strokeWidth={3}
//                   />
//                 </ComposedChart>
//               </ResponsiveContainer>
//             </div>
//             <div className="mt-3 text-sm text-slate-500 flex gap-6">
//               <div>
//                 Total kunjungan:{" "}
//                 <span className="font-semibold text-slate-800 ml-1">
//                   {totals.totalVisits}
//                 </span>
//               </div>
//               <div>
//                 Total RSVP:{" "}
//                 <span className="font-semibold text-slate-800 ml-1">
//                   {totals.totalRsvps}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Recent activities */}
//           <div className="bg-white border rounded-2xl shadow-sm p-4">
//             <h3 className="text-lg font-medium mb-3">Aktivitas Terbaru</h3>
//             <ul className="space-y-3">
//               {activities.map((a) => (
//                 <li key={a.id}>
//                   <div className="text-sm font-medium">{a.text}</div>
//                   <div className="text-xs text-slate-400">{a.time}</div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </section>

//         {/* right column: notifications, quick actions, small stats */}
//         <aside className="space-y-6">
//           <div className="p-4 rounded-2xl bg-blue-50 border shadow-sm">
//             <h4 className="text-sm font-medium">Quick Action</h4>
//             <div className="mt-3 grid gap-2">
//               <button
//                 onClick={() => setShowCreateModal(true)}
//                 className="w-full py-2 px-3 rounded-lg bg-blue-600 text-white flex items-center justify-center gap-2"
//               >
//                 <Plus /> Buat Undangan
//               </button>
//             </div>
//           </div>

//           {/* Notifications */}
//           <div className="p-4 rounded-2xl border bg-white shadow-sm">
//             <h4 className="text-sm font-medium mb-2">
//               Pemberitahuan & Promo
//             </h4>
//             <div className="space-y-2">
//               {notifications.map((n) => (
//                 <div
//                   key={n.id}
//                   className="text-sm bg-slate-50 p-2 rounded flex justify-between"
//                 >
//                   <div>
//                     <div className="font-medium">{n.title}</div>
//                     <div className="text-xs text-slate-400">
//                       {formatTimeAgo(n.createdAt)}
//                     </div>
//                   </div>
//                   {n.type && (
//                     <div
//                       className={`text-xs px-2 py-0.5 rounded text-white ${
//                         typeColors[n.type] || "bg-gray-500"
//                       }`}
//                     >
//                       {n.type}
//                     </div>
//                   )}
//                 </div>
//               ))}
//               {notifications.length === 0 && (
//                 <div className="text-sm text-slate-500">
//                   Tidak ada notifikasi.
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Rasio singkat */}
//           <div className="p-4 rounded-2xl border bg-white shadow-sm">
//             <h4 className="text-sm font-medium mb-2">Statistik Singkat</h4>
//             <div className="text-sm text-slate-600">Rasio RSVP / Kunjungan</div>
//             <div className="mt-3 text-2xl font-bold">
//               {Math.round((rsvpAccepted / Math.max(visitorCount, 1)) * 100)}%
//             </div>
//             <div className="mt-2 text-xs text-slate-400">
//               berdasarkan angka saat ini
//             </div>
//           </div>
//         </aside>
//       </main>
//     </div>
//   );
// }

import React, { useState, useMemo, useEffect } from "react";
import {
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { Plus, Bell } from "lucide-react";
import { motion } from "framer-motion";

// hooks
import { useDashboard } from "../../../api/dashboard/useDashboard";
import useUserNotification from "../../../api/user_notification/useUserNotification";

// utils
import { formatTimeAgo } from "../../../utils/Time";

// components
import NotificationItem from "../../../components/notification/NotificationItem";

export default function DashboardUser() {
  const { userStats, fetchUserStats } = useDashboard();
  const {
    data: notifications,
    getList: getNotifications,
    remove: removeNotification,
  } = useUserNotification();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newInviteTitle, setNewInviteTitle] = useState("");
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);

  useEffect(() => {
    fetchUserStats();
    getNotifications();
  }, [fetchUserStats, getNotifications]);

  // ambil data dari userStats
  const invitationsActive = userStats?.activeInvitations ?? 0;
  const visitorCount = userStats?.totalVisitors ?? 0;
  const rsvpAccepted = userStats?.totalRSVP ?? 0;

  const chartData =
    userStats?.visitsAndRSVP?.map((item) => ({
      date: item.day,
      visits: item.visitors,
      rsvp: item.rsvp,
    })) ?? [];

  const activities =
    userStats?.recentActivities?.map((a) => ({
      id: a.id,
      text: `Undangan '${a.title}' dibuat`,
      time: new Date(a.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    })) ?? [];

  // derived totals
  const totals = useMemo(() => {
    const totalVisits = chartData.reduce((s, d) => s + d.visits, 0);
    const totalRsvps = chartData.reduce((s, d) => s + d.rsvp, 0);
    return { totalVisits, totalRsvps };
  }, [chartData]);

  // warna type notif
  const typeColors = {
    info: "bg-blue-500",
    promo: "bg-green-500",
    update: "bg-purple-500",
    maintenance: "bg-orange-500",
  };

  // toggle notif
  function toggleNotif() {
    setIsNotifOpen((prev) => !prev);
  }

  // tutup popup notif kalau klik luar
  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest(".notif-container")) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  function handleCreateInvite(e) {
    e.preventDefault();
    if (!newInviteTitle.trim()) return;
    setNewInviteTitle("");
    setShowCreateModal(false);
    // TODO: sambungin ke API create undangan
  }

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 text-slate-800">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Halo, Selamat Datang!
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Ringkasan aktivitas dan performa undangan kamu.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative notif-container">
            <button
              onClick={toggleNotif}
              className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition"
              aria-label="Notifikasi"
            >
              <Bell />
              <span className="text-sm font-medium">Notifikasi</span>
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {notifications.length}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg p-3 z-20">
                <h4 className="font-medium mb-2">Pemberitahuan</h4>
                <div className="space-y-2 max-h-44 overflow-auto">
                  {notifications.map((n) => (
                    <NotificationItem
                      key={n.id}
                      notif={n}
                      typeColors={typeColors}
                      onClick={setSelectedNotif}
                    />
                  ))}
                  {notifications.length === 0 && (
                    <div className="text-sm text-slate-500">
                      Tidak ada notifikasi.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* left column: stats & chart */}
        <section className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div className="p-4 rounded-2xl bg-blue-50 border shadow-sm">
              <div className="text-sm text-slate-500">Jumlah undangan aktif</div>
              <div className="mt-2 text-2xl font-bold text-slate-900">
                {invitationsActive}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                termasuk template tersimpan
              </div>
            </motion.div>
            <motion.div className="p-4 rounded-2xl bg-blue-50 border shadow-sm">
              <div className="text-sm text-slate-500">Jumlah kunjungan</div>
              <div className="mt-2 text-2xl font-bold text-slate-900">
                {visitorCount.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                total pengunjung keseluruhan
              </div>
            </motion.div>
            <motion.div className="p-4 rounded-2xl bg-blue-50 border shadow-sm">
              <div className="text-sm text-slate-500">Jumlah RSVP diterima</div>
              <div className="mt-2 text-2xl font-bold text-slate-900">
                {rsvpAccepted.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                hadir + konfirmasi
              </div>
            </motion.div>
          </div>

          {/* Chart */}
          <div className="bg-white border rounded-2xl shadow-sm p-4">
            <h3 className="text-lg font-medium mb-3">Kunjungan & RSVP</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="visits" barSize={16} />
                  <Line
                    type="monotone"
                    dataKey="rsvp"
                    stroke="#1E40AF"
                    strokeWidth={3}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 text-sm text-slate-500 flex gap-6">
              <div>
                Total kunjungan:{" "}
                <span className="font-semibold text-slate-800 ml-1">
                  {totals.totalVisits}
                </span>
              </div>
              <div>
                Total RSVP:{" "}
                <span className="font-semibold text-slate-800 ml-1">
                  {totals.totalRsvps}
                </span>
              </div>
            </div>
          </div>

          {/* Recent activities */}
          <div className="bg-white border rounded-2xl shadow-sm p-4">
            <h3 className="text-lg font-medium mb-3">Aktivitas Terbaru</h3>
            <ul className="space-y-3">
              {activities.map((a) => (
                <li key={a.id}>
                  <div className="text-sm font-medium">{a.text}</div>
                  <div className="text-xs text-slate-400">{a.time}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* right column: notifications, quick actions, small stats */}
        <aside className="space-y-6">
          <div className="p-4 rounded-2xl bg-blue-50 border shadow-sm">
            <h4 className="text-sm font-medium">Quick Action</h4>
            <div className="mt-3 grid gap-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full py-2 px-3 rounded-lg bg-blue-600 text-white flex items-center justify-center gap-2"
              >
                <Plus /> Buat Undangan
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="p-4 rounded-2xl border bg-white shadow-sm">
            <h4 className="text-sm font-medium mb-2">Pemberitahuan & Promo</h4>
            <div className="space-y-2">
              {notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  notif={n}
                  typeColors={typeColors}
                  onClick={setSelectedNotif}
                />
              ))}
              {notifications.length === 0 && (
                <div className="text-sm text-slate-500">
                  Tidak ada notifikasi.
                </div>
              )}
            </div>
          </div>

          {/* Rasio singkat */}
          <div className="p-4 rounded-2xl border bg-white shadow-sm">
            <h4 className="text-sm font-medium mb-2">Statistik Singkat</h4>
            <div className="text-sm text-slate-600">Rasio RSVP / Kunjungan</div>
            <div className="mt-3 text-2xl font-bold">
              {Math.round((rsvpAccepted / Math.max(visitorCount, 1)) * 100)}%
            </div>
            <div className="mt-2 text-xs text-slate-400">
              berdasarkan angka saat ini
            </div>
          </div>
        </aside>
      </main>

      {/* Modal Detail Notif */}
      {selectedNotif && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">
              {selectedNotif.title}
            </h3>
            <p className="text-sm text-slate-700 mb-4">
              {selectedNotif.content}
            </p>
            <div className="text-xs text-slate-400 mb-4">
              {formatTimeAgo(selectedNotif.createdAt)}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedNotif(null)}
                className="px-3 py-1 text-sm bg-slate-200 rounded hover:bg-slate-300"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  removeNotification(selectedNotif.id);
                  setSelectedNotif(null);
                }}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
