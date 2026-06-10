
import React from 'react';
import { FaShareAlt, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../api/auth/useAuth';
import useInvitations from '../../../../../api/invitations/useInvitations';

const Button = ({ children, className = '', type = 'button', ...props }) => (
  <button type={type} {...props} className={`rounded border px-2.5 py-1.5 text-sm ${className}`}>
    {children}
  </button>
);

const EditorTopbar = ({
  editor,
  onSave,
  onPreview,
  onToggleUi,
  onExportPNG,
  onExportPDF,
  onExportPDFAll,
  onExportHTML,
  onExportHTMLAll,
  onExportJSON,
  onImportJSON,
  isUiHidden,
  isSavingAuto,
  onShare,
  onClose,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { update: updateInvitation, getList: getInvitationList, activate: activateInvitation } = useInvitations();
  const [exportOpen, setExportOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const isCover = editor.activeView === 'cover';
  const pages = editor.projectData?.pages ?? [];

  // Component untuk konfirmasi upgrade
  const UpgradeConfirmation = ({ closeToast }) => (
    <div>
      <p className="font-semibold mb-2">Limit undangan aktif telah tercapai.</p>
      <p className="mb-4 text-sm">Apakah Anda ingin upgrade sekarang?</p>
      <div className="flex gap-2 justify-end mt-2">
        <button
          onClick={() => {
            const closer = typeof closeToast === 'function' ? closeToast : () => toast.dismiss();
            navigate('/dashboard/subscription');
            closer();
          }}
          className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Upgrade
        </button>
        <button
          onClick={() => {
            const closer = typeof closeToast === 'function' ? closeToast : () => toast.dismiss();
            closer();
          }}
          className="px-4 py-1.5 bg-slate-200 text-slate-800 rounded-md text-sm font-medium hover:bg-slate-300 transition-colors"
        >
          Batal
        </button>
      </div>
    </div>
  );

  // Function untuk mengecek dan mengaktifkan undangan
  const handleShare = async () => {
    try {
      // editor.projectId is a project id; invitations are separate records linked by project_id
      const projectId = editor.projectId;
      if (!projectId) {
        toast.error('Project ID tidak ditemukan. Simpan project terlebih dahulu.');
        return;
      }

      // Cari invitation yang terkait dengan project ini
      let foundInvitation = null;
      try {
        const res = await getInvitationList({ page: 1, limit: 1, filter: JSON.stringify({ project_id: projectId }) });
        const list = res?.data || [];
        foundInvitation = list[0] || null;
      } catch (err) {
        console.error('Gagal mencari undangan untuk project:', err);
      }

      if (!foundInvitation) {
        toast.info('Undangan belum dibuat untuk project ini. Silakan buat atau simpan sebagai undangan terlebih dahulu.');
        return;
      }

      if (foundInvitation.status === 'aktif') {
        onShare?.();
        return;
      }

      // Tampilkan toast confirmation dengan tombol Aktifkan / Batal
      toast(
        ({ closeToast }) => (
          <div className="p-2">
            <p className="font-semibold">Undangan belum aktif</p>
            <p className="text-sm text-slate-600 mt-1">Apakah Anda ingin mengaktifkan undangan sekarang?</p>
            <div className="flex justify-end gap-3 mt-3">
              <button
                onClick={() => closeToast()}
                className="px-3 py-1.5 bg-slate-200 rounded text-sm"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  // Cek limit invitation user
                  const hasReachedLimit = checkInvitationLimit();
                  if (hasReachedLimit) {
                    // Tutup konfirmasi saat ini agar tidak menumpuk
                    closeToast();
                    toast.info(<UpgradeConfirmation />, {
                      position: 'top-center',
                      autoClose: false,
                      closeOnClick: false,
                      draggable: false,
                      icon: '🚀',
                    });
                    return;
                  }

                  try {
                    // Gunakan activate API jika tersedia (mengirim invitation id)
                    if (typeof activateInvitation === 'function') {
                      await activateInvitation(foundInvitation.id);
                    } else {
                      await updateInvitation(foundInvitation.id, { status: 'aktif' });
                    }
                    toast.success('Undangan berhasil diaktifkan!');
                    await editor.refresh?.();
                    onShare?.();
                  } catch (err) {
                    console.error('Error activating invitation:', err);
                    toast.error('Gagal mengaktifkan undangan');
                  } finally {
                    closeToast();
                  }
                }}
                className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm"
              >
                Aktifkan
              </button>
            </div>
          </div>
        ),
        {
          position: 'top-center',
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          style: { width: 360 },
        }
      );
    } catch (error) {
      console.error('Error activating invitation:', error);
      toast.error('Gagal mengaktifkan undangan');
    }
  };

  // Function untuk mengecek limit invitation
  const checkInvitationLimit = () => {
    const subscription = user?.subscription;
    const activeInvitations = user?.activeInvitationsCount || 0;

    if (!subscription) return true;

    switch (subscription.slug) {
      case 'free':
        return activeInvitations >= 1; // Free max 1 aktif
      case 'basic':
        return activeInvitations >= 5; // Basic max 5 aktif
      case 'pro':
        return activeInvitations >= 20; // Pro max 20 aktif
      case 'business':
        return false; // Business unlimited
      default:
        return true;
    }
  };

  async function handleSaveAndMenu() {
    try {
      setSaving(true);
      const res = onSave?.();
      if (res && typeof res.then === 'function') {
        await res;
      }
      setExportOpen(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
        {isUiHidden ? (
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              
              <div className="h-6 w-6 rounded bg-indigo-600" />
              <div className="font-semibold">Invitation Studio</div>
            </div>
            <Button onClick={onToggleUi} className="border-gray-300 bg-white hover:border-indigo-400">
              Show UI
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-indigo-600" />
              <div className="font-semibold">Invitation Studio</div>
              {isSavingAuto ? (
                <span className="ml-2 rounded bg-yellow-50 px-2 py-0.5 text-xs text-yellow-700">Saving...</span>
              ) : (
                <span className="ml-2 rounded bg-green-50 px-2 py-0.5 text-xs text-green-700">Saved</span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={() => editor.setActiveView('cover')}
                className={isCover ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-300 bg-white hover:border-indigo-400'}
              >
                Cover
              </Button>
              {pages.map((p, i) => (
                <Button
                  key={p.id}
                  onClick={() => editor.setActiveView(i)}
                  className={editor.activeView === i ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-300 bg-white hover:border-indigo-400'}
                >
                  {p.name || (i === 0 ? 'Main' : `H${i + 1}`)}
                </Button>
              ))}
              <Button
                onClick={editor.addPage}
                disabled={isCover}
                className={`border-gray-300 bg-white hover:border-indigo-400 ${isCover ? 'cursor-not-allowed opacity-50 hover:border-gray-300' : ''}`}
              >
                + Halaman
              </Button>
              <Button
                onClick={editor.duplicatePage}
                disabled={isCover || pages.length === 0}
                className={`border-gray-300 bg-white hover:border-indigo-400 ${isCover || pages.length === 0 ? 'cursor-not-allowed opacity-50 hover:border-gray-300' : ''}`}
              >
                Duplikat
              </Button>
              <Button
                onClick={editor.deletePage}
                disabled={isCover || pages.length <= 1}
                className={`border-red-200 bg-red-50 text-red-700 hover:bg-red-100 ${isCover || pages.length <= 1 ? 'cursor-not-allowed opacity-50 hover:bg-red-50' : ''}`}
              >
                Hapus
              </Button>
            </div>

            <div className="relative flex flex-wrap items-center gap-2">
              <Button onClick={onPreview} className="border-gray-300 bg-white hover:border-indigo-400">Preview</Button>
              <Button onClick={handleSaveAndMenu} className="flex items-center gap-1 bg-blue-600 text-white hover:bg-blue-700">
                <FaSave />
                {saving ? 'Menyimpan...' : 'Save As'}
              </Button>
              <Button onClick={handleShare} className="flex items-center gap-1 bg-blue-600 text-white hover:bg-blue-700">
                <FaShareAlt />
                Share
              </Button>
              <Button onClick={onToggleUi} className="border-gray-300 bg-white hover:border-indigo-400">Hide UI</Button>
              <Button onClick={onClose} className="border-gray-300 bg-white hover:border-indigo-400">Tutup</Button>

              {exportOpen && (
                <div className="absolute right-0 top-full mt-2 z-50 rounded-lg border bg-white p-2 shadow-lg">
                  <div className="grid grid-cols-2 gap-2">
                    {onExportPNG && (
                      <Button onClick={onExportPNG} className="bg-indigo-600 text-white hover:bg-indigo-700">PNG</Button>
                    )}
                    {onExportPDF && (
                      <Button onClick={onExportPDF} className="bg-indigo-600 text-white hover:bg-indigo-700">PDF</Button>
                    )}
                    {onExportPDFAll && (
                      <Button onClick={onExportPDFAll} className="bg-indigo-600 text-white hover:bg-indigo-700">PDF (Semua)</Button>
                    )}
                    {onExportHTML && (
                      <Button onClick={onExportHTML} className="bg-indigo-600 text-white hover:bg-indigo-700">HTML</Button>
                    )}
                    {onExportHTMLAll && (
                      <Button onClick={onExportHTMLAll} className="bg-indigo-600 text-white hover:bg-indigo-700">HTML (Semua)</Button>
                    )}
                    {onExportJSON && (
                      <Button onClick={onExportJSON} className="border-gray-300 bg-white hover:border-indigo-400">Export JSON</Button>
                    )}
                    {onImportJSON && (
                      <label className="cursor-pointer rounded border border-gray-300 px-2.5 py-1.5 text-sm hover:border-indigo-400">
                        Import JSON
                        <input type="file" accept="application/json" className="hidden" onChange={(e) => { onImportJSON?.(e); setExportOpen(false); }} />
                      </label>
                    )}
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Button onClick={() => setExportOpen(false)} className="border-gray-300 bg-white hover:border-indigo-400">Tutup</Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditorTopbar;

