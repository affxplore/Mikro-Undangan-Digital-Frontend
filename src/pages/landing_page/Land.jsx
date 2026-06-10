import React, { useMemo, useRef, useState, useEffect } from "react";
<<<<<<< HEAD
=======
import { Link, useNavigate } from 'react-router-dom';
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
import { Swiper, SwiperSlide } from "swiper/react";
import inv1 from "../../assets/img/blue.jpg";
import inv2 from "../../assets/img/birthday.jpg";
import inv3 from "../../assets/img/chrismas.jpg";
import add1 from "../../../public/pict/gambar3.webp";
import add2 from "../../../public/pict/gambar1.webp";
import add3 from "../../../public/pict/gambar4.webp";
import add4 from "../../../public/pict/gambar6.jpg";
import add5 from "../../../public/pict/gambar2.avif";
import add6 from "../../../public/pict/gambar8.webp";
import add7 from "../../../public/pict/gambar5.jpg";
import add8 from "../../../public/pict/gambar7.webp";
import LandingNav from "../../components/LandingNavbar";
<<<<<<< HEAD
=======

>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
import {
  Mousewheel,
  Pagination,
  Keyboard,
  Autoplay,
  Parallax,
  EffectFade,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import {
  ChevronDown,
  ArrowUpRight,
  ShieldCheck,
  Wand2,
  Palette,
  Sparkles,
} from "lucide-react";

// ————————————————————————————————————————————
// Theme Tokens (Updated Colors)
// ————————————————————————————————————————————
const C = {
  ivory: "#F3F3E0",  // Off White
  deep: "#1D3557",    // Dark Blue
  steel: "#457B9D",   // Medium Blue
  pale: "#A8DADC",    // Light Blue
  deep90: "#0F2F69",  // Darker Blue
};

// ————————————————————————————————————————————
// Animations
// ————————————————————————————————————————————
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// ————————————————————————————————————————————
// Helpers
// ————————————————————————————————————————————
const Pill = ({ children, className = "" }) => (
  <span
    className={clsx(
      "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs border border-white/30 bg-white/10",
      className
    )}
  >
    {children}
  </span>
);

const Section = ({ children, className = "", id }) => (
  <section
    id={id}
    className={clsx(
<<<<<<< HEAD
      "relative flex h-screen w-full items-center justify-center overflow-hidden px-6",
=======
      "relative flex min-h-screen w-full justify-center overflow-hidden px-6 pt-24 pb-12",
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
      className
    )}
  >
    <div className="absolute inset-0 -z-10" aria-hidden>
      <div
        className="absolute inset-0"
      />
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />
    </div>
    <div className="relative z-10 mx-auto w-full max-w-7xl">{children}</div>
  </section>
);

// Placeholder (SVG Data URI)
const makePh = (w = 900, h = 1400, label = "Placeholder") =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='${C.pale}'/>
          <stop offset='100%' stop-color='${C.steel}'/>
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#g)'/>
      <g fill='${C.deep}' opacity='0.15'>
        <circle cx='${w * 0.2}' cy='${h * 0.18}' r='${Math.min(w, h) * 0.12}'/>
        <circle cx='${w * 0.85}' cy='${h * 0.22}' r='${Math.min(w, h) * 0.08}'/>
        <circle cx='${w * 0.5}' cy='${h * 0.8}' r='${Math.min(w, h) * 0.18}'/>
      </g>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, system-ui, Arial, Helvetica, sans-serif' font-size='${Math.min(w, h) * 0.045}' fill='${C.deep}'>${label}</text>
    </svg>` 
  )}`;

// Images
const heroImgs = [inv1, inv2, inv3];
const cardImgs = [add1, add2, add3, add4, add5, add6, add7, add8]; 
Array.from({ length: 12 }, (_, i) => makePh(900, 1400, `Template ${i + 1}`));

// ————————————————————————————————————————————
// Small Components
// ————————————————————————————————————————————
const CTAButtons = () => (
  <div className="mt-6 flex flex-wrap gap-3">
    <a
      href="#template"
      className="rounded-full px-5 py-2.5 text-sm font-semibold shadow transition focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{
        backgroundColor: C.deep,
        color: C.ivory,
        boxShadow: "0 8px 20px -6px rgba(29, 53, 87, 0.45)",
      }}
    >
      Lihat Template
    </a>
