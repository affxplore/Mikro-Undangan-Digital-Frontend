import React, { useState } from "react"; // Tambahkan useState di sini
import { useNavigate, Link } from "react-router-dom";
import {
  Rocket,
  Users,
  ShieldCheck,
  HeartHandshake,
  Star,
  TrendingUp,
  Trophy,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Instagram,
  Facebook,
  MessageCircle
} from "lucide-react";
import { motion } from "framer-motion";
import apiService from "../../api/apiService"; // Impor apiService kamu

export default function AboutPage() {
  const navigate = useNavigate();

  // --- LOGIKA FORM HUBUNGI KAMI ---
  const [loading, setLoading] = useState(false);
  const [contactData, setContactData] = useState({
    nama: '',
    email: '',
    pesan: ''
  });

  const handleCreate = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Jika belum login, arahkan ke login
      // 'from' dibungkus dalam object agar terbaca oleh login.jsx
      navigate("/login", {
        state: { from: { pathname: "/dashboard/invitations" } }
      });
    } else {
      // Jika sudah login, langsung ke halaman invitations
      navigate("/dashboard/invitations");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    // Kirim sebagai Object JSON biasa agar terbaca oleh req.body di backend
    const payload = {
      name: contactData.nama,
      email: contactData.email,
      message: contactData.pesan,
      type: 'info'
    };

    await apiService.post("/system-messages", payload); 
    
    alert("Pesan berhasil dikirim!");
    setContactData({ nama: '', email: '', pesan: '' });
  } catch (error) {
    console.error(error.response || error);
    alert("Gagal mengirim pesan.");
  } finally {
    setLoading(false);
  }
};

  // -------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-fuchsia-50 text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-36 -right-20 h-80 w-80 rounded-full bg-gradient-to-tr from-indigo-300 to-indigo-500 blur-3xl opacity-70 transform rotate-12" />
        <div className="absolute -bottom-36 -left-20 h-80 w-80 rounded-full bg-gradient-to-br from-fuchsia-200 to-fuchsia-400 blur-3xl opacity-70 transform -rotate-12" />

        <div className="container mx-auto px-6 pt-20 pb-14 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight"
          >
            Tentang <span className="bg-gradient-to-r from-indigo-700 to-fuchsia-600 bg-clip-text text-transparent">Kami</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 max-w-2xl text-slate-700"
          >
            Kami membantu Anda membuat undangan digital yang elegan, cepat, dan mudah dibagikan—dengan fitur modern untuk setiap momen spesial.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <button
              onClick={() => navigate("/tema")}
              className="rounded-2xl px-5 py-3 text-sm font-semibold shadow-md bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:brightness-105 transition"
            >
              Jelajahi Template
            </button>
            <Link
              to="/partner"
              className="rounded-2xl px-5 py-3 text-sm font-semibold shadow-md bg-white ring-1 ring-slate-200 hover:ring-slate-300"
            >
              Program Affiliate
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats + Contact side-by-side */}
      <section className="container mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { icon: <Users className="h-5 w-5" />, label: "Pengguna", value: "120K+", color: "from-indigo-600 to-indigo-500" },
                { icon: <Star className="h-5 w-5" />, label: "Rating", value: "4.9/5", color: "from-amber-400 to-amber-300" },
                { icon: <TrendingUp className="h-5 w-5" />, label: "Undangan Dibuat", value: "750K+", color: "from-pink-500 to-rose-400" },
                { icon: <Trophy className="h-5 w-5" />, label: "Partner", value: "1.2K+", color: "from-green-400 to-teal-400" },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * i }}
                  className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-xl p-2 bg-gradient-to-br ${s.color} text-white`}>{s.icon}</div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">{s.label}</p>
                      <p className="text-xl font-bold">{s.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mission & Values */}
            <div className="mb-6 text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl font-bold">Visi & Misi</h2>
              <p className="mt-2 max-w-2xl text-slate-700 mx-auto lg:mx-0">
                Kami berkomitmen memberikan pengalaman terbaik—mulai dari desain yang indah,
                performa cepat, hingga privasi data yang aman.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <Rocket className="h-6 w-6" />, title: "Inovasi Tanpa Henti",
                  desc: "Fitur baru dan pembaruan rutin agar undangan selalu relevan dan kekinian.",
                },
                {
                  icon: <ShieldCheck className="h-6 w-6" />, title: "Keamanan & Privasi",
                  desc: "Data Anda terenkripsi dan dilindungi sesuai praktik terbaik industri.",
                },
                {
                  icon: <HeartHandshake className="h-6 w-6" />, title: "Dukungan Manusiawi",
                  desc: "Tim support responsif yang siap membantu dari awal hingga acara selesai.",
                },
              ].map((f) => (
                <motion.div
                  key={f.title}
                  whileHover={{ y: -6 }}
                  className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white p-2">{f.icon}</div>
                    <h3 className="text-lg font-semibold">{f.title}</h3>
                  </div>
                  <p className="mt-3 text-slate-600">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Us box - INTEGRASI ASLI */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="sticky top-20 rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white p-3">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold">Hubungi Kami</h4>
                <p className="text-sm text-slate-600 mt-1">Butuh bantuan? Kirim pesan — kami siap bantu.</p>
              </div>
            </div>

            {/* Update Form onSubmit */}
            <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs text-slate-500">Nama</label>
                <input 
                  name="nama"
                  value={contactData.nama}
                  onChange={handleChange}
                  required 
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300" 
                  placeholder="Nama Anda" 
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Email</label>
                <input 
                  name="email"
                  type="email" 
                  value={contactData.email}
                  onChange={handleChange}
                  required 
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300" 
                  placeholder="email@contoh.com" 
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Pesan</label>
                <textarea 
                  name="pesan"
                  value={contactData.pesan}
                  onChange={handleChange}
                  required 
                  rows={3} 
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300" 
                  placeholder="Tulis pesan singkat..." 
                />
              </div>

              <div className="flex items-center justify-between">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white px-4 py-2 text-sm font-semibold shadow disabled:opacity-50"
                >
                  {loading ? "Mengirim..." : "Kirim Pesan"}
                </button>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="h-4 w-4" /> <span>+62 812-3456-7890</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 mt-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <a aria-label="Twitter" href="#" className="p-2 rounded-lg hover:bg-slate-50"><Twitter className="h-4 w-4"/></a>
                  <a aria-label="Instagram" href="#" className="p-2 rounded-lg hover:bg-slate-50"><Instagram className="h-4 w-4"/></a>
                  <a aria-label="Facebook" href="#" className="p-2 rounded-lg hover:bg-slate-50"><Facebook className="h-4 w-4"/></a>
                </div>
                <a href="mailto:MicroUndangan@gmail.com" className="text-xs text-indigo-600 hover:underline">MicroUndangan@gmail.com</a>
              </div>
            </form>
          </motion.aside>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 pt-4 pb-16">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-700 to-fuchsia-600 text-white p-8 md:p-10 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold">Siap membuat undangan tak terlupakan?</h3>
              <p className="mt-2 text-slate-100 max-w-2xl">Pilih dari ratusan template premium, atur detail acara, dan bagikan dalam hitungan menit.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                className="rounded-2xl bg-white text-slate-900 px-5 py-3 text-sm font-semibold shadow-sm hover:bg-slate-100"
              >
                Buat Undangan
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}