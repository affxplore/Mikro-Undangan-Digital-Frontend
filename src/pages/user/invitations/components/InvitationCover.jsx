import React from 'react';
import { motion } from 'framer-motion';
import { MailOpen } from 'lucide-react';
import { COVER_REGISTRY } from '../../../../utils/CoverBuilder';

const coverVariants = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
  exit: { y: '-100%', opacity: 0, transition: { duration: 1.5, ease: 'easeInOut' } }
};

export default function InvitationCover({ coverData, guestName, onOpen }) {
  if (!coverData) {
    return null;
  }

  const backgroundImage =
    coverData.data?.backgroundImage ||
    (coverData.card?.bgType === 'image' ? coverData.card.bgImage : null);

  return (
    <motion.div
      key="cover"
      variants={coverVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 bg-gray-800/10 z-50 flex items-center justify-center p-4 text-center text-white"
      style={{
        backgroundImage: `url(${backgroundImage || '/default-bg.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative z-10 w-full h-full">
        <COVER_REGISTRY.render
          type={coverData.type}
          data={coverData.data}
          guestName={guestName}
        />
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.8 } }}
          onClick={onOpen}
          className="inline-flex items-center gap-2 bg-white text-gray-800 font-semibold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform"
        >
          <MailOpen size={18} />
          Buka Undangan
        </motion.button>
      </div>
    </motion.div>
  );
}
