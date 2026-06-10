import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Gift, Music4, Pause, QrCode, Play, Clock, Heart, Star, MessageSquareText, House } from "lucide-react";

/**
 * BlueJavaneseInvitation.jsx
 * Konversi dari HTML ke JSX + Tailwind CSS.
 *
 * Catatan:
 * - Tailwind perlu dikonfigurasi di project Anda.
 * - Ganti URL aset (bg/frame/wayang) sesuai kebutuhan.
 * - Autoplay audio di mobile biasanya diblokir hingga ada interaksi (klik).
 * - Props dapat dioverride untuk konten dinamis.
 */

const BG_URL = "https://satumomen.com/themes/blue-javanese/bg.webp";
const FRAME = {
  tm: "https://satumomen.com/themes/blue-javanese/frame-tm.webp",
  bm: "https://satumomen.com/themes/blue-javanese/frame-bm.webp",
  left: "https://satumomen.com/themes/blue-javanese/left.webp",
  right: "https://satumomen.com/themes/blue-javanese/right.webp",
  tl: "https://satumomen.com/themes/blue-javanese/frame-tl.webp",
  tr: "https://satumomen.com/themes/blue-javanese/frame-tr.webp",
  bl: "https://satumomen.com/themes/blue-javanese/frame-bl.webp",
  br: "https://satumomen.com/themes/blue-javanese/frame-br.webp",
  doorL: "https://satumomen.com/themes/blue-javanese/pintu-left.webp",
  doorR: "https://satumomen.com/themes/blue-javanese/pintu-right.webp",
};

const Wayang = {
  atas: "https://satumomen.com/themes/jawa-asli/wayang-atas.webp",
  bawah: "https://satumomen.com/themes/jawa-asli/wayang-bawah.webp",
};

const DEFAULT_AUDIO = "https://assets.satumomen.com/musics/whatsapp-audio-2023-12-03-at-153233.mp3";

function FrameLayer() {
  // Versi minimal: cukup dekor; Anda bisa hilangkan kalau tidak diperlukan.
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <img src={FRAME.tm} alt="frame" className="w-full select-none" />
      <img src={FRAME.bm} alt="frame" className="w-full absolute bottom-0 select-none" />
      <img src={FRAME.left} alt="frame" className="h-full absolute left-0 top-0 select-none" />
      <img src={FRAME.right} alt="frame" className="h-full absolute right-0 top-0 select-none" />
      <img src={FRAME.tl} alt="frame" className="absolute left-0 top-0 select-none" />
      <img src={FRAME.tr} alt="frame" className="absolute right-0 top-0 select-none" />
      <img src={FRAME.bl} alt="frame" className="absolute left-0 bottom-0 select-none" />
      <img src={FRAME.br} alt="frame" className="absolute right-0 bottom-0 select-none" />
    </div>
  );
}

