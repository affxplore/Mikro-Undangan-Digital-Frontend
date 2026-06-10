// import React, { useMemo, useState } from "react";
// import pp1 from '../../../assets/img/ava1.png'
// import pp2 from '../../../assets/img/ava2.webp'
// import pp3 from '../../../assets/img/ava3.webp'
// import useKataUcapan from '../../../api/kata-ucapan/useKataUcapan'

// // Utility
// const cx = (...c) => c.filter(Boolean).join(" ");

// export default function Ucapan({ initialTheme = "white" }) {
//     const {
//           data,
//           loading,
//           pagination,
//           error,
//           getList,
//           getById,
//           postCreate,
//           Update_data,
//           Delete_data
      
          
      
//         }=useKataUcapan(0);
      
//         const ucapan = data[0]



//   const [theme, setTheme] = useState(initialTheme); // 'white' | 'blue'

//   // Dummy data
//   const messages = useMemo(
//     () => [
//       {
//         id: "m1",
//         name: "Fzz",
//         avatarUrl: pp1,
//         text: "Selamat ya atas hari bahagianya! Semoga langgeng dan selalu diberkahi.",
//         date: "2025-08-10 10:23",
//         favorite: true,
//       },
//       {
//         id: "m2",
//         name: "Nonionn",
//         avatarUrl: pp2,
//         text: "Doa terbaik untuk kalian. Semoga rukun dan penuh kebahagiaan.",
//         date: "2025-08-11 14:05",
//         favorite: false,
//       },
//       {
//         id: "m3",
//         name: "Jawir",
//         avatarUrl: pp3,
//         text: "Barakallah! Semoga menjadi keluarga yang sakinah mawaddah warahmah.",
//         date: "2025-08-12 19:42",
//         favorite: false,
//       },
//     ],
//     []
//   );

//   // Local UI states for demo (no real deletion)
//   const [deletingIds, setDeletingIds] = useState(new Set());
//   const [togglingIds, setTogglingIds] = useState(new Set());
//   const [localMessages, setLocalMessages] = useState(messages);

//   function handleDelete(m) {
//     setDeletingIds((s) => new Set(s).add(m.id));
//     setTimeout(() => {
//       setLocalMessages((arr) => arr.filter((x) => x.id !== m.id));
//       setDeletingIds((s) => {
//         const ns = new Set(s);
//         ns.delete(m.id);
//         return ns;
//       });
//     }, 700);
//   }

//   function handleToggleFavorite(m) {
//     setTogglingIds((s) => new Set(s).add(m.id));
//     setTimeout(() => {
//       setLocalMessages((arr) => arr.map((x) => (x.id === m.id ? { ...x, favorite: !x.favorite } : x)));
//       setTogglingIds((s) => {
//         const ns = new Set(s);
//         ns.delete(m.id);
//         return ns;
//       });
//     }, 450);
//   }

//   // Theme palettes
//   const palettes = {
//     white: {
//       pageBg: "bg-gradient-to-b from-white via-rose-50 to-sky-50",
//       headerBg: "bg-white/90",
//       cardBg: "bg-white",
//       accentText: "text-rose-700",
//       accentBorder: "ring-rose-200",
//       actionBg: "bg-sky-50",
//       actionBorder: "border-sky-100",
//     },
//     blue: {
//       pageBg: "bg-gradient-to-b from-sky-50 via-white to-sky-100",
//       headerBg: "bg-white/95",
//       cardBg: "bg-white",
//       accentText: "text-sky-800",
//       accentBorder: "ring-sky-200",
//       actionBg: "bg-sky-50",
//       actionBorder: "border-sky-100",
//     },
//   };

//   const p = palettes[theme] || palettes.white;

