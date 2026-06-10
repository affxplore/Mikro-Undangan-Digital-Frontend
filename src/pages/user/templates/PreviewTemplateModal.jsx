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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);
  const { getById } = useTemplates();

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

  return (
    <Modal
      open={open}
      onClose={onClose}
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
      </div>
    </Modal>
  );
};

export default PreviewTemplateModal;