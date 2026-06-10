import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import useProjects from "../../../../api/projects/useProjects";
import { ALL_REGISTRY, CANVAS } from "../../../../utils/InvitationBuilder";
 import { FaDesktop, FaMobileAlt, FaTimes, FaQrcode, FaPlay, FaPause, FaArrowDown, FaArrowLeft } from "react-icons/fa";
import BottomNav from "./components/BottomNav";
import PreviewActions from "./components/PreviewActions.jsx";
import QRCode from "react-qr-code";

const extractBrandingPreference = (flag) => {
  if (flag === undefined || flag === null) return undefined;
  if (typeof flag === "string") {
    const normalized = flag.toLowerCase();
    if (normalized === "true" || normalized === "1") return true;
    if (normalized === "false" || normalized === "0") return false;
  }
  return Boolean(flag);
};

// Komponen untuk merender satu kartu/halaman undangan
export const PreviewCard = ({ page, guestName, showBranding = false }) => {
  const card = page.card || {};
  const elements = page.elements || [];

  const renderedElements = elements.map((el) => {
    if (el.type === "invitation" && guestName) {
      const modifiedEl = JSON.parse(JSON.stringify(el));
      modifiedEl.data.toName = guestName;
      return modifiedEl;
    }
    return el;
  });

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

      {showBranding && (
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-20"
          style={{
            backgroundImage: `url('/logo.png')`,
            backgroundRepeat: "space", // backgroundRepeat : 'repeat' | 'no-repeat' | 'space' | 'round'
            backgroundSize: "350px", // <-- Atur ukuran watermark di sini
            transform: "rotate(-10deg)", // <-- Atur kemiringan di sini
          }}
        ></div>
      )}
      {/* --- AKHIR LOGIKA WATERMARK BARU --- */}
    </div>
  );
};

// Komponen Halaman Preview Utama
export default function PreviewPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getById: getProject, loading, error } = useProjects();
  const [projectData, setProjectData] = useState(null);
  const [viewMode, setViewMode] = useState("desktop"); // 'desktop' atau 'mobile'

  // State dan Ref untuk FAB
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const audioRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      // Coba ambil data dari sessionStorage terlebih dahulu
      const liveDataString = sessionStorage.getItem("live_preview_data");

      if (liveDataString) {
        try {
          const liveData = JSON.parse(liveDataString);
          setProjectData(liveData);
          // Hapus data dari session storage setelah digunakan
          sessionStorage.removeItem("live_preview_data");
          return; // Hentikan eksekusi lebih lanjut
        } catch (err) {
          console.error("Gagal parsing data preview dari sessionStorage:", err);
          // Jika gagal, lanjutkan untuk fetch dari API
        }
      }

      // Fallback: Jika tidak ada data di sessionStorage, fetch dari API
      if (projectId) {
        try {
          const project = await getProject(projectId);
          setProjectData(project.project_data);
        } catch (err) {
          console.error("Gagal memuat data project untuk preview:", err);
        }
      }
    };
    loadData();
  }, [projectId, getProject]);

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

  // --- Handler untuk FAB ---
  const handlePlayMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current
          .play()
          .catch((err) => console.error("Audio play failed:", err));
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
        // Hentikan jika sudah di paling bawah
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
          clearInterval(scrollIntervalRef.current);
          setIsScrolling(false);
        }
      }, 15);
      setIsScrolling(true);
    }
  };

  if (loading)
    return <div className="text-center py-20">Loading Preview...</div>;
  if (error)
    return (
      <div className="text-center py-20 text-red-500">
        Error: {error.message}
      </div>
    );
  if (loading || !projectData) return <div>Loading...</div>;
  if (error) return <div>Error loading project.</div>;

  // --- DEBUGGING LOGS AND MORE ROBUST musicData DEFINITION ---
  console.log("PreviewPage: projectData is defined.", projectData);

  const pages = Array.isArray(projectData?.pages) ? projectData.pages : [];

  console.log("PreviewPage: projectData.pages is", pages);
  const musicData = pages.length > 0 ? pages[0].music : undefined;

  // Logika untuk menentukan apakah branding/watermark harus ditampilkan.
  // Defaultnya adalah 'true' untuk halaman preview ini.
  const brandingPreference =
    extractBrandingPreference(projectData?.invitation?.with_branding) ??
    extractBrandingPreference(projectData?.invitation?.withBranding) ??
    extractBrandingPreference(projectData?.invitation?.showBranding) ??
    extractBrandingPreference(projectData?.with_branding) ??
    extractBrandingPreference(projectData?.showBranding);

  // Logika yang diperbaiki: Default ke 'false' jika tidak ada preferensi eksplisit.
  // Watermark hanya muncul jika backend secara eksplisit mengirim 'true'.
  const showBranding = brandingPreference === true;

  console.log("Branding preference:", brandingPreference, "-> showBranding:", showBranding);
  // --- END DEBUGGING LOGS ---

  return (
    <div className="bg-gray-200 min-h-screen">
      {/* Audio Player */}
      {musicData?.src && (
        <audio ref={audioRef} src={musicData.src} loop={musicData.loop} />
      )}

      {/* Top Bar untuk Toggle Device */}
      <div className="sticky top-0 z-50 bg-white shadow-md p-2 flex items-center justify-between">
        <button
          onClick={() =>
            setViewMode(viewMode === "desktop" ? "mobile" : "desktop")
          }
          className="p-2 rounded-md hover:bg-gray-100 flex items-center gap-2 text-sm"
        >
          {viewMode === "desktop" ? <FaMobileAlt /> : <FaDesktop />}
          <span>Switch to {viewMode === "desktop" ? "Mobile" : "Desktop"}</span>
        </button>

        {/* Tombol Tutup Pratinjau */}
        <button
          onClick={() => navigate(`/invitations/edit/${projectId}`)}
          className="p-2 rounded-md hover:bg-gray-100 flex items-center gap-2 text-sm text-gray-600"
        >
          <FaArrowLeft />
          <span>Tutup Pratinjau</span>
        </button>
      </div>

      {/* Kontainer Undangan */}
      <div
        className={`transition-all duration-300 py-8 ${
          viewMode === "mobile" ? "w-[412px] mx-auto" : "w-full"
        }`}
      >
        <div className="flex flex-col items-center gap-8">
          {pages.map((page, index) => (
            <div id={`page-${index}`} key={page.id || index}>
              <PreviewCard
                page={page}
                showBranding={showBranding}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNav pages={pages} onNavigate={scrollToPage} />

      {/* Floating Action Buttons */}
      <PreviewActions
        onQr={() => setShowQrModal(true)}
        onPlayMusic={handlePlayMusic}
        onAutoScroll={handleAutoScroll}
        isMusicPlaying={isMusicPlaying}
        isScrolling={isScrolling}
      />

      {/* QR Code Modal */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="bg-white p-8 rounded-lg shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-center text-xl font-bold mb-4">
              Pindai untuk Membuka Undangan
            </h3>
            <QRCode value={window.location.href} size={256} />
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
