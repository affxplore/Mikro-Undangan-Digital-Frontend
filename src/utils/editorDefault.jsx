// src/utils/editorDefaults.js

// Fungsi helper kecil untuk membuat ID unik
function uid(prefix = "page") {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

// Default card settings
const DEFAULT_CARD = {
  bgType: "gradient",
  gradient: { from: "#eef2ff", to: "#ffffff" },
  color: "#ffffff",
  bgImage: null,
  pattern: "none",
  radius: 28,
  padding: 32,
  // Properti baru untuk pola dots
  dotColor: "rgba(0,0,0,0.06)",
  dotSize: 1,
  dotSpacing: 12,
};

// Default music settings
const DEFAULT_MUSIC = {
  src: null,
  autoplay: false,
  loop: true,
  volume: 0.4,
};

// Default cover data
const DEFAULT_COVER = {
  title: "The Wedding Of",
  coupleNames: "Pria & Wanita",
  guestName: "Kepada Yth.",
  card: { ...DEFAULT_CARD },
  music: { ...DEFAULT_MUSIC },
  elements: [],
};

// Definisikan dan ekspor struktur data awal
export const INITIAL_PROJECT_DATA = {
  cover: DEFAULT_COVER,
  pages: [
    {
      id: uid("page"),
      name: "Halaman 1",
      card: { ...DEFAULT_CARD },
      music: { ...DEFAULT_MUSIC },
      elements: [],
    },
  ],
};