import React from 'react';
import {
  FaQrcode,
  FaPlay,
  FaPause,
  FaTimes,
  FaAngleDoubleDown,
} from 'react-icons/fa';

const ActionButton = ({ onClick, children, title }) => (
  <button
    onClick={onClick}
    title={title}
    className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    {children}
  </button>
);

const PreviewActions = ({
  onShare,
  onQr,
  onPlayMusic,
  onAutoScroll,
  isMusicPlaying,
  isScrolling,
}) => {
  return (
    <div
      className="fixed bottom-[25vh] right-4 z-50 flex flex-col gap-3"
      style={{ transform: 'translateY(50%)' }} // Menyesuaikan posisi vertikal agar lebih pas
    >
      <ActionButton onClick={onQr} title="Tampilkan Kode QR">
        <FaQrcode size={20} />
      </ActionButton>
      <ActionButton onClick={onPlayMusic} title={isMusicPlaying ? 'Jeda Musik' : 'Putar Musik'}>
        {isMusicPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
      </ActionButton>
      <ActionButton onClick={onAutoScroll} title={isScrolling ? 'Hentikan Scroll' : 'Auto Scroll'}>
        {isScrolling ? <FaTimes size={20} /> : <FaAngleDoubleDown size={20} />}
      </ActionButton>
    </div>
  );
};

export default PreviewActions;
