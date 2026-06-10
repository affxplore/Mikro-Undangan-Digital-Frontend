<<<<<<< HEAD
// import React from 'react';
// import Modal from '../../../components/Modal'; // Sesuaikan path ke komponen Modal utama Anda
// import Previewer from '../../../components/Previewer';         // Impor komponen Previewer

// /**
//  * Modal yang didedikasikan untuk menampilkan pratinjau template (desktop/mobile).
//  * Menggunakan komponen Previewer untuk logika tampilannya.
//  *
//  * @param {object} props - Properti komponen.
//  * @param {boolean} props.open - Status Tampil/Sembunyi modal.
//  * @param {Function} props.onClose - Fungsi callback saat modal ditutup.
//  * @param {object} props.templateData - Data template yang akan ditampilkan (harus ada .name dan .previewUrl).
//  */
// const PreviewTemplateModal = ({ open, onClose, templateData }) => {
//   // Jangan render apapun jika modal tidak terbuka atau tidak ada data
//   if (!open || !templateData) {
//     return null;
//   }

//   return (
//     <Modal
//       open={open}
//       onClose={onClose}
//       title={`Preview: ${templateData.name}`}
//       size="6xl" // Gunakan ukuran yang sangat besar agar preview desktop terlihat bagus
//     >
//       {/* Beri kontainer tinggi agar Previewer bisa mengisi ruang */}
//       <div className="w-full h-[80vh]">
//         <Previewer url={templateData.previewUrl} />
//       </div>
//     </Modal>
//   );
// };

// export default PreviewTemplateModal;

import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../../../components/Modal';
import Previewer from '../../../components/Previewer';
import { buildHTML } from '../../../utils/InvitationBuilder'; // Impor fungsi buildHTML
import useTemplates from '../../../api/templates/useTemplates';
import FullScreenSpinner from '../../../components/FullScreenSpinner';

/**
 * Modal pintar untuk menampilkan pratinjau dari URL file HTML
 * atau dari data JSON yang di-render secara on-the-fly.
 */