<<<<<<< HEAD
    <a
      href="#register"
=======
    <Link
      to="/regis"
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
      className="rounded-full border px-5 py-2.5 text-sm transition hover:translate-y-[-1px] focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{ borderColor: `${C.deep}60`, color: C.deep, backgroundColor: `${C.pale}7a` }}
    >
      Coba Gratis
<<<<<<< HEAD
    </a>
=======
    </Link>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
  </div>
);

const Feature = ({ icon: Icon, title, desc }) => (
  <div
    className="group relative overflow-hidden rounded-2xl border p-5 transition-transform hover:translate-y-[-2px]"
    style={{ borderColor: `${C.deep}22`, backgroundColor: "#ffffffaa", backdropFilter: "blur(8px)" }}
  >
    <div className="mb-3 inline-flex rounded-xl p-2" style={{ backgroundColor: `${C.pale}`, color: C.deep }}>
      <Icon className="h-5 w-5" />
    </div>
    <div className="text-base font-semibold" style={{ color: C.deep }}>
      {title}
    </div>
    <div className="mt-1 text-sm opacity-80" style={{ color: C.deep }}>
      {desc}
    </div>
    <div
      className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 transition-all duration-300 group-hover:opacity-30"
      style={{ background: `radial-gradient(circle, ${C.steel}, transparent 60%)` }}
    />
  </div>
);

