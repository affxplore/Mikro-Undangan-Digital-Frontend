// import React, { useMemo, useState, useEffect } from "react";
// import { Search, Eye, Check, Tag, Grid, Filter, Star, Sparkles, X, Share2, ExternalLink, LayoutGrid, Rows, SlidersHorizontal } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import useTemplates from '../../api/templates/useTemplates'


// export default function TemaPage() {

//    const {
//       data,
//       loading,
//       pagination,
//       error,
//       getList,
//       getById,
//       postCreate,
//       Edit,
//       Delete
  
      
  
//     }=useTemplates(0);
  
//     const content = data[0]


//   const categories = [
//     { name: "Semua", icon: "🎯", count: 3 },
//     { name: "Pernikahan", icon: "💍", count: 1 },
//     { name: "Ulang Tahun", icon: "🎂", count: 1 },
//     { name: "Natal", icon: "🎄", count: 1 },
//   ];

//   const dummyTemplates = [
//     {
//       id: "t1",
//       name: "Elegan Pernikahan",
//       category: "Pernikahan",
//       price: "Free",
//       tagline: "Minimalis & Romantis",
//       colors: ["#fef3c7", "#fde68a"],
//       thumbAccent: "bg-gradient-to-br from-pink-200 to-rose-300",
//       rating: 4.9,
//       views: 2543,
//       isNew: false,
//       isFeatured: true,
//       previewUrl: "/html/undangan-bfl.html", // URL untuk preview iframe
//     },
//     {
//       id: "t2",
//       name: "Happy Happy",
//       category: "Ulang Tahun",
//       price: "Premium",
//       tagline: "Hangat & Natural",
//       colors: ["#fce7f3", "#fbcfe8"],
//       thumbAccent: "bg-gradient-to-br from-amber-200 to-orange-300",
//       rating: 4.8,
//       views: 1876,
//       isNew: true,
//       isFeatured: false,
//       previewUrl: "/html/undangan-bfl.html", // Placeholder, ganti dengan URL sebenarnya
//     },
//     {
//       id: "t3",
//       name: "Merry Christmas",
//       category: "Natal",
//       price: "Free",
//       tagline: "Warna-warni & Ceria",
//       colors: ["#dbeafe", "#bfdbfe"],
//       thumbAccent: "bg-gradient-to-br from-emerald-200 to-green-300",
//       rating: 4.7,
//       views: 3421,
//       isNew: false,
//       isFeatured: false,
//       previewUrl: "/html/undangan-natal1.html", // Placeholder, ganti dengan URL sebenarnya
//     },
//   ];

//   const [activeCategory, setActiveCategory] = useState("Semua");
//   const [query, setQuery] = useState("");
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const [previewMode, setPreviewMode] = useState("mobile");
//   const [priceFilter, setPriceFilter] = useState("Semua"); // Semua | Gratis | Premium | Terbaru
//   const [sortBy, setSortBy] = useState("Paling Populer"); // Paling Populer | Rating Tertinggi | Terbaru
//   const [viewMode, setViewMode] = useState("grid"); // grid | list (opsional)

//   // ESC untuk tutup modal
//   useEffect(() => {
//     const onKey = (e) => { if (e.key === "Escape") setSelectedTemplate(null); };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, []);

//   const filtered = useMemo(() => {
//     let data = dummyTemplates.filter((t) => {
//       if (activeCategory !== "Semua" && t.category !== activeCategory) return false;
//       if (priceFilter === "Gratis" && t.price !== "Free") return false;
//       if (priceFilter === "Premium" && t.price !== "Premium") return false;
//       const q = query.trim().toLowerCase();
//       if (!q) return true;
//       return (t.name + " " + t.tagline + " " + t.category).toLowerCase().includes(q);
//     });

//     if (sortBy === "Paling Populer") {
//       data = data.sort((a, b) => b.views - a.views);
//     } else if (sortBy === "Rating Tertinggi") {
//       data = data.sort((a, b) => b.rating - a.rating);
//     } else if (sortBy === "Terbaru") {
//       data = data.sort((a, b) => Number(b.isNew) - Number(a.isNew));
//     }
//     return data;
//   }, [activeCategory, priceFilter, query, sortBy]);

