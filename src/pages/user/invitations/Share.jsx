// // src/pages/user/invitations/Share.jsx

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, Copy, Plus, Users, Send } from "lucide-react";
import { toast } from 'react-toastify';
import useReceiveInvs from "../../../api/receive-inv/useReceiveInvs"; // Perbaikan path
import useInvitations from "../../../api/invitations/useInvitations";
import useKategoriPesan from "../../../api/kategori_pesan/useKategoriPesan";
import useTemplatePesan from "../../../api/template_pesan/useTemplatePesan";

// Komponen Modal untuk Tambah Tamu
const AddGuestModal = ({ isOpen, onClose, onSubmit, invitationId }) => {
  const [formData, setFormData] = useState({ recipient: '', phone_number: '', email: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      invitation_id: invitationId,
      code: Math.random().toString(36).substring(2, 8).toUpperCase(),
    };
    onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Tambah Tamu Baru</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="recipient" onChange={handleChange} placeholder="Nama Penerima" className="w-full border p-2 rounded" required />
          <input name="phone_number" onChange={handleChange} placeholder="Nomor WhatsApp (e.g., 6281...)" className="w-full border p-2 rounded" required />
          <input name="email" type="email" onChange={handleChange} placeholder="Email (Opsional)" className="w-full border p-2 rounded" />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function SharePage() {
  const { invitationId } = useParams();
  const navigate = useNavigate();

  const { data: guests, loading: loadingGuests, getList: getGuestList, create: createGuest, update, importFromExcel } = useReceiveInvs();
  const { getById: getInvitation, loading: loadingInvitation } = useInvitations();
  const { data: kategoriList, getList: getKategoriList } = useKategoriPesan();
  const { data: templateList, getList: getTemplateList } = useTemplatePesan();

  const [selectedKategoriId, setSelectedKategoriId] = useState('');
  const [pesan, setPesan] = useState('');
  const [invitation, setInvitation] = useState(null);
  const [shareLink, setShareLink] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Ambil daftar kategori sekali saja
  useEffect(() => {
    getKategoriList();
  }, [getKategoriList]);

  // Ambil template pesan saat kategori berubah
  useEffect(() => {
    if (selectedKategoriId) {
      getTemplateList({ kategori_pesan_id: selectedKategoriId, limit: 999 });
    }
  }, [selectedKategoriId, getTemplateList]);

  // Ambil detail undangan dan daftar tamu saat invitationId tersedia
  useEffect(() => {
    if (invitationId) {
      const fetchInitialData = async () => {
        try {
          const invData = await getInvitation(invitationId);
          setInvitation(invData);
          setShareLink(`${window.location.origin}/share/${invitationId}`);
        } catch (err) {
          toast.error("Gagal memuat detail undangan.");
        }
      };
      fetchInitialData();
      getGuestList({ invitation_id: invitationId, limit: 999 });
    }
  }, [invitationId, getInvitation, getGuestList]);
  
  const refreshGuestList = useCallback(() => {
    if (invitationId) {
      getGuestList({ invitation_id: invitationId, limit: 999 });
    }
  }, [invitationId, getGuestList]);

  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    const selectedTemplate = templateList.find((t) => String(t.id) === String(templateId));
    if (selectedTemplate) {
      const templateContent = selectedTemplate.isi_pesan ?? selectedTemplate.content ?? '';
      setPesan(templateContent);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await importFromExcel(invitationId, formData);
    refreshGuestList(); // Refresh setelah import
    event.target.value = ''; // Reset input file
  };

  const handleAddGuest = async (payload) => {
    await createGuest(payload);
    refreshGuestList();
    setIsModalOpen(false);
  };

  const handleCopy = (link) => {
    navigator.clipboard.writeText(link);
    toast.success("Link berhasil disalin!");
  };

  return (
    <div className="bg-slate-50 min-h-screen p-8">
      <AddGuestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddGuest}
        invitationId={invitationId}
      />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileImport}
        accept=".xlsx,.xls,.csv"
      />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Sebar Undangan</h1>
            <p className="text-slate-500 mt-1">
              {loadingInvitation ? 'Memuat...' : `Untuk undangan: ${invitation?.name}`}
            </p>
          </div>
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-200"><X size={20} /></button>
        </div>

        {/* Link Utama */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
          <label className="text-sm font-semibold text-gray-700">Link Undangan Utama</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="w-full bg-slate-100 border rounded-lg px-3 py-2 focus:outline-none"
            />
            <button
              onClick={() => handleCopy(shareLink)}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Copy size={18} />
            </button>
          </div>
        </div>

        {/* BAGIAN TEMPLATE PESAN */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
          <label className="text-sm font-semibold text-gray-700">Template Pesan Kiriman</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <select 
              value={selectedKategoriId} 
              onChange={(e) => {
                setSelectedKategoriId(e.target.value);
                setPesan('');
              }} 
              className="border p-2 rounded-lg bg-white"
            >
              <option value="">Pilih Kategori</option>
              {kategoriList.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select 
              onChange={handleTemplateChange} 
              disabled={!selectedKategoriId || templateList.length === 0} 
              className="border p-2 rounded-lg bg-white disabled:bg-gray-100"
            >
              <option value="">Pilih Template</option>
              {templateList.map(tmpl => (
                <option key={tmpl.id} value={tmpl.id}>
                  {tmpl.content ? `${tmpl.content.substring(0, 40)}...` : 'Template Tanpa Konten'}
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={pesan}
            onChange={(e) => setPesan(e.target.value)}
            rows="5"
            placeholder="Tulis pesan Anda di sini atau pilih dari template di atas. Gunakan {nama_tamu} dan {link_undangan} sebagai placeholder."
            className="w-full border p-2 rounded-lg mt-4"
          />
        </div>

        {/* Daftar Tamu */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2"><Users /> Daftar Tamu ({guests.length})</h2>
            
            <div className="flex gap-2 flex-wrap">
              <a
                href="/template_tamu.xlsx"
                download="Template Daftar Tamu.xlsx"
                className="flex items-center gap-2 bg-white text-green-600 border border-green-600 px-4 py-2 rounded-lg hover:bg-green-50 font-semibold text-sm"
              >
                Download Template
              </a>
              <button
                onClick={handleImportClick}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-semibold text-sm"
              >
                Import Excel
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold text-sm"
              >
                <Plus size={16} /> Tambah Tamu
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-100 text-sm uppercase">
                  <th className="p-3">Nama Penerima</th>
                  <th className="p-3">No. WhatsApp</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loadingGuests ? (
                  <tr><td colSpan="3" className="text-center p-4">Memuat daftar tamu...</td></tr>
                ) : guests.length === 0 ? (
                  <tr><td colSpan="3" className="text-center p-4 text-slate-500">Belum ada tamu yang ditambahkan.</td></tr>
                ) : (
                  guests.map(guest => (
                    <tr key={guest.id} className="border-b">
                      <td className="p-3 font-medium">{guest.recipient}</td>
                      <td className="p-3 text-slate-600">{guest.phoneNumber}</td>
                      <td className="p-3">
                        <button 
<<<<<<< HEAD
                           onClick={async () => {
                             const personalLink = `${shareLink}?guest_code=${guest.code}`;

                             const messageTemplate = pesan || "Assalamualaikum Wr. Wb.\nTanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i {nama_tamu} untuk hadir di acara kami.\n\nInfo selengkapnya: {link_undangan}";

                             const finalMessage = messageTemplate
                               .replace(/{nama_tamu}/g, guest.recipient)
                               .replace(/{link_undangan}/g, personalLink);

                             // Membersihkan nomor telepon sebelum membuat link WA
                             const cleanPhoneNumber = String(guest.phoneNumber).replace(/[^0-9]/g, '');
                             const waUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodeURIComponent(finalMessage)}`;
                             window.open(waUrl, '_blank');

                             const payload = { ...guest, status: 'delivered' };
                             console.log('[Share] Attempting to mark guest as delivered', { id: guest.id, payload });

                             try {
                               const updatedGuest = await update(guest.id, payload);
                               console.log('[Share] Status update response', updatedGuest);
                               refreshGuestList();
                             } catch (error) {
                               console.error('[Share] Failed to update guest status', error);
                               toast.error("Gagal update status tamu.");
                             }
                           }}
                           className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                        >
                           <Send size={16} />
=======
                          onClick={async () => {
                            const personalLink = `${shareLink}?guest_code=${guest.code}`;

                            const messageTemplate = pesan || "Assalamualaikum Wr. Wb.\n\nTanpa mengurangi rasa hormat, kami mengundang {nama_tamu} untuk hadir di acara kami.\n\nInfo selengkapnya: {link_undangan}";

                            const finalMessage = messageTemplate
                              .replace(/{nama_tamu}/g, guest.recipient)
                              .replace(/{link_undangan}/g, personalLink);

                             // Membersihkan nomor telepon sebelum membuat link WA
                            const cleanPhoneNumber = String(guest.phoneNumber).replace(/[^0-9]/g, '');
                            const waUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodeURIComponent(finalMessage)}`;
                            window.open(waUrl, '_blank');

                            const payload = { ...guest, status: 'delivered' };
                            console.log('[Share] Attempting to mark guest as delivered', { id: guest.id, payload });

                            try {
                              const updatedGuest = await update(guest.id, payload);
                              console.log('[Share] Status update response', updatedGuest);
                              refreshGuestList();
                            } catch (error) {
                              console.error('[Share] Failed to update guest status', error);
                              toast.error("Gagal update status tamu.");
                            }
                          }}
                          className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                        >
                          <Send size={16} />
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// src/pages/user/invitations/Share.jsx

// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { X, Copy, Plus, Users, Send, Download } from "lucide-react"; // Tambahkan Download
// import { toast } from 'react-toastify';
// import useReceiveInvs from "../../../api/receive-inv/useReceiveInvs";
// import useInvitations from "../../../api/invitations/useInvitations";
// import useKategoriPesan from "../../../api/kategori_pesan/useKategoriPesan";
// import useTemplatePesan from "../../../api/template_pesan/useTemplatePesan";

// // Komponen Modal untuk Tambah Tamu
// const AddGuestModal = ({ isOpen, onClose, onSubmit, invitationId }) => {
//   const [formData, setFormData] = useState({ recipient: '', phone_number: '', email: '' });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const payload = {
//       ...formData,
//       invitation_id: invitationId,
//       code: Math.random().toString(36).substring(2, 8).toUpperCase(),
//     };
//     onSubmit(payload);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
//         <h2 className="text-xl font-bold mb-4">Tambah Tamu Baru</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input name="recipient" onChange={handleChange} placeholder="Nama Penerima" className="w-full border p-2 rounded" required />
//           <input name="phone_number" onChange={handleChange} placeholder="Nomor WhatsApp (e.g., 6281...)" className="w-full border p-2 rounded" required />
//           <input name="email" type="email" onChange={handleChange} placeholder="Email (Opsional)" className="w-full border p-2 rounded" />
//           <div className="flex justify-end gap-3">
//             <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
//             <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Simpan</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default function SharePage() {
//   const { invitationId } = useParams();
//   const navigate = useNavigate();

//   const { data: guests, loading: loadingGuests, getList: getGuestList, create: createGuest, update, importFromExcel } = useReceiveInvs();
//   const { getById: getInvitation, loading: loadingInvitation } = useInvitations();
//   const { data: kategoriList, getList: getKategoriList } = useKategoriPesan();
//   const { data: templateList, getList: getTemplateList } = useTemplatePesan();

//   const [selectedKategoriId, setSelectedKategoriId] = useState('');
//   const [pesan, setPesan] = useState('');
//   const [invitation, setInvitation] = useState(null);
//   const [shareLink, setShareLink] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const fileInputRef = useRef(null);

//   const refreshGuestList = useCallback(() => {
//     if (invitationId) {
//       getGuestList({ invitation_id: invitationId, limit: 999 });
//     }
//   }, [invitationId, getGuestList]);

//   useEffect(() => {
//     getKategoriList({ limit: 999 });
//     if (invitationId) {
//       const fetchInitialData = async () => {
//         try {
//           const invData = await getInvitation(invitationId);
//           setInvitation(invData);
//           setShareLink(`${window.location.origin}/share/${invitationId}`);
//         } catch (err) {
//           toast.error("Gagal memuat detail undangan.");
//         }
//       };
//       fetchInitialData();
//       refreshGuestList();
//     }
//   }, [invitationId, getInvitation, getKategoriList, refreshGuestList]);

//   useEffect(() => {
//     if (selectedKategoriId) {
//       // --- PERBAIKAN DI SINI ---
//       // Kirim 'kategori_pesan_id' sebagai parameter
//       getTemplateList({ kategori_pesan_id: selectedKategoriId, limit: 999 });
//     } else {
//       getTemplateList({ kategori_pesan_id: null });
//     }
//   }, [selectedKategoriId, getTemplateList]);

//    const handleTemplateChange = (e) => {
//     const templateId = e.target.value;
//     const selectedTemplate = templateList.find(t => t.id === Number(templateId));
//     if (selectedTemplate) {
//       // --- PERBAIKAN DI SINI ---
//       // Gunakan 'isi_pesan'
//       setPesan(selectedTemplate.isi_pesan);
//     }
//   };
  

//   const handleImportClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileImport = async (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;
//     const formData = new FormData();
//     formData.append("file", file);
//     await importFromExcel(invitationId, formData);
//     refreshGuestList();
//     event.target.value = '';
//   };

//   const handleAddGuest = async (payload) => {
//     await createGuest(payload);
//     refreshGuestList();
//     setIsModalOpen(false);
//   };

//   const handleCopy = (link) => {
//     navigator.clipboard.writeText(link);
//     toast.success("Link berhasil disalin!");
//   };

//   return (
//     <div className="bg-slate-50 min-h-screen p-8">
//       <AddGuestModal 
//         isOpen={isModalOpen} 
//         onClose={() => setIsModalOpen(false)} 
//         onSubmit={handleAddGuest}
//         invitationId={invitationId}
//       />
//       <input
//         type="file"
//         ref={fileInputRef}
//         className="hidden"
//         onChange={handleFileImport}
//         accept=".xlsx,.xls,.csv"
//       />
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h1 className="text-3xl font-bold text-slate-800">Sebar Undangan</h1>
//             <p className="text-slate-500 mt-1">
//               {loadingInvitation ? 'Memuat...' : `Untuk undangan: ${invitation?.name}`}
//             </p>
//           </div>
//           <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-200"><X size={20} /></button>
//         </div>

//         {/* Link Utama */}
//         <div className="bg-white p-4 rounded-lg shadow-md mb-8">
//           <label className="text-sm font-semibold text-gray-700">Link Undangan Utama</label>
//           <div className="flex items-center gap-2 mt-1">
//             <input
//               type="text"
//               value={shareLink}
//               readOnly
//               className="w-full bg-slate-100 border rounded-lg px-3 py-2 focus:outline-none"
//             />
//             <button
//               onClick={() => handleCopy(shareLink)}
//               className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               <Copy size={18} />
//             </button>
//           </div>
//         </div>

//         {/* Template Pesan */}
//        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
//         <label className="text-sm font-semibold text-gray-700">Template Pesan Kiriman</label>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
//           <select 
//             value={selectedKategoriId} 
//             onChange={(e) => {
//               setSelectedKategoriId(e.target.value);
//               setPesan('');
//             }} 
//             className="border p-2 rounded-lg bg-white"
//           >
//             <option value="">Pilih Kategori Pesan</option>
//             {kategoriList.map(cat => (
//               // --- PERBAIKAN DI SINI ---
//               // Gunakan 'nama_kategori'
//               <option key={cat.id} value={cat.id}>{cat.nama_kategori}</option>
//             ))}
//           </select>
//           <select 
//             onChange={handleTemplateChange} 
//             disabled={!selectedKategoriId || templateList.length === 0} 
//             className="border p-2 rounded-lg bg-white disabled:bg-gray-100"
//           >
//             <option value="">Pilih Template Pesan</option>
//             {templateList.map(tmpl => (
//               // --- PERBAIKAN DI SINI ---
//               // Gunakan 'nama_template' sebagai judul di dropdown
//               <option key={tmpl.id} value={tmpl.id}>
//                 {tmpl.nama_template || 'Template Tanpa Nama'}
//               </option>
//             ))}
//           </select>
//         </div>
//         <textarea
//           value={pesan}
//           onChange={(e) => setPesan(e.target.value)}
//           rows="5"
//           placeholder="Tulis pesan Anda di sini atau pilih dari template di atas. Gunakan {nama_tamu} dan {link_undangan} sebagai placeholder."
//           className="w-full border p-2 rounded-lg mt-4"
//         />
//       </div>

//         {/* Daftar Tamu */}
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
//             <h2 className="text-xl font-bold flex items-center gap-2"><Users /> Daftar Tamu ({guests.length})</h2>
//             <div className="flex gap-2 flex-wrap">
//               <a href="/template_tamu.xlsx" download="Template Daftar Tamu.xlsx" className="flex items-center gap-2 bg-white text-green-600 border border-green-600 px-4 py-2 rounded-lg hover:bg-green-50 font-semibold text-sm">
//                 <Download size={16} /> Download Template
//               </a>
//               <button onClick={handleImportClick} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-semibold text-sm">Import Excel</button>
//               <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold text-sm"><Plus size={16} /> Tambah Tamu</button>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full text-left">
//               <thead>
//                 <tr className="bg-slate-100 text-sm uppercase">
//                   <th className="p-3">Nama Penerima</th>
//                   <th className="p-3">No. WhatsApp</th>
//                   <th className="p-3">Aksi</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loadingGuests ? (
//                   <tr><td colSpan="3" className="text-center p-4">Memuat daftar tamu...</td></tr>
//                 ) : guests.length === 0 ? (
//                   <tr><td colSpan="3" className="text-center p-4 text-slate-500">Belum ada tamu yang ditambahkan.</td></tr>
//                 ) : (
//                   guests.map(guest => (
//                     <tr key={guest.id} className="border-b">
//                       <td className="p-3 font-medium">{guest.recipient}</td>
//                       <td className="p-3 text-slate-600">{guest.phoneNumber}</td>
//                       <td className="p-3">
//                         <button 
//                            onClick={() => {
//                              const personalLink = `${shareLink}?guest_code=${guest.code}`;
//                              const messageTemplate = pesan || "Kami mengundang {nama_tamu} untuk hadir di acara kami. Info selengkapnya: {link_undangan}";
//                              const finalMessage = messageTemplate
//                                .replace(/{nama_tamu}/g, guest.recipient)
//                                .replace(/{link_undangan}/g, personalLink);
//                              const cleanPhoneNumber = String(guest.phoneNumber).replace(/[^0-9]/g, '');
//                              const waUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodeURIComponent(finalMessage)}`;
//                              window.open(waUrl, '_blank');
//                            }}
//                            className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
//                         >
//                            <Send size={16} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }