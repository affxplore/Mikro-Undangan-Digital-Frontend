import React from 'react';
import {
  FaPlay,
  FaPause,
  FaArrowDown,
  FaTimes,
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

const AdminPreviewActions = ({
  onPlayMusic,
  onAutoScroll,
  isMusicPlaying,
  isScrolling,
}) => {
  return (
    <div
      className="fixed bottom-[25vh] right-4 z-50 flex flex-col gap-3"
      style={{ transform: 'translateY(50%)' }}
    >
      <ActionButton onClick={onPlayMusic} title={isMusicPlaying ? 'Jeda Musik' : 'Putar Musik'}>
        {isMusicPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
      </ActionButton>
      <ActionButton onClick={onAutoScroll} title={isScrolling ? 'Hentikan Scroll' : 'Auto Scroll'}>
        {isScrolling ? <FaTimes size={20} /> : <FaArrowDown size={20} />}
      </ActionButton>
    </div>
  );
};

export default AdminPreviewActions;