function useCountdown(targetISO) {
  const target = useMemo(() => (targetISO ? new Date(targetISO) : null), [targetISO]);
  const [left, setLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    if (!target) return;
    const tick = () => {
      const now = new Date();
      const diff = Math.max(0, target.getTime() - now.getTime());
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setLeft({ d, h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return left;
}

function Section({ children, bg = BG_URL, className = "" }) {
  return (
    <section
      className={"relative min-h-[100dvh] w-full flex items-center justify-center " + className}
      style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <FrameLayer />
      <div className="relative z-10 w-full max-w-md px-4 py-10">{children}</div>
    </section>
  );
}

export default function BlueJavaInvitation({
  couple = { bride: "Kuntum Indah Purnama Sari, M.Sn", brideIg: "@instagram", groom: "Gian Aditya Chandra, S.T., M.Tr.A.P.", groomIg: "@instagram" },
  event = {
    akad: { dateText: "Sabtu, 17 Februari 2024", timeText: "09.00 WIB s.d. selesai", place: "Rumah Lombok Bandung", address: "Komp. Permata Biru Blok I No. 69H RT 04 RW 15, Cinunuk Kec. Cileunyi Kab. Bandung" },
    resepsi: { day: "Kamis", dateNum: "15", monthYear: "FEB 2024", timeText: "10.00 s.d. 16.00 WIB", place: "Rumah Lombok Bandung", address: "Komp. Permata Biru Blok I No. 69H RT 04 RW 15, Cinunuk Kec. Cileunyi Kab. Bandung" },
    countdownISO: "2024-02-15T08:00:00",
  },
  guest = { name: "Tamu Undangan", group: "VIP" },
  map = { lat: -6.9078652, lng: 107.6192617, label: "Rumah Lombok Bandung" },
  gifts = [
    { bank: "BCA", name: "Atas Nama Rekening", number: "12345678", logo: "https://assets.satumomen.com/images/no-image.jpg" },
    { bank: "BCA", name: "Atas Nama", number: "12345678", logo: "https://assets.satumomen.com/images/no-image.jpg" },
  ],
  audioUrl = DEFAULT_AUDIO,
}) {
  const audioRef = useRef(null);
  const [musicOn, setMusicOn] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showRSVP, setShowRSVP] = useState(false);

  const cd = useCountdown(event?.countdownISO);

  const gmapsEmbed = `https://www.google.com/maps/embed/v1/place?key=AIzaSyCpV55KNPo55TuxnDFd_dR3MD0luBrN1Gc&zoom=17&q=${map.lat},${map.lng}`;
  const gmapsLink = `https://www.google.com/maps/place/?q=${map.lat},${map.lng}`;

  useEffect(() => {
    if (autoPlay && audioRef.current && !musicOn) {
      audioRef.current.play().then(() => setMusicOn(true)).catch(() => {});
    }
  }, [autoPlay, musicOn]);

  const toggleMusic = async () => {
    if (!audioRef.current) return;
    if (musicOn) {
      audioRef.current.pause();
      setMusicOn(false);
    } else {
      try {
        await audioRef.current.play();
        setMusicOn(true);
      } catch {}
    }
  };

  const sections = [
    { key: "opening", label: "Opening", icon: <EnvelopeIcon />, node: (
      <Section>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-[246px] h-[233px] overflow-hidden">
            <img src={Wayang.atas} alt="wayang-atas" className="w-[246px] h-[257px] object-contain" />
          </div>
          <h1 className="font-[500] text-4xl text-[#e5c081] tracking-wide">Kuntum &amp; Gian</h1>
          <div className="w-[227px] h-[154px] overflow-hidden">
            <img src={Wayang.bawah} alt="wayang-bawah" className="w-[227px] h-[154px] object-contain" />
          </div>

          <div className="mt-3 bg-white/70 rounded-md px-3 py-2">
            <p className="text-sm">Kepada Yth.<br/>Bapak/Ibu/Saudara/i</p>
            <p id="guestNameSlot" className="text-base font-semibold text-[#e5c081]">{guest?.name || "Tamu Undangan"}</p>
          </div>

          <button onClick={() => setAutoPlay(true)} className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#033362] text-white px-4 py-2 text-sm shadow">
            <Play className="w-4 h-4" /> Open Invitation
          </button>
        </div>
      </Section>
    ) },
    { key: "quotes", label: "Quotes", icon: <Star className="w-5 h-5" />, node: (
      <Section>
        <div className="text-center space-y-2">
          <p className="italic text-[14.5px]">Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.</p>
          <p className="text-[14.5px]">(QS. Ar-Ruum 30:21)</p>
        </div>
      </Section>
    ) },
    { key: "mempelai", label: "Mempelai", icon: <Heart className="w-5 h-5" />, node: (
      <Section>
        <div className="w-full space-y-6 text-center">
          <p className="text-[14.5px] italic">Bismillahirrahmanirrahim</p>
          <p className="text-[14.5px] text-[#e5c081] italic">Assalamualaikum Warahmatullahi Wabarakatuh</p>
          <p className="text-[14.5px]">Maha Suci Allah SWT Yang telah menciptakan makhluk-Nya berpasang-pasangan, Ya Allah dengan kerendahan hati, perkenankanlah kami menikahkan putra-putri kami tercinta</p>

          <div className="space-y-1">
            <h3 className="text-[#e5c081] text-2xl">{couple.bride}</h3>
            <p className="text-[14.5px]">Putri ke dua Bpk. Dr. H. Rusman Nurdin, S.Sen., M.Sn.<br/>&amp; Ibu Hj. Lilis Sriyeti, BA.</p>
            <a href="https://instagram.com/" target="_blank" rel="noreferrer" className="inline-flex text-white bg-[#033362] rounded-full px-3 py-1 text-sm">{couple.brideIg}</a>
          </div>

          <p className="text-[#e5c081] italic">dengan</p>

          <div className="space-y-1">
            <h3 className="text-[#e5c081] text-2xl">{couple.groom}</h3>
            <p className="text-[14.5px]">Putra ke empat Bpk. Supriatna (Alm)<br/>&amp; Ibu Eti Rohayati</p>
            <a href="https://instagram.com/" target="_blank" rel="noreferrer" className="inline-flex text-white bg-[#033362] rounded-full px-3 py-1 text-sm">{couple.groomIg}</a>
          </div>
        </div>
      </Section>
    ) },
    { key: "acara", label: "Acara", icon: <Clock className="w-5 h-5" />, node: (
      <Section>
        <div className="w-full">
          <div className="text-center space-y-1 mb-6">
            <p className="text-[#e5c081] font-semibold">Akad Nikah — {event.akad.dateText}</p>
            <p className="text-sm font-semibold">Pukul : {event.akad.timeText}</p>
            <p className="text-[14.5px] text-[#e5c081] font-semibold">{event.akad.place}</p>
            <p className="text-xs">{event.akad.address}</p>
          </div>

          <div className="text-center mb-6">
            <p className="text-[#e5c081] text-xl mb-2">Undangan</p>
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-24">{event.resepsi.day}</div>
              <div className="px-4 border-x-2 border-[#e5c081]">
                <div className="text-5xl leading-none">{event.resepsi.dateNum}</div>
              </div>
              <div className="w-24">{event.resepsi.monthYear}</div>
            </div>
            <p className="text-[14.5px]">Pukul {event.resepsi.timeText}</p>
            <p className="text-[14.5px] text-[#e5c081] font-semibold">{event.resepsi.place}</p>
            <p className="text-[14.5px]">{event.resepsi.address}</p>
          </div>

          {/* Countdown */}
          <div className="max-w-sm mx-auto">
            <div className="grid grid-cols-4 gap-3 text-center">
              {[
                { k: "Hari", v: cd.d },
                { k: "Jam", v: cd.h },
                { k: "Menit", v: cd.m },
                { k: "Detik", v: cd.s },
              ].map((it) => (
                <div key={it.k} className="rounded-md bg-white/70 p-2">
                  <div className="text-2xl font-semibold tabular-nums">{String(it.v).padStart(2, "0")}</div>
                  <div className="text-xs">{it.k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    ) },
    { key: "maps", label: "Maps", icon: <MapPin className="w-5 h-5" />, node: (
      <Section>
        <div className="space-y-4">
          <div className="w-full overflow-hidden rounded-lg" style={{ paddingBottom: "56.25%", position: "relative" }}>
            <iframe title="maps" className="absolute inset-0 w-full h-full border-0" allowFullScreen src={gmapsEmbed} />
          </div>
          <div className="text-center">
            <p className="text-[#e5c081] font-semibold">{map.label}</p>
            <p className="text-[14.5px]">Komp. Permata Biru Blok I No. 69H RT 04 RW 15<br/>Cinunuk Kec. Cileunyi Kab. Bandung</p>
            <a href={gmapsLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full bg-[#033362] text-white px-4 py-2 text-sm mt-2">Petunjuk Ke Lokasi</a>
          </div>
        </div>
      </Section>
    ) },
    { key: "rsvp", label: "RSVP", icon: <MessageSquareText className="w-5 h-5" />, node: (
      <Section>
        <div className="text-center space-y-4">
          <h3 className="text-[#e5c081] text-xl">Do'a Untuk Pengantin</h3>
          <p>"Semoga Allah memberkahimu di waktu bahagia dan memberkahimu di waktu susah, dan mengumpulkan kalian berdua dalam kebaikan"<br/><br/>[HR. Abu Daud]</p>
          <p>Tekan tombol di bawah ini untuk mengirim ucapan dan konfirmasi kehadiran</p>
          <button onClick={() => setShowRSVP(true)} className="inline-flex items-center gap-2 rounded-full bg-[#033362] text-white px-4 py-2 text-sm">
            Konfirmasi &amp; Kirim Ucapan
          </button>
        </div>
      </Section>
    ) },
    { key: "gift", label: "Gift", icon: <Gift className="w-5 h-5" />, node: (
      <Section>
        <div className="text-center space-y-4">
          <h3 className="text-[#e5c081] text-2xl">Tanda Kasih</h3>
          <p>Terima kasih telah menambah semangat kegembiraan pernikahan kami dengan kehadiran dan hadiah indah Anda.</p>
          <div className="grid grid-cols-1 gap-3">
            {gifts.map((g, idx) => (
              <div key={idx} className="flex items-center gap-3 rounded-lg bg-white/70 p-3">
                <img src={g.logo} alt={g.bank} className="w-20 h-12 object-contain" />
                <div className="text-left">
                  <div className="text-lg font-semibold tabular-nums">{g.number}</div>
                  <div className="text-sm">{g.bank} : {g.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    ) },
    { key: "thanks", label: "Thanks", icon: <House className="w-5 h-5" />, node: (
      <Section>
        <div className="text-center space-y-3">
          <p>Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan do'a restu kepada putri kami.</p>
          <p className="text-[#e5c081]">Wassalamu'alaikum Warahmatullahi Wabarakatuh</p>
          <div className="flex items-start justify-center gap-8 text-xs">
            <div>
              <div className="underline">Kel. Bpk. Dr. H. Rusman Nurdin, S.Sen., M.Sn.</div>
              <div>Ibu Hj. Lilis Sriyeti, BA.</div>
            </div>
            <div>
              <div className="underline">Kel. Bpk. Supriatna (Alm)</div>
              <div>Ibu Eti Rohayati</div>
            </div>
          </div>
        </div>
      </Section>
    ) },
  ];

  return (
    <div className="relative min-h-[100dvh] bg-[#033362] text-[#0f172a] [--inv-accent:#e5c081] [--inv-base:#ffffff]">
      {/* AUDIO */}
      <audio ref={audioRef} src={audioUrl} loop preload="none" />

      {/* TRACK / SECTIONS */}
      <div className="w-full">
        {sections.map((s) => (
          <div key={s.key}>{s.node}</div>
        ))}
      </div>

      {/* BOTTOM MENU */}
      <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-20">
        <ul className="flex items-center gap-2 rounded-full bg-[#09457f] text-[var(--inv-accent)] px-2 py-2 shadow-xl">
          {sections.map((s) => (
            <li key={s.key} className="flex flex-col items-center justify-center text-[10px] text-center text-[var(--inv-accent)]">
              <a href={`#${s.key}`} className="flex flex-col items-center px-3 py-1 opacity-90 hover:opacity-100">
                <div className="h-5">{s.icon}</div>
                <span>{s.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* FLOATING ACTIONS */}
      <div className="fixed bottom-24 right-3 flex flex-col items-end gap-2 z-20">
        <button onClick={() => setShowQR(true)} className="rounded-full bg-white text-slate-800 p-3 shadow-lg hover:shadow-xl">
          <QrCode className="w-6 h-6" />
        </button>
        <button onClick={toggleMusic} className="rounded-full bg-white text-slate-800 p-3 shadow-lg hover:shadow-xl">
          {musicOn ? <Pause className="w-6 h-6" /> : <Music4 className="w-6 h-6" />}
        </button>
        <button onClick={() => setAutoPlay((v) => !v)} className="rounded-full bg-white text-slate-800 p-3 shadow-lg hover:shadow-xl">
          {autoPlay ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>
      </div>

      {/* QR MODAL */}
      {showQR && (
        <Modal onClose={() => setShowQR(false)}>
          <div className="w-full">
            <div
              className="w-full aspect-video bg-cover bg-center rounded-md"
              style={{ backgroundImage: "url(https://assets.satumomen.com/images/invitation/cover-4197791731987794.png)" }}
            />
            <div className="text-center py-4">
              {/* SVG QR placeholder (gantikan dengan QR Anda) */}
              <div className="mx-auto inline-block border p-2 rounded-md">
                <DummyQR />
              </div>
              <div className="mt-3 text-sm opacity-70">Nama</div>
              <div className="text-base font-medium">{guest?.name}</div>
            </div>
          </div>
        </Modal>
      )}

      {/* RSVP MODAL (placeholder form) */}
      {showRSVP && (
        <Modal onClose={() => setShowRSVP(false)}>
          <h3 className="text-lg font-semibold mb-3">Konfirmasi Kehadiran</h3>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
            <div>
              <label className="text-sm">Nama</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2" defaultValue={guest?.name} />
            </div>
            <div>
              <label className="text-sm">No HP / WhatsApp</label>
              <input className="mt-1 w-full rounded-md border px-3 py-2" placeholder="08xxxx" />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm">Kehadiran?</label>
              <select className="rounded-md border px-3 py-2">
                <option>Hadir</option>
                <option>Tidak Hadir</option>
              </select>
            </div>
            <div>
              <label className="text-sm">Jumlah Tamu</label>
              <input type="number" min={1} className="mt-1 w-full rounded-md border px-3 py-2" defaultValue={1} />
            </div>
            <div>
              <label className="text-sm">Komentar / Ucapan</label>
              <textarea className="mt-1 w-full rounded-md border px-3 py-2" rows={3} />
            </div>
            <button className="w-full rounded-full bg-[#033362] text-white px-4 py-2">Kirim</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-30 grid place-items-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-4 shadow-xl">
        <button onClick={onClose} className="absolute right-3 top-3 rounded-full p-1 hover:bg-slate-100" aria-label="Tutup">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>
        </button>
        {children}
      </div>
    </div>
  );
}

function DummyQR() {
  // Ringan: tempatkan SVG QR dari HTML asli di sini jika perlu.
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180"><rect x="0" y="0" width="180" height="180" fill="#ffffff"/><rect x="20" y="20" width="40" height="40" fill="#000"/><rect x="120" y="20" width="40" height="40" fill="#000"/><rect x="20" y="120" width="40" height="40" fill="#000"/><rect x="70" y="70" width="40" height="40" fill="#000"/></svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5v-11Zm2 .232V7l8 5 8-5v-.268A1.5 1.5 0 0 0 19.5 5h-15A1.5 1.5 0 0 0 4 6.732ZM20 9.236l-7.553 4.721a2 2 0 0 1-2.094 0L4 9.236V17.5A1.5 1.5 0 0 0 5.5 19h13a1.5 1.5 0 0 0 1.5-1.5V9.236Z"/></svg>
  );
}