const PreviewTemplateModal = ({ open, onClose, templateData }) => {
  // State untuk menyimpan URL akhir yang akan ditampilkan di iframe
  const [displayUrl, setDisplayUrl] = useState(null);
=======
import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../../../components/Modal';
import Previewer from '../../../components/Previewer';
import { buildHTML } from '../../../utils/InvitationBuilder';
import useTemplates from '../../../api/templates/useTemplates';
import FullScreenSpinner from '../../../components/FullScreenSpinner';
import { Share2, ExternalLink, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PreviewTemplateModal = ({ open, onClose, templateData }) => {
  const [displayUrl, setDisplayUrl] = useState("");
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);
  const { getById } = useTemplates();
<<<<<<< HEAD

  useEffect(() => {
    let blobUrlToClean = null;

    async function ensureFullTemplateAndBuild() {
  if (!open || !templateData) return;

  console.log('[PreviewModal] ensureFullTemplateAndBuild start', { open, templateData });
  setLoading(true);
  setError(null);

      // Jika templateData sudah lengkap (mempunyai previewUrl/html/pages), gunakan langsung
      const hasPreview = (typeof templateData.previewUrl === 'string' && templateData.previewUrl) || (typeof templateData.html === 'string' && templateData.html) || (templateData.pages && Array.isArray(templateData.pages));

      let src = templateData;

      if (!hasPreview && templateData.id && typeof getById === 'function') {
        try {
          const fetched = await getById(templateData.id);
          if (fetched) {
            src = fetched;
          }
        } catch {
          // Provide a user-facing error and set error state
          toast.error('Gagal memuat template untuk pratinjau.');
          setError('Gagal memuat template.');
          setLoading(false);
          return;
        }
      }

      let finalUrl = '';

      try {
        if (typeof src.previewUrl === 'string' && src.previewUrl) {
          const abs = ensureAbsoluteUrl(src.previewUrl);
          console.log('[PreviewModal] using previewUrl directly', src.previewUrl, '->', abs);
          finalUrl = abs;
        } else if (typeof src.fileUrl === 'string' && src.fileUrl) {
          // fallback to fileUrl (thumbnail_file)
          const fileUrlAbs = ensureAbsoluteUrl(src.fileUrl);
          console.log('[PreviewModal] attempting to fetch fileUrl', src.fileUrl, '->', fileUrlAbs);
          // attach Authorization header if available
          const auth = getAuth();
          const token = auth?.accessToken || auth?.accesstoken || null;
          const headers = token ? { Authorization: `Bearer ${token}` } : {};
          const resp = await fetch(fileUrlAbs, { headers });
          console.log('[PreviewModal] fetch status for fileUrl', resp.status);
          if (resp.ok) {
            const text = await resp.text();
            console.log('[PreviewModal] fetched text length', text.length);
            // Try parse as JSON
            try {
              const parsed = JSON.parse(text);
              console.log('[PreviewModal] parsed JSON keys', Object.keys(parsed));
              const pages = parsed.pages || (parsed.template_data && parsed.template_data.pages) || null;
              if (pages && Array.isArray(pages)) {
                const htmlContent = buildHTML(pages);
                const blob = new Blob([htmlContent], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                console.log('[PreviewModal] built blob URL from JSON pages', url);
                finalUrl = url;
                blobUrlToClean = url;
              } else {
                // Not JSON template data, fallback to creating blob/html if possible
                if (/<html[\s>]/i.test(text)) {
                  const blob = new Blob([text], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  console.log('[PreviewModal] built blob URL from HTML text', url);
                  finalUrl = url;
                  blobUrlToClean = url;
                } else {
                  console.log('[PreviewModal] fileUrl text is not JSON/HTML, falling back to URL');
                  finalUrl = fileUrlAbs || src.fileUrl;
                }
              }
            } catch {
              console.log('[PreviewModal] fileUrl content is not valid JSON');
              // Not JSON — maybe HTML or binary file; if text looks like HTML, create blob
              if (/<html[\s>]/i.test(text)) {
                const blob = new Blob([text], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                console.log('[PreviewModal] built blob URL from fallback HTML text', url);
                finalUrl = url;
                blobUrlToClean = url;
              } else {
                console.log('[PreviewModal] falling back to remote fileUrl (may be binary)');
                finalUrl = src.fileUrl;
              }
            }
          } else {
            console.warn('[PreviewModal] fetch for fileUrl returned non-ok', resp.status, resp.statusText, fileUrlAbs);
            // If server returned 404/401 etc, prefer to show the absolute URL (so iframe will try to load it)
            finalUrl = fileUrlAbs || src.fileUrl;
          }
        } else if (typeof src.html === 'string' && src.html) {
          console.log('[PreviewModal] building blob from src.html');
          const blob = new Blob([src.html], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          finalUrl = url;
          blobUrlToClean = url;
        } else if (src.pages && Array.isArray(src.pages)) {
          console.log('[PreviewModal] building blob from src.pages');
          const htmlContent = buildHTML(src.pages);
          const blob = new Blob([htmlContent], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          finalUrl = url;
          blobUrlToClean = url;
        }
      } catch {
        // Provide user-facing error for parse/fetch failures
        toast.error('Gagal memuat preview dari file.');
        setError('Gagal memuat preview dari file.');
        finalUrl = src.fileUrl || null;
      }

      // Ensure displayUrl is null instead of empty string to avoid empty-src warnings
      setDisplayUrl(finalUrl || null);
      setLoading(false);
    }

    ensureFullTemplateAndBuild();

    return () => {
      if (blobUrlToClean) {
        try {
          URL.revokeObjectURL(blobUrlToClean);
        } catch (e) {
          // ignore
        }
      }
    };
  }, [open, templateData, getById, retryKey]);

  const handleRetry = useCallback(() => {
    // bump a key to force the effect to re-run
    setError(null);
    setDisplayUrl(null);
    setRetryKey((k) => k + 1);
  }, []);

  if (!open || !templateData) {
    return null;
  } 
=======
  const navigate = useNavigate();

  const ensureAbsoluteUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${import.meta.env.VITE_API_URL}${url}`;
  };

  // --- Fungsi Handlers Terkoneksi ---
  const handleOpenTab = () => {
    const targetUrl = (templateData.previewUrl && templateData.previewUrl !== "") 
      ? ensureAbsoluteUrl(templateData.previewUrl) 
      : displayUrl;

    if (targetUrl && targetUrl !== "") {
      const newTab = window.open(targetUrl, '_blank');
      if (newTab) {
        newTab.focus();
      } else {
        alert("Pop-up diblokir! Mohon izinkan pop-up untuk melihat preview.");
      }
    } else {
      alert("Pratinjau belum siap, mohon tunggu sebentar.");
    }
  };

  const handleShare = async () => {
    const publicUrl = (templateData.previewUrl && templateData.previewUrl !== "")
      ? ensureAbsoluteUrl(templateData.previewUrl)
      : `${window.location.origin}/tema?id=${templateData.id}`;

    const shareData = {
      title: `Undangan: ${templateData.name || templateData.title || 'Mikro Undangan'}`,
      text: 'Lihat desain undangan digital cantik ini!',
      url: publicUrl,
    };

    try {
      if (navigator.share && window.isSecureContext) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(publicUrl);
        alert('Link pratinjau berhasil disalin ke clipboard!');
      }
    } catch (err) {
      if (err.name !== 'AbortError') console.error('Error sharing:', err);
    }
  };

  const handleSelectTemplate = () => {
    navigate('/login', { state: { selectedTemplateId: templateData.id } });
  };

  useEffect(() => {
    let blobUrlToClean = null;
    async function ensureFullTemplateAndBuild() {
      if (!open || !templateData) return;
      setLoading(true);
      setError(null);
      setDisplayUrl(""); // Reset url lama

      try {
        const hasPreview = 
          (typeof templateData.previewUrl === 'string' && templateData.previewUrl) || 
          (typeof templateData.html === 'string' && templateData.html) || 
          (templateData.pages && Array.isArray(templateData.pages));

        let src = templateData;
        if (!hasPreview && templateData.id) {
          const fetched = await getById(templateData.id);
          if (fetched) src = fetched;
        }

        let finalUrl = '';
        if (src.previewUrl) {
          finalUrl = ensureAbsoluteUrl(src.previewUrl);
        } else if (src.fileUrl) {
          const fileUrlAbs = ensureAbsoluteUrl(src.fileUrl);
          const resp = await fetch(fileUrlAbs);
          if (resp.ok) {
            const text = await resp.text();
            try {
              const parsed = JSON.parse(text);
              const pages = parsed.pages || (parsed.template_data && parsed.template_data.pages);
              if (pages) {
                const htmlContent = buildHTML(pages);
                const blob = new Blob([htmlContent], { type: 'text/html' });
                finalUrl = URL.createObjectURL(blob);
                blobUrlToClean = finalUrl;
              }
            } catch {
              if (/<html/i.test(text)) {
                const blob = new Blob([text], { type: 'text/html' });
                finalUrl = URL.createObjectURL(blob);
                blobUrlToClean = finalUrl;
              } else {
                finalUrl = fileUrlAbs;
              }
            }
          } else {
            finalUrl = fileUrlAbs;
          }
        } else if (src.html) {
          const blob = new Blob([src.html], { type: 'text/html' });
          finalUrl = URL.createObjectURL(blob);
          blobUrlToClean = finalUrl;
        } else if (src.pages) {
          const htmlContent = buildHTML(src.pages);
          const blob = new Blob([htmlContent], { type: 'text/html' });
          finalUrl = URL.createObjectURL(blob);
          blobUrlToClean = finalUrl;
        }
        setDisplayUrl(finalUrl || "");
      } catch (err) {
        console.error("Preview Error:", err);
        setError("Gagal memuat pratinjau template.");
      } finally {
        setLoading(false); 
      }
    }
    ensureFullTemplateAndBuild();
    return () => { if (blobUrlToClean) URL.revokeObjectURL(blobUrlToClean); };
  }, [open, templateData, getById, retryKey]);

  const handleRetry = useCallback(() => {
    setError(null);
    setDisplayUrl("");
    setRetryKey((k) => k + 1);
  }, []);

  if (!open || !templateData) return null;
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d

  return (
    <Modal
      open={open}
      onClose={onClose}
<<<<<<< HEAD
      title={`Preview: ${templateData.name || templateData.title}`} // Menangani nama dari invitation atau template
      size="6xl"
    >
      <div className="w-full h-[80vh] relative">
        {loading && <FullScreenSpinner />}

        {error ? (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <div className="text-red-600">{error}</div>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={handleRetry}
            >
              Coba lagi
            </button>
          </div>
        ) : (
          <Previewer url={displayUrl} />
        )}
=======
      title={`Preview: ${templateData.name || templateData.title || 'Template'}`}
      size="6xl"
    >
      <div className="flex flex-col lg:flex-row w-full h-[80vh] relative overflow-hidden bg-gray-50">
        
        {/* Sisi Kiri: Previewer */}
        <div className="flex-grow h-full border-r bg-white relative">
          {loading && <FullScreenSpinner />}
          {error ? (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <div className="text-red-600">{error}</div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleRetry}>
                Coba lagi
              </button>
            </div>
          ) : displayUrl ? (
            <Previewer url={displayUrl} />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400 italic">
              Sedang menyiapkan pratinjau...
            </div>
          )}
        </div>

        {/* Sisi Kanan: Panel Aksi */}
        <div className="w-full lg:w-80 p-6 flex flex-col gap-6 bg-white shrink-0 z-10">
          <div>
            <h3 className="font-bold text-lg text-slate-800">Statistik Template</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <div className="flex justify-between"><span>Rating:</span><span className="font-medium text-orange-500">★ 4.9</span></div>
              <div className="flex justify-between"><span>Views:</span><span className="font-medium">1,243</span></div>
              <div className="flex justify-between"><span>Harga:</span><span className="font-medium text-green-600">Gratis</span></div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={handleSelectTemplate}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200"
            >
              <CheckCircle size={18} /> Pilih Template Ini
            </button>

            <button 
              onClick={handleShare}
              className="w-full py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
            >
              <Share2 size={18} /> Bagikan Template
            </button>

            <button 
              onClick={handleOpenTab}
              className="w-full py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
            >
              <ExternalLink size={18} /> Buka di Tab Baru
            </button>
          </div>

          <div className="mt-auto p-4 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider">Fitur Template</h4>
            <ul className="mt-2 text-xs text-blue-800 space-y-1">
              <li>• Responsive di semua device</li>
              <li>• Mudah dikustomisasi</li>
              <li>• Loading cepat</li>
            </ul>
          </div>
        </div>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
      </div>
    </Modal>
  );
};

export default PreviewTemplateModal;