//   function openPreview(tpl) {
//     setSelectedTemplate(tpl);
//     setPreviewMode("mobile");
//   }

//   function chooseTemplate(tpl) {
//     alert(`Kamu memilih template: ${tpl.name} (${tpl.price})`);
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//       {/* HERO */}
//       <div className="relative overflow-hidden bg-gradient-to-r from-blue-300 via-purple-500 to-indigo-400">
//         <div className="absolute inset-0 opacity-20">
//           <Noise />
//         </div>
//         <header className="relative z-10 px-6 py-12 md:px-10 md:py-16">
//           <div className="mx-auto max-w-7xl">
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
//               <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm mb-4">
//                 <Sparkles className="w-4 h-4" /> Template Premium & Gratis
//               </div>
//               <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 tracking-tight">
//                 Katalog Template
//                 <span className="block text-2xl md:text-3xl font-medium text-blue-100 mt-2">Undangan Digital</span>
//               </h1>
//               <p className="text-lg text-blue-100/95 max-w-2xl mx-auto">
//                 Temukan template undangan digital yang sempurna. Desain profesional, mudah dikustomisasi, dan siap pakai.
//               </p>
//             </motion.div>

//             {/* Search + Sort */}
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-col items-center gap-3 md:flex-row md:justify-center">
//               <div className="relative max-w-md w-full">
//                 <input
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/95 backdrop-blur-sm border-0 shadow-xl placeholder-slate-400 text-slate-700 focus:ring-4 focus:ring-white/30 focus:outline-none"
//                   placeholder="Cari template impianmu..."
//                   aria-label="Cari template"
//                 />
//                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
//               </div>
//               <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-2xl px-3 py-2 text-white">
//                 <SlidersHorizontal className="w-4 h-4 opacity-90" />
//                 <label htmlFor="sort" className="text-sm opacity-90">Urutkan</label>
//                 <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-white/95 font-medium focus:outline-none">
//                   <option className="text-slate-800">Paling Populer</option>
//                   <option className="text-slate-800">Rating Tertinggi</option>
//                   <option className="text-slate-800">Terbaru</option>
//                 </select>
//               </div>
//             </motion.div>
//           </div>
//         </header>
//       </div>

//       {/* BODY */}
//       <div className="px-6 py-10 md:px-10">
//         <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* SIDEBAR */}
//           <motion.aside initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
//             <div className="sticky top-6 bg-white/90 rounded-3xl shadow-xl p-6 border border-white/40 backdrop-blur">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-2 bg-blue-100 rounded-xl"><Filter className="w-5 h-5 text-blue-600" /></div>
//                 <h3 className="font-bold text-slate-800">Filter</h3>
//               </div>

//               {/* Kategori */}
//               <h4 className="text-sm font-semibold text-slate-700 mb-3">Kategori</h4>
//               <ul className="space-y-3">
//                 {categories.map((c) => (
//                   <li key={c.name}>
//                     <motion.button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={() => setActiveCategory(c.name)}
//                       className={`w-full text-left p-4 rounded-2xl transition-all duration-200 ${
//                         activeCategory === c.name
//                           ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
//                           : "bg-slate-50 hover:bg-slate-100 text-slate-700"
//                       }`}
//                       aria-pressed={activeCategory === c.name}
//                     >
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                           <span className="text-lg">{c.icon}</span>
//                           <span className="font-medium">{c.name}</span>
//                         </div>
//                         <span className={`text-xs px-2 py-1 rounded-full ${
//                           activeCategory === c.name ? "bg-white/20" : "bg-slate-200"
//                         }`}>
//                           {c.count}
//                         </span>
//                       </div>
//                     </motion.button>
//                   </li>
//                 ))}
//               </ul>

//               {/* Harga */}
//               <div className="mt-8 pt-6 border-t border-slate-200">
//                 <h4 className="text-sm font-semibold text-slate-700 mb-3">Harga</h4>
//                 <div className="flex flex-wrap gap-2">
//                   {["Semua", "Gratis", "Premium"].map((filter) => (
//                     <motion.button
//                       key={filter}
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => setPriceFilter(filter)}
//                       className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
//                         priceFilter === filter
//                           ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
//                           : "bg-gradient-to-r from-slate-100 to-slate-200 hover:from-blue-100 hover:to-purple-100 text-slate-700"
//                       }`}
//                       aria-pressed={priceFilter === filter}
//                     >
//                       {filter}
//                     </motion.button>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </motion.aside>

//           {/* MAIN */}
//           <section className="lg:col-span-3">
//             <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-wrap items-center justify-between gap-3">
//               <div className="flex items-center gap-4">
//                 <div className="text-slate-600">
//                   Menampilkan <span className="font-bold text-blue-700">{filtered.length}</span> template
//                 </div>
//                 {filtered.length > 0 && <div className="h-6 w-px bg-slate-300" />}
//                 <div className="hidden sm:flex gap-1 rounded-xl bg-slate-100 p-1">
//                   <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-white shadow" : "text-slate-600"}`} aria-label="Grid view"><LayoutGrid className="w-4 h-4" /></button>
//                   <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg ${viewMode === "list" ? "bg-white shadow" : "text-slate-600"}`} aria-label="List view"><Rows className="w-4 h-4" /></button>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2 text-slate-500 text-sm">
//                 <Tag className="w-4 h-4" />
//                 {activeCategory}
//               </div>
//             </motion.div>