// ————————————————————————————————————————————
// Slides
// ————————————————————————————————————————————
const SlideHero = () => (
  <Section id="home">
    <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2" data-swiper-parallax="-80">
        
      {/* Left */}
      <div>
        <Pill className="bg-white/30 text-[11px] text-blue-900 font-medium">
          <Sparkles className="h-3.5 w-3.5 text-blue-900" /> Undangan Digital
        </Pill>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-4 bg-clip-text text-4xl font-extrabold leading-tight text-transparent sm:text-6xl"
          style={{ backgroundImage: `linear-gradient(180deg, ${C.deep}, ${C.deep90})` }}
        >
          Buat Undangan Tanpa Ribet
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.15 }}
          className="mt-3 max-w-xl text-base"
          style={{ color: C.deep }}
        >
          Pilih template, edit, dan kirim dalam hitungan menit. Desain elegan, cepat, dan siap produksi.
        </motion.p>

        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.3 }}>
          <CTAButtons />
        </motion.div>

        <div className="mt-6 grid max-w-md grid-cols-3 gap-3">
          <Feature icon={ShieldCheck} title="Aman" desc="Tautan privat & analitik" />
          <Feature icon={Wand2} title="Mudah" desc="Editor drag-n-drop" />
          <Feature icon={Palette} title="Cantik" desc="Tipografi premium" />
        </div>
      </div>

      {/* Right: Phone mockup with fade swiper */}
      <div className="relative mx-auto w-[45%] max-w-sm rounded-2xl border-8 border-black bg-white/50 p-1">
        <div
          className="absolute inset-0 -z-10 rounded-[2.2rem]"
          style={{ background: `linear-gradient(140deg, ${C.steel}44, ${C.pale}44)` }}
        />
        <div
          className="relative aspect-[10/20] w-full overflow-hidden rounded-md border"
          style={{ borderColor: `${C.deep}22`, background: `linear-gradient(180deg, ${C.pale}, #ffffff)` }}
        >
          <div
            className="absolute right-2 top-2 rounded-full px-2 py-1 text-[10px] font-medium"
            style={{ backgroundColor: `${C.ivory}`, color: C.deep }}
          >
            preview
          </div>
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            loop
            allowTouchMove={false}
            speed={900}
            autoplay={{ delay: 1700, disableOnInteraction: false }}
            className="h-full"
          >
            {heroImgs.map((src, i) => (
              <SwiperSlide key={i}>
                <img
                  src={src}
                  alt={`Preview ${i + 1}`}
                  className="h-full w-full select-none object-cover"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div
          className="pointer-events-none absolute -bottom-6 left-1/2 h-24 w-40 -translate-x-1/2 rounded-full opacity-50"
          style={{ background: `radial-gradient(ellipse at center, ${C.steel}66, transparent 70%)` }}
        />
      </div>
    </div>
  </Section>
);

const categories = [
  "Pernikahan",
  "Ulang Tahun",
  "Aqiqah",
  "Khitan",
  "Syukuran",
  "Meeting",
  "Seminar",
  "Grand Opening",
  "Arisan",
  "Tasyakuran",
  "Lamaran",
  "Party",
];

const SlideCategories = () => {
<<<<<<< HEAD
=======
  const navigate = useNavigate();

>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
  const categoryData = [
    { name: "Pernikahan", icon: "💍", count: "12+ Template", color: "from-rose-400 to-pink-500" },
    { name: "Ulang Tahun", icon: "🎂", count: "8+ Template", color: "from-yellow-400 to-orange-500" },
    { name: "Aqiqah", icon: "🕌", count: "6+ Template", color: "from-emerald-400 to-teal-500" },
    { name: "Natal", icon: "⭐", count: "5+ Template", color: "from-blue-400 to-indigo-500" },
    { name: "Syukuran", icon: "🤲", count: "4+ Template", color: "from-purple-400 to-violet-500" },
    { name: "Meeting", icon: "📅", count: "7+ Template", color: "from-cyan-400 to-blue-500" },
    { name: "Seminar", icon: "📚", count: "6+ Template", color: "from-slate-400 to-gray-500" },
    { name: "Grand Opening", icon: "🎊", count: "5+ Template", color: "from-red-400 to-rose-500" },
    { name: "Arisan", icon: "💰", count: "3+ Template", color: "from-green-400 to-emerald-500" },
    { name: "Tasyakuran", icon: "🙏", count: "4+ Template", color: "from-amber-400 to-yellow-500" },
    { name: "Lamaran", icon: "💎", count: "8+ Template", color: "from-pink-400 to-rose-500" },
    { name: "Party", icon: "🎉", count: "6+ Template", color: "from-fuchsia-400 to-pink-500" },
  ];

  return (
    <Section id="kategori">
      <div className="mb-12" data-swiper-parallax="-60">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-center"
        >
          <Pill className="bg-white/40 text-[11px] text-blue-900 font-medium mb-4">
            <Palette className="h-3.5 w-3.5 text-blue-900" /> Berbagai Kategori
          </Pill>
          <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: C.deep }}>
            Kategori Undangan
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center" style={{ color: `${C.deep}cc` }}>
            Pilih jenis acara, kami siapkan template yang sesuai dengan tema dan nuansa yang tepat.
          </p>
        </motion.div>
      </div>

      <motion.div 
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.2 }}
        className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4"
      >
        {categoryData.map((category, index) => (
          <motion.button
            key={category.name}
<<<<<<< HEAD
=======
            onClick={() => navigate(`/tema?category=${category.name.toLowerCase()}`)}
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.1 * index }}
            className="group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ 
              borderColor: `${C.deep}22`, 
              backgroundColor: "#ffffffd9", 
              color: C.deep,
              backdropFilter: "blur(8px)"
            }}
          >
            <div