//   return (
//     <div className={cx("min-h-screen p-4 text-slate-900", p.pageBg)}>
//       <div className="mx-auto max-w-6xl">
//         <header className={cx("mb-6 rounded-xl p-4 shadow-sm ring-1", p.headerBg, p.accentBorder)}>
//           <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <h1 className={cx("text-2xl font-bold", p.accentText)}>Halaman Ucapan & Doa</h1>
//               <p className="mt-1 text-sm text-slate-600">Menampilkan data ucapan dari tamu.</p>
//             </div>

//             <div className="mt-2 flex items-center gap-3 sm:mt-0">
//               <label htmlFor="theme" className="sr-only">Pilih tema</label>
//               <div className="inline-flex items-center gap-2 rounded-full bg-white/60 px-2 py-1 shadow-xs ring-1 ring-slate-100">
//                 <button
//                   type="button"
//                   onClick={() => setTheme("white")}
//                   aria-pressed={theme === "white"}
//                   className={cx(
//                     "rounded-full px-3 py-1 text-sm font-medium transition-shadow duration-150",
//                     theme === "white" ? "bg-sky-100 shadow-inner" : "hover:bg-sky-50"
//                   )}
//                 >
//                   Putih
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setTheme("blue")}
//                   aria-pressed={theme === "blue"}
//                   className={cx(
//                     "rounded-full px-3 py-1 text-sm font-medium transition-shadow duration-150",
//                     theme === "blue" ? "bg-sky-200 shadow-inner" : "hover:bg-sky-50"
//                   )}
//                 >
//                   Biru
//                 </button>
//               </div>
//             </div>
//           </div>
//         </header>

//         <main>
//           <section aria-labelledby="table-title" className={cx("rounded-xl p-3 shadow-md ring-1", p.cardBg, "ring-slate-100") }>
//             <div className="flex items-center justify-between px-2 py-3">
//               <h2 id="table-title" className={cx("text-lg font-semibold", p.accentText)}>Daftar ucapan terbaru</h2>
//               <div className="text-sm text-slate-600">Total: <span className="font-medium">{localMessages.length}</span></div>
//             </div>

//             <div className="mt-2 w-full overflow-auto">
//               <table className="min-w-full table-fixed border-collapse">
//                 <caption className="sr-only">Tabel daftar ucapan terbaru, dengan fitur hapus dan tandai favorit</caption>
//                 <thead>
//                   <tr className="text-left text-xs font-medium uppercase tracking-wide text-slate-600">
//                     <th scope="col" className="w-40 px-3 py-2">Pengirim</th>
//                     <th scope="col" className="px-3 py-2">Ucapan</th>
//                     <th scope="col" className="w-40 px-3 py-2">Tanggal</th>
//                     <th scope="col" className="w-36 px-3 py-2">Aksi</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {localMessages.map((m) => (
//                     <tr key={m.id} className="group hover:bg-sky-50/40 transition-colors">
//                       <td className="align-top px-3 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className={cx("h-12 w-12 flex-none overflow-hidden rounded-xl ring-2", p.accentBorder, "bg-sky-50")}>
//                             {m.avatarUrl ? (
//                               <img src={m.avatarUrl} alt={`Avatar ${m.name || 'pengirim'}`} className="h-full w-full object-cover" />
//                             ) : (
//                               <div className="flex h-full w-full items-center justify-center text-sky-600">👤</div>
//                             )}
//                           </div>
//                           <div className="min-w-0">
//                             <div className={cx("text-sm font-semibold", p.accentText)}>{m.name || "-"}</div>
//                             <div className="mt-1 text-xs text-slate-500">Pengguna</div>
//                           </div>
//                         </div>
//                       </td>

//                       <td className="px-3 py-4 align-top">
//                         <div className={cx("rounded-lg border p-3 shadow-sm", p.actionBg, p.actionBorder)}>
//                           <p className="text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">{m.text}</p>
//                         </div>
//                       </td>

//                       <td className="px-3 py-4 align-top text-sm text-slate-600">
//                         <time dateTime={new Date(m.date).toISOString()}>{m.date}</time>
//                       </td>