//             {/* GRID / LIST */}
//             {viewMode === "grid" ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
//                 {filtered.map((t, index) => (
//                   <TemplateCard key={t.id} t={t} index={index} onPreview={() => openPreview(t)} onChoose={() => chooseTemplate(t)} />
//                 ))}
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {filtered.map((t, index) => (
//                   <TemplateRow key={t.id} t={t} index={index} onPreview={() => openPreview(t)} onChoose={() => chooseTemplate(t)} />
//                 ))}
//               </div>
//             )}

//             {filtered.length === 0 && (
//               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 text-center bg-white/70 rounded-3xl border border-white/50">
//                 <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-2xl flex items-center justify-center"><Search className="w-8 h-8 text-slate-400" /></div>
//                 <h3 className="text-xl font-semibold text-slate-700 mb-2">Tidak ada template ditemukan</h3>
//                 <p className="text-slate-500">Coba kata kunci lain atau pilih kategori berbeda.</p>
//               </motion.div>
//             )}
//           </section>
//         </div>
//       </div>

//       {/* MODAL PREVIEW */}
//       <AnimatePresence>
//         {selectedTemplate && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
//             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTemplate(null)} />
//             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden z-50 border border-white/20">
//               {/* Header */}
//               <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
//                 <div className="flex items-start justify-between gap-3">
//                   <div>
//                     <h3 className="text-2xl font-bold mb-1">{selectedTemplate.name}</h3>
//                     <div className="flex flex-wrap items-center gap-3 text-blue-100">
//                       <span>{selectedTemplate.tagline}</span>
//                       <span className="opacity-60">•</span>
//                       <span>{selectedTemplate.category}</span>
//                       <span className="opacity-60">•</span>
//                       <span className={`px-3 py-1 rounded-full text-sm font-bold ${
//                         selectedTemplate.price === "Free" ? "bg-white/20" : "bg-amber-400 text-amber-900"
//                       }`}>
//                         {selectedTemplate.price}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <div className="flex bg-white/20 rounded-2xl p-1">
//                       <button onClick={() => setPreviewMode("mobile")} className={`px-4 py-2 rounded-xl font-medium transition-all ${previewMode === "mobile" ? "bg-white text-blue-600" : "text-white/90"}`}>📱 Mobile</button>
//                       <button onClick={() => setPreviewMode("desktop")} className={`px-4 py-2 rounded-xl font-medium transition-all ${previewMode === "desktop" ? "bg-white text-blue-600" : "text-white/90"}`}>💻 Desktop</button>
//                     </div>
//                     <button onClick={() => setSelectedTemplate(null)} className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition" aria-label="Tutup">
//                       <X className="w-5 h-5" />
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Content */}
//               <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                   {/* Preview */}
//                   <div className="lg:col-span-2">
//                     <div className="bg-slate-50 rounded-2xl p-4 sm:p-8 min-h-[500px] flex items-center justify-center">
                      
//                       {/* ==== PERUBAHAN DIMULAI DI SINI ==== */}
//                       {previewMode === "mobile" ? (
//                         <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-[320px] h-[640px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border-8 border-slate-800">
//                           <iframe
//                             src={selectedTemplate.previewUrl}
//                             title={selectedTemplate.name}
//                             className="w-full h-full border-0"
//                           />
//                         </motion.div>
//                       ) : (
//                         <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full h-96 bg-white rounded-2xl shadow-xl overflow-hidden border">
//                           <iframe
//                             src={selectedTemplate.previewUrl}
//                             title={selectedTemplate.name}
//                             className="w-full h-full border-0"
//                           />
//                         </motion.div>
//                       )}
//                       {/* ==== PERUBAHAN BERAKHIR DI SINI ==== */}

//                     </div>
//                   </div>

//                   {/* Info */}
//                   <aside className="lg:col-span-1 space-y-6">
//                     <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
//                       <h4 className="font-bold text-lg mb-4">Statistik Template</h4>
//                       <div className="space-y-3">
//                         <div className="flex justify-between items-center">
//                           <span className="text-slate-600">Rating</span>
//                           <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" fill="currentColor" /><span className="font-semibold">{selectedTemplate.rating}</span></div>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span className="text-slate-600">Views</span>
//                           <span className="font-semibold">{selectedTemplate.views.toLocaleString()}</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span className="text-slate-600">Harga</span>
//                           <span className={`px-3 py-1 rounded-full text-sm font-bold ${selectedTemplate.price === "Free" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-amber-700"}`}>{selectedTemplate.price}</span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="space-y-3">
//                       <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => chooseTemplate(selectedTemplate)} className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition">
//                         <Check className="w-5 h-5" /> Pilih Template Ini
//                       </motion.button>
//                       <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl flex items-center justify-center gap-2 transition">
//                         <Share2 className="w-4 h-4" /> Bagikan Template
//                       </motion.button>
//                       <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full px-6 py-4 border-2 border-slate-200 hover:border-blue-300 text-slate-700 font-semibold rounded-2xl flex items-center justify-center gap-2 transition">
//                         <ExternalLink className="w-4 h-4" /> Buka di Tab Baru
//                       </motion.button>
//                     </div>

//                     <div className="bg-white rounded-2xl p-6 border border-slate-200">
//                       <h4 className="font-bold text-lg mb-4">Fitur Template</h4>
//                       <ul className="space-y-3 text-sm">
//                         {[
//                           "Responsive di semua device",
//                           "Mudah dikustomisasi",
//                           "Loading cepat",
//                           "SEO optimized",
//                         ].map((f) => (
//                           <li key={f} className="flex items-center gap-3">
//                             <span className="w-2 h-2 bg-green-500 rounded-full" />
//                             <span>{f}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   </aside>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// // ... (Komponen TemplateCard, TemplateRow, dan Noise tidak perlu diubah)

// function TemplateCard({ t, index, onPreview, onChoose }) {
//   return (
//     <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} whileHover={{ y: -6, scale: 1.01 }} className="group bg-white/80 backdrop-blur rounded-3xl shadow-lg hover:shadow-2xl border border-white/40 overflow-hidden transition">
//       {/* Preview */}
//       <div className="relative">
//         <div className={`h-48 ${t.thumbAccent} relative overflow-hidden`}>
//           {/* Badges */}
//           <div className="absolute top-4 left-4 flex gap-2">
//             {t.isNew && <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">NEW</span>}
//             {t.isFeatured && (
//               <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
//                 <Star className="w-3 h-3" fill="currentColor" /> FEATURED
//               </span>
//             )}
//           </div>
//           {/* Price */}
//           <div className="absolute top-4 right-4">
//             <span className={`px-4 py-2 rounded-full text-sm font-bold ${t.price === "Free" ? "bg-green-100 text-green-700" : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"}`}>{t.price}</span>
//           </div>
//           {/* Decorative gradient card */}
//           <div className="absolute inset-0 flex items-center justify-center">
//             <motion.div whileHover={{ scale: 1.08 }} className="w-32 h-20 rounded-2xl shadow-2xl" style={{ background: `linear-gradient(135deg, ${t.colors[0]}, ${t.colors[1]})` }} />
//           </div>
//           {/* Hover overlay */}
//           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition grid place-items-center">
//             <motion.button initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} onClick={onPreview} className="opacity-0 group-hover:opacity-100 px-6 py-3 bg-white rounded-2xl font-semibold text-slate-700 flex items-center gap-2 transition">
//               <Eye className="w-5 h-5" /> Preview
//             </motion.button>
//           </div>
//         </div>
//       </div>
//       {/* Info */}
//       <div className="p-6">
//         <div className="mb-3">
//           <h3 className="font-bold text-xl text-slate-800 mb-1">{t.name}</h3>
//           <p className="text-slate-600 text-sm">{t.tagline}</p>
//         </div>
//         <div className="flex items-center gap-4 mb-4 text-sm text-slate-500">
//           <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" fill="currentColor" /><span className="font-medium">{t.rating}</span></div>
//           <div className="flex items-center gap-1"><Eye className="w-4 h-4" /><span>{t.views.toLocaleString()}</span></div>
//         </div>
//         <div className="flex gap-3">
//           <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onPreview} className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-200 hover:border-blue-300 text-slate-600 hover:text-blue-600 font-medium transition flex items-center justify-center gap-2">
//             <Eye className="w-4 h-4" /> Demo
//           </motion.button>
//           <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onChoose} className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition flex items-center justify-center gap-2">
//             <Check className="w-4 h-4" /> Pilih
//           </motion.button>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// function TemplateRow({ t, index, onPreview, onChoose }) {
//   return (
//     <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white/80 backdrop-blur rounded-2xl border border-white/50 shadow hover:shadow-lg p-4 flex items-center gap-4">
//       <div className={`w-36 h-24 rounded-xl ${t.thumbAccent} relative overflow-hidden grid place-items-center`}>
//         <div className="absolute top-2 left-2 flex gap-1">
//           {t.isNew && <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full">NEW</span>}
//           {t.isFeatured && <span className="px-2 py-0.5 bg-yellow-500 text-white text-[10px] font-bold rounded-full">★</span>}
//         </div>
//         <motion.div whileHover={{ scale: 1.06 }} className="w-16 h-10 rounded-xl shadow-xl" style={{ background: `linear-gradient(135deg, ${t.colors[0]}, ${t.colors[1]})` }} />
//       </div>
//       <div className="flex-1">
//         <div className="flex flex-wrap items-center gap-2">
//           <h3 className="font-semibold text-slate-800">{t.name}</h3>
//           <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">{t.category}</span>
//           <span className={`text-xs px-2 py-1 rounded-full ${t.price === "Free" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{t.price}</span>
//         </div>
//         <p className="text-sm text-slate-600 mt-1">{t.tagline}</p>
//         <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
//           <div className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500" fill="currentColor" /><span>{t.rating}</span></div>
//           <div className="flex items-center gap-1"><Eye className="w-3 h-3" /><span>{t.views.toLocaleString()}</span></div>
//         </div>
//       </div>
//       <div className="flex items-center gap-2">
//         <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onPreview} className="px-3 py-2 rounded-xl border border-slate-200 hover:border-blue-300 text-slate-700">Demo</motion.button>
//         <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onChoose} className="px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">Pilih</motion.button>
//       </div>
//     </motion.div>
//   );
// }

// function Noise() {
//   // Background subtle noise pattern
//   return (
//     <div
//       aria-hidden
//       className="w-full h-full"
//       style={{
//         backgroundImage:
//           "radial-gradient(rgba(255,255,255,.15) 1px, transparent 1px), radial-gradient(rgba(0,0,0,.15) 1px, transparent 1px)",
//         backgroundSize: "18px 18px, 18px 18px",
//         backgroundPosition: "0 0, 9px 9px",
//       }}
//     />
//   );
// }