<<<<<<< HEAD
              className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10 bg-gradient-to-br ${category.color}`}
=======
              className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10 bg-gradien-to-br ${category.color}`}
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
            />
            
            <div className="mb-3 text-2xl transition-transform duration-300 group-hover:scale-110">
              {category.icon}
            </div>
            
            <div className="relative z-10">
              <h3 className="text-sm font-semibold mb-1 group-hover:text-blue-900 transition-colors">
                {category.name}
              </h3>
              <p className="text-xs opacity-70 mb-2">
                {category.count}
              </p>
              
            
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Lihat Template
                </span>
                <ArrowUpRight className="h-4 w-4 opacity-60 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </div>

            <div 
              className="absolute -top-4 -right-4 h-16 w-16 rounded-full opacity-0 transition-all duration-500 group-hover:opacity-20"
              style={{ background: `radial-gradient(circle, ${C.steel}, transparent 60%)` }}
            />
          </motion.button>
        ))}
      </motion.div>

      {/* Stats Section */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.4 }}
        className="mt-16 text-center"
      >
        <div className="mx-auto grid max-w-2xl grid-cols-3 gap-8">
          <div>
            <div className="text-2xl font-bold" style={{ color: C.deep }}>50+</div>
            <div className="text-sm opacity-70" style={{ color: C.deep }}>Template Ready</div>
          </div>
          <div>
            <div className="text-2xl font-bold" style={{ color: C.deep }}>12</div>
            <div className="text-sm opacity-70" style={{ color: C.deep }}>Kategori Acara</div>
          </div>
          <div>
            <div className="text-2xl font-bold" style={{ color: C.deep }}>5k+</div>
            <div className="text-sm opacity-70" style={{ color: C.deep }}>Undangan Dibuat</div>
          </div>
        </div>
      </motion.div>
    </Section>
  );
};


// Dummy JSON data for template previews
const previews = [
  {
    id: 1,
    title: "Template Pernikahan Elegan",
    src: cardImgs[0],
    category: "Pernikahan",
    author: "Mikro Team",
    tags: ["elegan", "wedding", "modern"],
  },
  {
    id: 2,
    title: "Template Ulang Tahun",
    src: cardImgs[1],
    category: "Ulang Tahun",
    author: "Mikro Team",
    tags: ["birthday", "kids", "colorful"],
  },
  {
    id: 3,
    title: "Template Pernikahan Luxury",
    src: cardImgs[2],
    category: "Pernikahan",
    author: "Mikro Team",
    tags: ["pernikahan", "blue"],
  },
  {
    id: 4,
    title: "Template Natal Ceria",
    src: cardImgs[3],
    category: "Natal",
    author: "Mikro Team",
    tags: ["Natal", "ceria"],
  },
  {
    id: 5,
    title: "Template Ultah",
    src: cardImgs[4],
    category: "Ulang tahun",
    author: "Mikro Team",
    tags: ["ulang tahun", "happy"],
  },
  {
    id: 6,
    title: "Template Pernikahan Minimalist",
    src: cardImgs[5],
    category: "Gathering",
    author: "Mikro Team",
    tags: ["wedding", "minimalist"],
  },
  {
    id: 7,
    title: "Template Merry Chrismas",
    src: cardImgs[6],
    category: "Natal",
    author: "Mikro Team",
    tags: ["Natal", "chrismas"],
  },
  {
    id: 8,
    title: "Template Ulang tahun",
    src: cardImgs[7],
    category: "Grand Opening",
    author: "Mikro Team",
    tags: ["ultah", "kids"],
  },
  

];

