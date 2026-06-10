import React, { useState, useEffect, useRef } from "react";
import { FaDesktop, FaMobileAlt, FaTimes } from "react-icons/fa";
import AdminBottomNav from "./components/AdminBottomNav";
import AdminPreviewActions from "./components/AdminPreviewActions";
import { ALL_REGISTRY, CANVAS } from "../../../../utils/InvitationBuilder";

// Komponen untuk merender satu kartu/halaman undangan
export const AdminPreviewCard = ({ page }) => {
  const card = page.card || {};
  const elements = page.elements || [];

  // Fungsi untuk render background (disederhanakan dari EditorCanvas)
  const renderBg = () => {
    if (card.bgType === "image" && card.bgImage) {
      return (
        <img
          src={card.bgImage}
          alt="bg"
          className="absolute inset-0 h-full w-full object-cover"
        />
      );
    }
    if (card.bgType === "gradient") {
      return (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(180deg, ${card.gradient.from}, ${card.gradient.to})`,
          }}
        />
      );
    }
    return (
      <div
        className="absolute inset-0"
        style={{ backgroundColor: card.color }}
      />
    );
  };

  return (
    <div
      className="relative select-none overflow-hidden border bg-white shadow-xl mx-auto"
      style={{
        width: CANVAS.width,
        height: CANVAS.height,
        borderRadius: card.radius,
      }}
    >
      {renderBg()}
      <div className="absolute inset-0" style={{ padding: card.padding }}>
        <div className="relative h-full w-full">
          {elements.map((el) => {
            const Component = ALL_REGISTRY[el.type]?.Render;
            if (!Component) return null;
            return (
              <div
                key={el.id}
                className="absolute"
                style={{
                  left: el.x,
                  top: el.y,
                  width: el.w,
                  height: el.h,
                }}
              >
                <Component el={el} />
              </div>
            );
          })}
        </div>
      </div>


    </div>
  );
};

// Komponen Halaman Preview Admin Utama
export default function AdminPreviewPage({ templateData, onClose }) {
  const [viewMode, setViewMode] = useState("desktop");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const audioRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  // Cleanup interval saat komponen unmount
  useEffect(() => {
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, []);

  const scrollToPage = (index) => {
    const pageElement = document.getElementById(`page-${index}`);
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePlayMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => console.error("Audio play failed:", err));
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  const handleAutoScroll = () => {
    if (isScrolling) {
      clearInterval(scrollIntervalRef.current);
      setIsScrolling(false);
    } else {
      scrollIntervalRef.current = setInterval(() => {
        window.scrollBy(0, 1);
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
          clearInterval(scrollIntervalRef.current);
          setIsScrolling(false);
        }
      }, 15);
      setIsScrolling(true);
    }
  };

  const musicData = templateData.pages && templateData.pages.length > 0
    ? templateData.pages[0].music
    : undefined;

  return (
    <div className="fixed inset-0 z-[100] bg-gray-100 overflow-auto">
      {/* Audio Player */}
      {musicData?.src && (
        <audio ref={audioRef} src={musicData.src} loop={musicData.loop} />
      )}

      {/* Top Bar untuk Toggle Device */}
      <div className="sticky top-0 z-50 bg-white shadow-md p-2 flex items-center justify-between">
        <button
          onClick={() => setViewMode(viewMode === "desktop" ? "mobile" : "desktop")}
          className="p-2 rounded-md hover:bg-gray-100 flex items-center gap-2 text-sm"
        >
          {viewMode === "desktop" ? <FaMobileAlt /> : <FaDesktop />}
          <span>Switch to {viewMode === "desktop" ? "Mobile" : "Desktop"}</span>
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 shadow-lg flex items-center gap-2 transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5"
          title="Tutup Preview"
        >
          <FaTimes className="text-sm" />
          <span className="font-medium">Close</span>
        </button>
      </div>

      {/* Kontainer Template */}
      <div className={`transition-all duration-300 py-8 ${
        viewMode === "mobile" ? "w-[412px] mx-auto" : "w-full"
      }`}>
        <div className="flex flex-col items-center gap-8">
          {templateData.pages.map((page, index) => (
            <div id={`page-${index}`} key={page.id || index}>
              <AdminPreviewCard page={page} />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <AdminBottomNav pages={templateData.pages} onNavigate={scrollToPage} />

      {/* Floating Action Buttons */}
      <AdminPreviewActions
        onPlayMusic={handlePlayMusic}
        onAutoScroll={handleAutoScroll}
        isMusicPlaying={isMusicPlaying}
        isScrolling={isScrolling}
      />

    </div>
  );
}