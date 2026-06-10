import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import useInvitations from '../../../api/invitations/useInvitations';
import useReceiveInvs from '../../../api/receive-inv/useReceiveInvs';
import { PreviewCard } from './preview/PreviewPage';
import RsvpForm from './components/RsvpForm';
import InvitationCover from './components/InvitationCover';

export default function SharePreview() {
  const { invitationId } = useParams();
  const location = useLocation();
  
  const guestCode = new URLSearchParams(location.search).get('guest_code');
  const guestNameFromUrl = new URLSearchParams(location.search).get('to');

  const { getPublicById, loading, error } = useInvitations();
  const { getGuestByCode, accept: acceptInvitation } = useReceiveInvs();

  const [invitationData, setInvitationData] = useState(null);
  const [guestName, setGuestName] = useState(guestNameFromUrl || 'Tamu Undangan');
  const [isCoverOpen, setIsCoverOpen] = useState(false);

  useEffect(() => {
    if (!isCoverOpen) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
    return undefined;
  }, [isCoverOpen]);

  useEffect(() => {
    if (invitationId) {
      getPublicById(invitationId)
        .then(data => setInvitationData(data))
        .catch(err => console.error("Gagal memuat undangan publik:", err));
    }
  }, [invitationId, getPublicById]);

  useEffect(() => {
    if (guestCode) {
      getGuestByCode(guestCode).then(guest => {
        if (guest && guest.recipient) {
          setGuestName(guest.recipient);
        }
      });
    }
  }, [guestCode, getGuestByCode]);

  const handleOpenInvitation = () => {
    // Hanya panggil 'acceptInvitation' JIKA ada guestCode
    if (guestCode) {
      acceptInvitation(guestCode).catch(err => {
        console.error("Gagal mengirim status 'accepted':", err); // Handle error jika perlu
      });
    }
    setIsCoverOpen(true);
  };

  if (loading || !invitationData) return <div>Memuat...</div>;
  if (error) return <div>Undangan tidak ditemukan.</div>;

  const projectData = invitationData.project?.data;
  // Pengecekan baru yang lebih spesifik
  if (!projectData?.cover || !projectData?.pages) {
    return <div className="text-red-500">Data desain undangan tidak lengkap (cover/pages hilang).</div>;
  }
  
  return (
    <>
      {/* Bagian ini HANYA menerima dan mengurus data "cover" */}
      <AnimatePresence>
        {!isCoverOpen && (
          <InvitationCover 
            coverData={projectData.cover}
            guestName={guestName} 
            onOpen={handleOpenInvitation} 
          />
        )}
      </AnimatePresence>
      
      {/* Bagian ini HANYA menerima dan mengurus data "pages" */}
      <div className="main-content bg-gray-200">
        <div className="flex flex-col items-center gap-8 py-8">
          {projectData.pages.map((page) => (
            <div id={`page-${page.id}`} key={page.id}>
              <PreviewCard 
                page={page}
                showBranding={invitationData.showBranding}
              />
            </div>
          ))}
          <div className="w-full max-w-[900px] p-4">
            <RsvpForm invitationId={invitationId} guestCode={guestCode} />
          </div>
        </div>
      </div>
    </>
  );
}