const SlideShowcase = () => {
<<<<<<< HEAD
  const getSliceCount = () => {
    if (typeof window === 'undefined') return 8; // Default for SSR
    
    const width = window.innerWidth;
    if (width >= 1024) return 8; // lg breakpoint
    if (width >= 768) return 5;  // md breakpoint
    if (width >= 640) return 4;  // sm breakpoint
    return 2; // default (mobile)
=======
  const navigate = useNavigate(); // Tambahkan ini di awal fungsi

  const getSliceCount = () => {
    if (typeof window === 'undefined') return 8; 
    const width = window.innerWidth;
    if (width >= 1024) return 8; 
    if (width >= 768) return 5;  
    if (width >= 640) return 4;  
    return 2; 
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
  };

  const [sliceCount, setSliceCount] = React.useState(getSliceCount);

  React.useEffect(() => {
    const handleResize = () => {
      setSliceCount(getSliceCount());
    };
<<<<<<< HEAD

=======
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Section id="template">
<<<<<<< HEAD
      <div className="mb-8 text-center" data-swiper-parallax="-60">
        <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: C.deep }}>
          Pameran Template
        </h2>
        
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4">
        {previews.slice(0, sliceCount).map((p) => (
          <a
            key={p.id}
            href="#"
            className="group block  lg:w-48 overflow-hidden rounded-xl border p-2 transition hover:-translate-y-0.5"
            style={{ borderColor: `${C.deep}22`, backgroundColor: "#ffffff" }}
          >
            <img
              src={p.src}
              alt={p.title}
              className="aspect-[9/14]  rounded-lg object-cover transition duration-500 group-hover:scale-[1.04]"
            />
            <div className="mt-2 text-xs font-medium" style={{ color: C.deep }}>
              {p.title}
            </div>
          </a>
        ))}
=======
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 
            className="text-3xl font-bold sm:text-4xl"
            style={{ color: C.deep }}
          >
            Pameran Template
          </h2> 
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {previews.slice(0, sliceCount).map((p) => (
            <div
              key={p.id}
              // GANTI href="#" MENJADI navigate
              onClick={() => navigate(`/tema?category=${p.category.toLowerCase()}`)}
              className="group block w-full overflow-hidden rounded-xl border p-2 transition hover:-translate-y-0.5 cursor-pointer"
              style={{ borderColor: `${C.deep}22`, backgroundColor: "#ffffff" }}
            >
              <img
                src={p.src}
                alt={p.title}
                className="aspect-[9/14] rounded-lg object-cover transition duration-500 group-hover:scale-[1.04]"
              />
              <div 
                className="mt-2 text-xs font-medium"
                style={{ color: C.deep }}
              >
                {p.title}
              </div>
            </div>
          ))}
        </div>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
      </div>
    </Section>
  );
};


const faqs = [
  { q: "Apa itu Mikro Undangan?", a: "Platform untuk membuat undangan digital siap kirim dalam hitungan menit." },
  { q: "Apakah bisa custom domain?", a: "Bisa. Paket PRO mendukung domain khusus dan Google Analytics." },
  { q: "Bagaimana cara berbagi undangan?", a: "Cukup salin link atau bagikan lewat WhatsApp/Media Sosial." },
  { q: "Apakah ada musik & galeri foto?", a: "Ya, tersedia musik latar, galeri, RSVP, peta lokasi, dan ucapan tamu." },
];