//                       <td className="px-3 py-4 align-top">
//                         <div className="flex items-center gap-2">
//                           <button
//                             type="button"
//                             onClick={() => handleToggleFavorite(m)}
//                             aria-label={m.favorite ? `Hapus favorit ${m.name}` : `Tandai favorit ${m.name}`}
//                             aria-pressed={m.favorite || false}
//                             disabled={togglingIds.has(m.id)}
//                             className={cx(
//                               "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-transform duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
//                               togglingIds.has(m.id)
//                                 ? "opacity-60 cursor-wait"
//                                 : m.favorite
//                                 ? "bg-yellow-50 border border-yellow-200 text-yellow-700 hover:scale-[1.02] focus-visible:ring-yellow-400"
//                                 : "bg-sky-50 border border-sky-100 text-sky-700 hover:scale-[1.02] focus-visible:ring-sky-400"
//                             )}
//                           >
//                             <svg viewBox="0 0 24 24" className="h-4 w-4" fill={m.favorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
//                               <path d="m12 17-5.5 3 1.5-6L3 9l6.25-.5L12 3l2.75 5.5L21 9l-5 5 1.5 6z" />
//                             </svg>
//                             <span className="sr-only">Tandai favorit</span>
//                             <span aria-hidden>{m.favorite ? 'Favorit' : 'Favorit'}</span>
//                           </button>