<<<<<<< HEAD
function SlideFAQWithFooter({ active  }) {
=======
function SlideFAQWithFooter() {
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
  const [openIndex, setOpenIndex] = React.useState(-1);

  const toggle = (idx) => setOpenIndex((prev) => (prev === idx ? -1 : idx));

  return (
<<<<<<< HEAD
    <Section id="faq">
    <div id="faq" className="h-full w-full grid grid-rows-[auto_1fr]">
      {/* Header */}
      <div className="px-5 md:px-8 pt-8 pb-4">
        <h2 className="text-center text-3xl md:text-4xl font-extrabold tracking-tight text-indigo-900">
          FAQ
        </h2>
        <p className="mt-2 text-center text-sm md:text-base text-indigo-900/70">
          Pertanyaan yang sering diajukan tentang Mikro Undangan.
        </p>
      </div>

      {/* Content (scrollable) */}
      <div className="relative">
        <div className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]" />

        <div className="h-full overflow-y-auto px-5 md:px-8 pb-40" role="list" aria-label="Daftar pertanyaan umum">
          <div className="mx-auto max-w-3xl divide-y divide-indigo-200/50 rounded-2xl bg-white/60 backdrop-blur shadow-sm ring-1 ring-indigo-100">
            {faqs.map((item, idx) => (
              <FAQItem
                key={idx}
                index={idx}
                open={openIndex === idx}
                onToggle={() => toggle(idx)}
                q={item.q}
                a={item.a}
              />
            ))}
          </div>

          {/* Extra spacing so last item tidak tertutup footer */}
          <div className="h-28" />
        </div>
      </div>

      {/* Slide-in Footer */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="faq-footer"
            initial={{ y: 196, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 196, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="pointer-events-auto fixed left-0 right-0 bottom-0 z-40"
          >
 
              <div className="mx-auto  bg-white w-full p-5 h-60" data-swiper-parallax="-40">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-3" style={{ color: C.deep }}>
                  <div>
                    <div className="mb-2 text-lg font-semibold">Mikro Undangan</div>
                    <p className="text-sm opacity-80">Solusi undangan digital website: bisa diakses lewat HP, mudah diedit,
            lengkap fitur seperti galeri, RSVP, countdown, check-in QR, dan lainnya.
            Bikin undangan impianmu dalam hitungan menit.</p>
                    <div className="mt-3 flex items-center gap-2 text-xs opacity-70"><ShieldCheck className="h-4 w-4"/> Privasi & Keamanan</div>
                  </div>
                  <div>
                    <div className="mb-2 text-sm font-semibold">Menu</div>
                    <ul className="space-y-2 text-sm opacity-90">
                      {[
                        { label: "Template", href: "/tema" },
                        { label: "Harga", href: "/price" },
                        { label: "Partner", href: "/partner" },
                        { label: "About", href: "/about" },
                      ].map((m) => (<li key={m.label}><a href={m.href} className="transition hover:underline">{m.label}</a></li>))}
                    </ul>
                  </div>
                  <div>
                    <div className="mb-2 text-sm font-semibold">Kontak</div>
                    <ul className="space-y-2 text-sm opacity-90">
                      <li>Email: halo@mikroundangan.app</li>
                      <li>IG: @mikroundangan</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-10 border-t pt-6 text-xs opacity-70" style={{ borderColor: `${C.deep}22`, color: C.deep }}>© {new Date().getFullYear()} Mikro Undangan. All rights reserved.</div>
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </Section>
=======
    <>
      {/* ✅ FAQ SECTION */}
      <Section id="faq">
        <div className="h-full w-full grid grid-rows-[auto_1fr]">
          
          {/* Header */}
          <div className="px-5 md:px-8 pt-8 pb-4">
            <h2 className="text-center text-3xl md:text-4xl font-extrabold text-indigo-900">
              FAQ
            </h2>
            <p className="mt-2 text-center text-sm text-indigo-900/70">
              Pertanyaan yang sering diajukan tentang Mikro Undangan.
            </p>
          </div>

          {/* Content */}
          <div className="h-full overflow-y-auto px-5 md:px-8">
            <div className="mx-auto max-w-3xl divide-y divide-indigo-200/50 rounded-2xl bg-white/60 backdrop-blur shadow-sm ring-1 ring-indigo-100">
              {faqs.map((item, idx) => (
                <FAQItem
                  key={idx}
                  index={idx}
                  open={openIndex === idx}
                  onToggle={() => toggle(idx)}
                  q={item.q}
                  a={item.a}
                />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ✅ FOOTER FULL WIDTH */}
      <div className="w-full bg-white px-8 md:px-16 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7x1">
    
      {/* Kiri */}
      <div>
        <div className="mb-3 text-lg font-semibold">Mikro Undangan</div>
          <p className="text-sm opacity-80 leading-relaxed">
            Solusi undangan digital website: bisa diakses lewat HP, mudah diedit,
            lengkap fitur seperti galeri, RSVP, countdown, check-in QR, dan lainnya.
            Bikin undangan impianmu dalam hitungan menit.
          </p>

        <div className="mt-4 flex items-center gap-2 text-xs opacity-70">
          <ShieldCheck className="h-4 w-4" />
            Privasi & Keamanan
        </div>
    </div>

      {/* Tengah */}
        <div>
          <div className="mb-3 text-sm font-semibold">Menu</div>
            <ul className="space-y-2 text-sm opacity-90">
              <li><a href="/tema" className="hover:underline">Template</a></li>
              <li><a href="/price" className="hover:underline">Harga</a></li>
              <li><a href="/partner" className="hover:underline">Partner</a></li>
              <li><a href="/about" className="hover:underline">About</a></li>
            </ul>
        </div>

      {/* Kanan */}
        <div>
          <div className="mb-3 text-sm font-semibold">Kontak</div>
            <ul className="space-y-2 text-sm opacity-90">
            <li>Email: halo@mikroundangan.app</li>
            <li>IG: @mikroundangan</li>
            </ul>
          </div>
        </div>

      {/* Garis + copyright */}
        <div className="mt-10 border-t pt-6 text-xs opacity-70">
          © {new Date().getFullYear()} Mikro Undangan. All rights reserved.
        </div>
      </div>
    </>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
  );
}

function FAQItem({ index, open, onToggle, q, a }) {
  return (
    <div className="group">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`faq-panel-${index}`}
        className="w-full px-4 md:px-6 py-4 md:py-5 flex items-start justify-between gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
      >
        <div>
          <h4 className="text-base md:text-lg font-semibold text-indigo-950">
            {q}
          </h4>
          <AnimatePresence initial={false}>
            {open && (
              <motion.p
                id={`faq-panel-${index}`}
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                className="text-sm md:text-base text-indigo-900/80 overflow-hidden mt-2 pr-2"
              >
                {a}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Plus/Minus icon */}
        <div className="mt-1 shrink-0 rounded-lg border border-indigo-200 bg-white p-2 shadow-sm">
          <motion.svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="text-indigo-700"
          >
            <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </motion.svg>
        </div>
      </button>
    </div>
  );
}

// ————————————————————————————————————————————
// Root Component
// ————————————————————————————————————————————
export function MikroUndangan_A() {
  // Index slide: 0=Hero, 1=Categories, 2=Showcase, 3=FAQ+Footer
  const FAQ_SLIDE_INDEX = 3;

  // Modules tanpa Navigation —> tombol < dan > dihapus
  const modules = useMemo(() => [Mousewheel, Pagination, Keyboard, Autoplay, Parallax], []);
  
  // Untuk mengontrol background navbar
  const [activeIndex, setActiveIndex] = useState(0);
  const navbarRef = useRef(null);


  // Sembunyikan bullet pagination saat di slide FAQ
  const hidePagination = activeIndex === FAQ_SLIDE_INDEX;

  return (
    <div
      className={clsx(
        "relative min-h-screen scroll-smooth antialiased",
        hidePagination && "hide-pagination"
      )}
      style={{ backgroundColor: C.ivory }}
    >
      {/* CSS kecil untuk sembunyikan pagination hanya saat class .hide-pagination aktif */}
      <style>{`
        .hide-pagination .swiper-pagination { display: none !important; }
      `}</style>

      {/* Pass current slide index to navbar */}
      <LandingNav currentSlide={activeIndex} />

<<<<<<< HEAD
      <Swiper
        direction="vertical"
        speed={900}
        mousewheel={{ forceToAxis: true, sensitivity: 1 }}
        keyboard={{ enabled: true }}
        grabCursor
        resistanceRatio={0.85}
        // pagination={{ clickable: true }}
        // navigation — DIHAPUS agar tidak ada tombol < >
        modules={modules}
        parallax
        className="h-screen w-full"
        onSlideChange={(sw) => setActiveIndex(sw.activeIndex)}
      >
        <SwiperSlide className="!h-screen" style={{ backgroundColor: '#BDDDE4' }}>
          <SlideHero />
        </SwiperSlide>

        <SwiperSlide className="!h-screen">
          <SlideCategories />
        </SwiperSlide>

        <SwiperSlide className="!h-screen">
          <SlideShowcase />
        </SwiperSlide>

        <SwiperSlide className="!h-screen">
          <SlideFAQWithFooter active={activeIndex === FAQ_SLIDE_INDEX ? true : false} />
        </SwiperSlide>
      </Swiper>
=======
      <div className="w-full">
        <SlideHero />
        <SlideCategories />
        <SlideShowcase />
        <SlideFAQWithFooter active={true} />
      </div>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
    </div>
  );
}

export default function MikroUndangan() {
  return <MikroUndangan_A />;
}