//                           <button
//                             type="button"
//                             onClick={() => handleDelete(m)}
//                             aria-label={`Hapus ucapan dari ${m.name}`}
//                             disabled={deletingIds.has(m.id)}
//                             className={cx(
//                               "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-transform duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
//                               deletingIds.has(m.id)
//                                 ? "opacity-60 cursor-wait"
//                                 : "bg-white border border-rose-200 text-rose-700 hover:scale-[1.02] focus-visible:ring-rose-400"
//                             )}
//                           >
//                             {deletingIds.has(m.id) ? (
//                               <span className="block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden />
//                             ) : (
//                               <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
//                                 <polyline points="3 6 5 6 21 6" />
//                                 <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
//                                 <path d="M10 11v6" />
//                                 <path d="M14 11v6" />
//                                 <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
//                               </svg>
//                             )}
//                             <span className="sr-only">Hapus</span>
//                             <span aria-hidden>Hapus</span>
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {localMessages.length === 0 && (
//               <div className="mt-6 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">Tidak ada ucapan saat ini</div>
//             )}
//           </section>
//         </main>
//       </div>
//     </div>
//   );
// }



// src/pages/dashboard/Ucapan.jsx
// import React, { useState, useEffect, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Search, ChevronLeft, ChevronRight, Star, Trash2 } from "lucide-react";
// import Swal from "sweetalert2";
// import useUcapanTamu from "../../../api/ucapan tamu/useUcapanTamu";

// export default function Ucapan() {
//   const [selectedInvitation, setSelectedInvitation] = useState(null);
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   // favorit frontend-only
//   const [favorites, setFavorites] = useState({});
//   const itemsPerPage = 5;

//   // ✅ panggil hook dengan selectedInvitation sebagai defaultInvitationId
//   const {
//     data: ucapanData,
//     getList,
//     remove,
//     loading,
//     pagination,
//   } = useUcapanTamu(selectedInvitation);

//   // Ambil daftar unique invitation dari data ucapan
//   const invitations = useMemo(() => {
//     return Array.from(
//       new Map(
//         ucapanData
//           .filter((u) => u.invitation)
//           .map((u) => [u.invitation.id, u.invitation])
//       ).values()
//     );
//   }, [ucapanData]);

//   // Fetch data saat invitation berubah
//   useEffect(() => {
//     if (selectedInvitation) {
//       getList({ page: currentPage, per_page: itemsPerPage });
//     }
//   }, [selectedInvitation, currentPage, getList]);

//   const toggleFavorite = (id) => {
//     setFavorites((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//     Swal.fire({
//       icon: "success",
//       title: "Berhasil!",
//       text: "Ucapan berhasil ditandai sebagai favorit.",
//       timer: 2000,
//       showConfirmButton: false,
//     });
//   };

//   const deleteUcapan = async (id) => {
//     Swal.fire({
//       title: "Yakin ingin menghapus ucapan ini?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Ya, hapus!",
//       cancelButtonText: "Batal",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         await remove(id);
//         Swal.fire({
//           icon: "success",
//           title: "Dihapus!",
//           text: "Ucapan berhasil dihapus.",
//           timer: 2000,
//           showConfirmButton: false,
//         });
//       }
//     });
//   };

//   // Filtering frontend (status + search)
//   const filteredData = ucapanData.filter(
//     (item) =>
//       (filterStatus === "All" ||
//         item.attendance_status?.toLowerCase() ===
//           filterStatus.toLowerCase()) &&
//       (item.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.notes?.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   const indexOfLast = currentPage * itemsPerPage;
//   const indexOfFirst = indexOfLast - itemsPerPage;
//   const currentItems = filteredData.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

//   return (
//     <div className="p-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl shadow-2xl border border-indigo-100">
//       <motion.h2
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="text-3xl font-extrabold text-indigo-700 mb-6 drop-shadow-sm"
//       >
//         ✨ Data Kata Ucapan
//       </motion.h2>

//       {/* Filters */}
//       <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0 mb-6">
//         <select
//           value={selectedInvitation || ""}
//           onChange={(e) => {
//             setSelectedInvitation(Number(e.target.value));
//             setCurrentPage(1);
//           }}
//           className="px-4 py-2 border rounded-xl shadow-md hover:shadow-lg transition bg-white focus:ring-2 focus:ring-indigo-400"
//         >
//           <option value="">Pilih Undangan</option>
//           {invitations.map((inv) => (
//             <option key={inv.id} value={inv.id}>
//               {inv.name}
//             </option>
//           ))}
//         </select>

//         <select
//           value={filterStatus}
//           onChange={(e) => {
//             setFilterStatus(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="px-4 py-2 border rounded-xl shadow-md hover:shadow-lg transition bg-white focus:ring-2 focus:ring-indigo-400"
//         >
//           <option value="All">Semua Status</option>
//           <option value="Hadir">Hadir</option>
//           <option value="Tidak Hadir">Tidak Hadir</option>
//         </select>

//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Cari nama atau ucapan..."
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="pl-10 pr-4 py-2 w-full border rounded-xl shadow-md hover:shadow-lg transition bg-white focus:ring-2 focus:ring-indigo-400"
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg bg-white">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-gradient-to-r from-indigo-100 to-purple-100 text-left text-sm uppercase text-indigo-700">
//               <th className="p-4">#</th>
//               <th className="p-4">Name</th>
//               <th className="p-4">Kata Ucapan</th>
//               <th className="p-4">Status</th>
//               <th className="p-4">Aksi</th>
//             </tr>
//           </thead>
//           <tbody>
//             <AnimatePresence>
//               {loading ? (
//                 <tr>
//                   <td colSpan="5" className="p-6 text-center text-gray-400">
//                     Loading...
//                   </td>
//                 </tr>
//               ) : currentItems.length > 0 ? (
//                 currentItems.map((item, index) => (
//                   <motion.tr
//                     key={item.id}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     transition={{ duration: 0.3 }}
//                     className="hover:bg-indigo-50/70 transition cursor-pointer border-b border-gray-100"
//                   >
//                     <td className="p-4 text-sm font-medium text-gray-600">
//                       {indexOfFirst + index + 1}
//                     </td>
//                     <td className="p-4 text-sm font-semibold text-gray-800">
//                       {item.guest_name}
//                     </td>
//                     <td className="p-4 text-sm text-gray-600 italic">
//                       {item.notes}
//                     </td>
//                     <td className="p-4">
//                       <span
//                         className={`px-3 py-1 text-xs font-semibold rounded-full shadow-md ${
//                           item.attendance_status?.toLowerCase() === "hadir"
//                             ? "bg-green-100 text-green-700 border border-green-200"
//                             : "bg-red-100 text-red-700 border border-red-200"
//                         }`}
//                       >
//                         {item.attendance_status}
//                       </span>
//                     </td>
//                     <td className="p-4 flex space-x-3">
//                       <button
//                         onClick={() => toggleFavorite(item.id)}
//                         className={`p-2 rounded-full shadow hover:scale-110 transition ${
//                           favorites[item.id]
//                             ? "bg-yellow-400 text-white"
//                             : "bg-gray-200 text-gray-600"
//                         }`}
//                       >
//                         <Star className="h-4 w-4" />
//                       </button>
//                       <button
//                         onClick={() => deleteUcapan(item.id)}
//                         className="p-2 rounded-full shadow bg-red-500 text-white hover:scale-110 transition"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </button>
//                     </td>
//                   </motion.tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan="5"
//                     className="p-6 text-center text-gray-400 text-sm italic"
//                   >
//                     Tidak ada ucapan.
//                   </td>
//                 </tr>
//               )}
//             </AnimatePresence>
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-between items-center mt-6">
//         <button
//           disabled={currentPage === 1}
//           onClick={() => setCurrentPage(currentPage - 1)}
//           className="flex items-center gap-1 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-50"
//         >
//           <ChevronLeft className="h-4 w-4" /> Prev
//         </button>

//         <span className="text-sm font-medium text-indigo-700">
//           Page {currentPage} of {totalPages}
//         </span>

//         <button
//           disabled={currentPage === totalPages || totalPages === 0}
//           onClick={() => setCurrentPage(currentPage + 1)}
//           className="flex items-center gap-1 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-50"
//         >
//           Next <ChevronRight className="h-4 w-4" />
//         </button>
//       </div>
//     </div>
//   );
// }





// // src/pages/dashboard/Ucapan.jsx
// import React, { useState, useEffect, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Search, ChevronLeft, ChevronRight, Star, Trash2 } from "lucide-react";
// import Swal from "sweetalert2";
// import useUcapanTamu from "../../../api/ucapan tamu/useUcapanTamu";

// export default function Ucapan() {
//   const { data: ucapanData = [], getList, remove, loading } = useUcapanTamu();

//   const [selectedInvitation, setSelectedInvitation] = useState(null); // null = semua
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   // favorit frontend-only
//   const [favorites, setFavorites] = useState({});
//   const itemsPerPage = 5;

//   // Ambil daftar unique invitation dari data ucapan (tahan banting: support invitation object atau hanya invitation_id)
//   const invitations = useMemo(() => {
//     const map = new Map();
//     ucapanData.forEach((u) => {
//       const invObj =
//         u.invitation ??
//         (u.invitation_id
//           ? { id: u.invitation_id, name: u.invitation_name ?? `Undangan ${u.invitation_id}` }
//           : null);
//       if (invObj && !map.has(invObj.id)) map.set(invObj.id, invObj);
//     });
//     return Array.from(map.values());
//   }, [ucapanData]);

//   // Helper ambil invitation id dari item (cocokkan berbagai naming)
//   const getItemInvitationId = (item) =>
//     item?.invitation?.id ?? item?.invitation_id ?? item?.invitationId ?? null;

//   // Fetch data ucapan ketika mount / selectedInvitation / currentPage berubah
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         const params = {
//           page: currentPage,
//           limit: itemsPerPage,
//         };
//         if (selectedInvitation !== null) params.invitation_id = selectedInvitation;
//         // getList dari hook akan set state (ucapanData) — kita tidak mengandalkan return value
//         await getList(params);
//         if (mounted) {
//           // nothing else; ucapanData akan ter-update via hook
//         }
//       } catch (error) {
//         console.error("❌ Error fetching ucapan:", error);
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, [selectedInvitation, currentPage, getList]);

//   const toggleFavorite = (id) => {
//     setFavorites((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//     Swal.fire({
//       icon: "success",
//       title: "Berhasil!",
//       text: "Ucapan berhasil ditandai sebagai favorit.",
//       timer: 1500,
//       showConfirmButton: false,
//     });
//   };

//   const deleteUcapan = async (id) => {
//     const result = await Swal.fire({
//       title: "Yakin ingin menghapus ucapan ini?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Ya, hapus!",
//       cancelButtonText: "Batal",
//     });

//     if (result.isConfirmed) {
//       try {
//         await remove(id);
//         // refresh dipanggil di hook remove (sesuai implementasi hook lo)
//         Swal.fire({
//           icon: "success",
//           title: "Dihapus!",
//           text: "Ucapan berhasil dihapus.",
//           timer: 1500,
//           showConfirmButton: false,
//         });
//       } catch (err) {
//         console.error("Gagal menghapus ucapan:", err);
//         Swal.fire({
//           icon: "error",
//           title: "Gagal",
//           text: "Terjadi kesalahan saat menghapus ucapan.",
//         });
//       }
//     }
//   };

//   // Filtering frontend (status + search + selected invitation)
//   const filteredData = ucapanData.filter((item) => {
//     const itemInvitationId = getItemInvitationId(item);

//     const matchInvitation = !selectedInvitation || itemInvitationId === selectedInvitation;

//     const statusVal = (item.attendance_status ?? "").toString().toLowerCase();
//     const matchStatus = filterStatus === "All" || statusVal === filterStatus.toLowerCase();

//     const q = searchTerm.trim().toLowerCase();
//     const matchSearch =
//       !q ||
//       (item.guest_name ?? "").toLowerCase().includes(q) ||
//       (item.notes ?? "").toLowerCase().includes(q);

//     return matchInvitation && matchStatus && matchSearch;
//   });

//   // pagination (frontend)
//   const indexOfLast = currentPage * itemsPerPage;
//   const indexOfFirst = indexOfLast - itemsPerPage;
//   const currentItems = filteredData.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

//   return (
//     <div className="p-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl shadow-2xl border border-indigo-100">
//       <motion.h2
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="text-3xl font-extrabold text-indigo-700 mb-6 drop-shadow-sm"
//       >
//         ✨ Data Kata Ucapan
//       </motion.h2>

//       {/* Filters */}
//       <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0 mb-6">
//         <select
//           value={selectedInvitation ?? ""}
//           onChange={(e) => {
//             const val = e.target.value;
//             setSelectedInvitation(val ? Number(val) : null);
//             setCurrentPage(1);
//           }}
//           className="px-4 py-2 border rounded-xl shadow-md hover:shadow-lg transition bg-white focus:ring-2 focus:ring-indigo-400"
//         >
//           <option value="">Pilih Undangan</option>
//           {invitations.map((inv) => (
//             <option key={inv.id} value={inv.id}>
//               {inv.name ?? `Undangan ${inv.id}`}
//             </option>
//           ))}
//         </select>

//         <select
//           value={filterStatus}
//           onChange={(e) => {
//             setFilterStatus(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="px-4 py-2 border rounded-xl shadow-md hover:shadow-lg transition bg-white focus:ring-2 focus:ring-indigo-400"
//         >
//           <option value="All">Semua Status</option>
//           <option value="Hadir">Hadir</option>
//           <option value="Tidak Hadir">Tidak Hadir</option>
//         </select>

//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Cari nama atau ucapan..."
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="pl-10 pr-4 py-2 w-full border rounded-xl shadow-md hover:shadow-lg transition bg-white focus:ring-2 focus:ring-indigo-400"
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg bg-white">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-gradient-to-r from-indigo-100 to-purple-100 text-left text-sm uppercase text-indigo-700">
//               <th className="p-4">#</th>
//               <th className="p-4">Name</th>
//               <th className="p-4">Kata Ucapan</th>
//               <th className="p-4">Status</th>
//               <th className="p-4">Aksi</th>
//             </tr>
//           </thead>
//           <tbody>
//             <AnimatePresence>
//               {loading ? (
//                 <tr>
//                   <td colSpan="5" className="p-6 text-center text-gray-400">
//                     Loading...
//                   </td>
//                 </tr>
//               ) : currentItems.length > 0 ? (
//                 currentItems.map((item, index) => (
//                   <motion.tr
//                     key={item.id}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     transition={{ duration: 0.3 }}
//                     className="hover:bg-indigo-50/70 transition cursor-pointer border-b border-gray-100"
//                   >
//                     <td className="p-4 text-sm font-medium text-gray-600">
//                       {indexOfFirst + index + 1}
//                     </td>
//                     <td className="p-4 text-sm font-semibold text-gray-800">
//                       {item.guest_name}
//                     </td>
//                     <td className="p-4 text-sm text-gray-600 italic">{item.notes}</td>
//                     <td className="p-4">
//                       <span
//                         className={`px-3 py-1 text-xs font-semibold rounded-full shadow-md ${
//                           (item.attendance_status ?? "").toString().toLowerCase() === "hadir"
//                             ? "bg-green-100 text-green-700 border border-green-200"
//                             : "bg-red-100 text-red-700 border border-red-200"
//                         }`}
//                       >
//                         {item.attendance_status}
//                       </span>
//                     </td>
//                     <td className="p-4 flex space-x-3">
//                       <button
//                         onClick={() => toggleFavorite(item.id)}
//                         className={`p-2 rounded-full shadow hover:scale-110 transition ${
//                           favorites[item.id] ? "bg-yellow-400 text-white" : "bg-gray-200 text-gray-600"
//                         }`}
//                       >
//                         <Star className="h-4 w-4" />
//                       </button>
//                       <button
//                         onClick={() => deleteUcapan(item.id)}
//                         className="p-2 rounded-full shadow bg-red-500 text-white hover:scale-110 transition"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </button>
//                     </td>
//                   </motion.tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" className="p-6 text-center text-gray-400 text-sm italic">
//                     Tidak ada ucapan.
//                   </td>
//                 </tr>
//               )}
//             </AnimatePresence>
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-between items-center mt-6">
//         <button
//           disabled={currentPage === 1}
//           onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//           className="flex items-center gap-1 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-50"
//         >
//           <ChevronLeft className="h-4 w-4" /> Prev
//         </button>

//         <span className="text-sm font-medium text-indigo-700">
//           Page {currentPage} of {totalPages}
//         </span>

//         <button
//           disabled={currentPage === totalPages || totalPages === 0}
//           onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//           className="flex items-center gap-1 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-50"
//         >
//           Next <ChevronRight className="h-4 w-4" />
//         </button>
//       </div>
//     </div>
//   );
// }

// src/pages/dashboard/Ucapan.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, Star, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import useUcapanTamu from "../../../api/ucapan_tamu/useUcapanTamu";
import useInvitations from "../../../api/invitations/useInvitations";


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

export default function Ucapan() {
  // State untuk filter yang akan dikirim ke backend
  const [filters, setFilters] = useState({
    invitation_id: "", // Awalnya kosong
    search: "",
    page: 1,
    limit: 5,
  });
  
  // State untuk data dari API
  const [invitations, setInvitations] = useState([]);
  
  // State khusus UI (frontend-only)
  const [favorites, setFavorites] = useState({});

  // Panggil hook ucapan tamu
  const {
    data: ucapanData,
    pagination,
    loading,
    getList: getUcapanList,
    remove,
  } = useUcapanTamu();

  // Panggil hook undangan untuk mengisi dropdown filter
  const { getList: getInvitationList } = useInvitations();

  // 1. Ambil daftar undangan sekali saat komponen dimuat
  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        // Ambil semua undangan tanpa paginasi untuk dropdown
        const res = await getInvitationList({ limit: 999 }); 
        console.log('[Ucapan.jsx] Menerima dari hook:', res); // <-- LOG 3
   
        setInvitations(res.data || []);
      } catch (err) {
        console.error("Gagal mengambil daftar undangan:", err);
      }
    };
    fetchInvitations();
  }, [getInvitationList]);

  // 2. Ambil daftar ucapan setiap kali filter berubah
  useEffect(() => {
    // Hanya panggil API jika invitation_id sudah dipilih
    if (filters.invitation_id) {
      getUcapanList(filters);
    }
  }, [filters, getUcapanList]);

  // 3. Handler untuk perubahan filter
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset ke halaman 1 setiap kali filter berubah
    }));
  };

  // Debounce handler untuk input pencarian
  const debouncedSearch = useCallback(debounce((value) => {
    handleFilterChange('search', value);
  }, 500), []);


  const handleDelete = async (id) => {
    Swal.fire({
      title: "Yakin ingin menghapus ucapan ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await remove(id);
          // Panggil ulang getList untuk refresh data setelah hapus
          getUcapanList(filters); 
          Swal.fire({
            icon: "success",
            title: "Dihapus!",
            text: "Ucapan berhasil dihapus.",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch(err) {
            Swal.fire("Gagal!", "Gagal menghapus ucapan.", "error");
        }
      }
    });
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl shadow-2xl border border-indigo-100">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-extrabold text-indigo-700 mb-6 drop-shadow-sm"
      >
        ✨ Data Kata Ucapan
      </motion.h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0 mb-6">
        <select
          value={filters.invitation_id}
          onChange={(e) => handleFilterChange('invitation_id', e.target.value)}
          className="px-4 py-2 border rounded-xl shadow-md hover:shadow-lg transition bg-white focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">Pilih Undangan</option>
          {invitations.map((inv) => (
            <option key={inv.id} value={inv.id}>
              {inv.name}
            </option>
          ))}
        </select>

        {/* Filter status ditiadakan karena backend tidak mendukungnya, bisa ditambahkan nanti */}
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama atau ucapan..."
            onChange={(e) => debouncedSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-xl shadow-md hover:shadow-lg transition bg-white focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg bg-white">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-100 to-purple-100 text-left text-sm uppercase text-indigo-700">
              <th className="p-4">#</th>
              <th className="p-4">Nama Tamu</th>
              <th className="p-4">Ucapan</th>
              <th className="p-4">Status</th>
              <th className="p-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-400">Loading...</td>
                </tr>
              ) : ucapanData.length > 0 ? (
                ucapanData.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-indigo-50/70 transition cursor-pointer border-b border-gray-100"
                  >
                    <td className="p-4 text-sm font-medium text-gray-600">
                      {(pagination.currentPage - 1) * pagination.limit + index + 1}
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-800">{item.guest_name}</td>
                    <td className="p-4 text-sm text-gray-600 italic">{item.notes}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-md ${
                        item.attendance_status?.toLowerCase() === "hadir"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}>
                        {item.attendance_status}
                      </span>
                    </td>
                    <td className="p-4 flex space-x-3">
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className={`p-2 rounded-full shadow hover:scale-110 transition ${
                          favorites[item.id]
                            ? "bg-yellow-400 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        <Star className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-full shadow bg-red-500 text-white hover:scale-110 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-400 text-sm italic">
                    {filters.invitation_id ? "Tidak ada ucapan untuk undangan ini." : "Silakan pilih undangan terlebih dahulu."}
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 0 && (
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={pagination.currentPage === 1}
            onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
            className="flex items-center gap-1 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>
          <span className="text-sm font-medium text-indigo-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
            className="flex items-center gap-1 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-50"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}