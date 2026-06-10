<<<<<<< HEAD

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom"
=======
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
import {
  FiClipboard,
  FiCheckCircle,
  FiUser,
  FiUpload,
  FiInfo,
  FiCopy,
} from "react-icons/fi";
import { FaHandshake } from "react-icons/fa";
<<<<<<< HEAD
=======
import apiService from "../../api/apiService"; // Pastikan path ini benar
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d

export default function PartnerPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
<<<<<<< HEAD
=======
  
  // --- INTEGRASI LOGIKA BACKEND ---
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    no_wa: '',
    kode_afiliasi: '',
    alamat: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Sesuaikan payload dengan kolom database kamu
      const payload = {
        nama: formData.nama,
        email: formData.email,
        no_wa: formData.no_wa,
        kode_afiliasi: formData.kode_afiliasi,
        // alamat: formData.alamat // Aktifkan jika backend butuh alamat
      };

      await apiService.post("/afiliasis/register", payload);
      
      alert("Selamat! Pendaftaran Partner Mikro Undangan Berhasil.");
      setShowModal(false);
      navigate('/dashboard'); // Arahkan ke dashboard setelah sukses
    } catch (error) {
      // Ambil pesan error dari backend jika ada
      const errorMsg = error.response?.data?.message || "Gagal mendaftar. Pastikan data unik dan koneksi stabil.";
      alert("Error: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };
  // --------------------------------
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d

  const sampleAffiliateLink = "https://MikroUndangan.com/affiliate/12345";

  function handleCopyLink() {
    navigator.clipboard?.writeText(sampleAffiliateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function openSignup() {
    setShowModal(true);
  }

  function closeSignup() {
<<<<<<< HEAD
=======
    // Reset form saat ditutup (opsional)
    setFormData({ nama: '', email: '', no_wa: '', kode_afiliasi: '', alamat: '' });
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
    setShowModal(false);
  }

  const steps = [
<<<<<<< HEAD
    {
      title: "Daftar",
      desc: "Isi form singkat untuk membuat akun affiliate Anda.",
      icon: <FiUser className="w-5 h-5" />,
    },
    {
      title: "Dapatkan Link",
      desc: "Dapatkan link affiliate unik yang bisa dibagikan.",
      icon: <FiCopy className="w-5 h-5" />,
    },
    {
      title: "Promosikan",
      desc: "Bagikan link lewat sosial media, blog, atau toko Anda.",
      icon: <FaHandshake className="w-5 h-5" />,
    },
    {
      title: "Terima Komisi",
      desc: "Pantau penjualan dan tarik komisi setiap bulan.",
      icon: <FiCheckCircle className="w-5 h-5" />,
    },
  ];

  const faqs = [
    {
      q: "Berapa besar komisi?",
      a: "Standar hingga 20% per penjualan. Komisi dapat berubah sesuai promosi khusus.",
    },
    {
      q: "Kapan komisi dibayar?",
      a: "Pembayaran diproses tiap akhir bulan ke rekening yang Anda daftarkan.",
    },
    {
      q: "Apakah ada syarat minimum?",
      a: "Tidak ada syarat minimum — Anda dapat mencairkan komisi kapan saja jika saldo sudah tersedia.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-indigo-50 py-15">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/60 backdrop-blur rounded-2xl p-8 shadow-lg flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Program Partner & Affiliate
            </h1>
            <p className="mt-3 text-gray-600 max-w-2xl">
              Bergabunglah dan dapatkan komisi untuk setiap undangan digital
              yang terjual melalui link affiliate Anda. Kami sediakan dashboard,
              materi promosi, dan dukungan untuk memaksimalkan pendapatan Anda.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={openSignup}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-lg shadow-md transition"
              >
                Daftar Sekarang
              </button>

              <button
                onClick={() => navigate("/daftar-affiliate")}
                className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-800 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition"
              >
                Lihat Dashboard
              </button>

              
            </div>
          </div>

          <div className="w-full md:w-80 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <h3 className="text-sm font-semibold text-indigo-700">
              Contoh Link Anda
            </h3>
            <div className="mt-3 bg-white rounded-lg p-3 border border-gray-100 flex items-center justify-between gap-3">
              <div className="truncate text-sm text-gray-700">
                {sampleAffiliateLink}
              </div>
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {copied ? "Tersalin" : "Salin"}
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Bagikan link ke teman atau sosial media Anda.
            </p>
          </div>
        </div>

        {/* Features grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h4 className="font-semibold text-lg">Komisi Kompetitif</h4>
            <p className="mt-2 text-gray-600">
              Dapatkan hingga 20% per penjualan. Struktur komisi transparan.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h4 className="font-semibold text-lg">Dashboard Lengkap</h4>
            <p className="mt-2 text-gray-600">
              Pantau klik, penjualan, dan performa kampanye Anda dengan mudah.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h4 className="font-semibold text-lg">Materi Promosi</h4>
            <p className="mt-2 text-gray-600">
              Banner, copy postingan, dan template untuk memudahkan promosi.
            </p>
          </div>
        </div>

        {/* Steps / Flow */}
=======
    { title: "Daftar", desc: "Isi form singkat untuk membuat akun affiliate Anda.", icon: <FiUser className="w-5 h-5" /> },
    { title: "Dapatkan Link", desc: "Dapatkan link affiliate unik yang bisa dibagikan.", icon: <FiCopy className="w-5 h-5" /> },
    { title: "Promosikan", desc: "Bagikan link lewat sosial media, blog, atau toko Anda.", icon: <FaHandshake className="w-5 h-5" /> },
    { title: "Terima Komisi", desc: "Pantau penjualan dan tarik komisi setiap bulan.", icon: <FiCheckCircle className="w-5 h-5" /> },
  ];

  const faqs = [
    { q: "Berapa besar komisi?", a: "Standar hingga 20% per penjualan. Komisi dapat berubah sesuai promosi khusus." },
    { q: "Kapan komisi dibayar?", a: "Pembayaran diproses tiap akhir bulan ke rekening yang Anda daftarkan." },
    { q: "Apakah ada syarat minimum?", a: "Tidak ada syarat minimum — Anda dapat mencairkan komisi kapan saja jika saldo sudah tersedia." },
  ];

  return (
    // Memperbaiki typo bg-gradien menjadi bg-gradient
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-indigo-50 py-15">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header - Tampilan Asli Najwa */}
        <div className="bg-white/60 backdrop-blur rounded-2xl p-8 shadow-lg flex flex-col md:flex-row items-center gap-6 mt-10">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Program Partner & Affiliate</h1>
            <p className="mt-3 text-gray-600 max-w-2xl">
              Bergabunglah dan dapatkan komisi untuk setiap undangan digital yang terjual melalui link affiliate Anda. Kami sediakan dashboard, materi promosi, dan dukungan untuk memaksimalkan pendapatan Anda.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={openSignup} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-lg shadow-md transition">
                Daftar Sekarang
              </button>
              <Link to="/dashboard" className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-800 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition">
                Lihat Dashboard
              </Link>
            </div>
          </div>
          <div className="w-full md:w-80 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <h3 className="text-sm font-semibold text-indigo-700">Contoh Link Anda</h3>
            <div className="mt-3 bg-white rounded-lg p-3 border border-gray-100 flex items-center justify-between gap-3">
              <div className="truncate text-sm text-gray-700">{sampleAffiliateLink}</div>
              <button onClick={handleCopyLink} className="px-3 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                {copied ? "Tersalin" : "Salin"}
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-500">Bagikan link ke teman atau sosial media Anda.</p>
          </div>
        </div>

        {/* Features grid - Tampilan Asli Najwa */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h4 className="font-semibold text-lg">Komisi Kompetitif</h4>
            <p className="mt-2 text-gray-600">Dapatkan hingga 20% per penjualan. Struktur komisi transparan.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h4 className="font-semibold text-lg">Dashboard Lengkap</h4>
            <p className="mt-2 text-gray-600">Pantau klik, penjualan, dan performa kampanye Anda dengan mudah.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h4 className="font-semibold text-lg">Materi Promosi</h4>
            <p className="mt-2 text-gray-600">Banner, copy postingan, dan template untuk memudahkan promosi.</p>
          </div>
        </div>

        {/* Steps / Flow - Tampilan Asli Najwa */}
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
        <section className="mt-10 bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-2xl font-bold mb-4">Alur Menjadi Affiliate</h3>
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-1">
              <ol className="space-y-4">
                {steps.map((s, i) => (
                  <li key={i} className="flex gap-4 items-start">
<<<<<<< HEAD
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
                      {i + 1}
                    </div>
=======
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">{i + 1}</div>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
                    <div>
                      <h4 className="font-semibold">{s.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
<<<<<<< HEAD

            <div className="w-full md:w-72 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <h4 className="font-semibold text-indigo-700">Quick Checklist</h4>
              <ul className="mt-3 text-sm text-gray-700 space-y-2">
                <li className="flex items-center gap-2">
                  <FiCheckCircle /> Akun terverifikasi
                </li>
                <li className="flex items-center gap-2">
                  <FiUpload /> Upload materi promosi
                </li>
                <li className="flex items-center gap-2">
                  <FiInfo /> Baca panduan affiliate
                </li>
=======
            <div className="w-full md:w-72 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <h4 className="font-semibold text-indigo-700">Quick Checklist</h4>
              <ul className="mt-3 text-sm text-gray-700 space-y-2">
                <li className="flex items-center gap-2"><FiCheckCircle /> Akun terverifikasi</li>
                <li className="flex items-center gap-2"><FiUpload /> Upload materi promosi</li>
                <li className="flex items-center gap-2"><FiInfo /> Baca panduan affiliate</li>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
              </ul>
            </div>
          </div>
        </section>

<<<<<<< HEAD
        {/* FAQ & CTA */}
=======
        {/* FAQ & CTA - Tampilan Asli Najwa */}
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Pertanyaan Umum</h3>
            <div className="space-y-3">
              {faqs.map((f, idx) => (
<<<<<<< HEAD
                <div
                  key={idx}
                  className="border border-gray-100 rounded-lg p-3"
                >
                  <button
                    onClick={() =>
                      setSelectedFaq(selectedFaq === idx ? null : idx)
                    }
                    className="w-full text-left flex justify-between items-center"
                  >
                    <span className="font-medium">{f.q}</span>
                    <span className="text-sm text-gray-500">
                      {selectedFaq === idx ? "-" : "+"}
                    </span>
                  </button>
                  {selectedFaq === idx && (
                    <p className="mt-2 text-sm text-gray-600">{f.a}</p>
                  )}
=======
                <div key={idx} className="border border-gray-100 rounded-lg p-3">
                  <button onClick={() => setSelectedFaq(selectedFaq === idx ? null : idx)} className="w-full text-left flex justify-between items-center">
                    <span className="font-medium">{f.q}</span>
                    <span className="text-sm text-gray-500">{selectedFaq === idx ? "-" : "+"}</span>
                  </button>
                  {selectedFaq === idx && <p className="mt-2 text-sm text-gray-600">{f.a}</p>}
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
                </div>
              ))}
            </div>
          </div>
<<<<<<< HEAD

          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold">Siap jadi partner?</h3>
              <p className="mt-2 text-indigo-100">
                Bergabung sekarang dan mulai dapatkan penghasilan tambahan
                dengan mempromosikan layanan kami.
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={openSignup}
                  className="bg-white text-indigo-700 px-4 py-3 rounded-lg font-semibold"
                >
                  Daftar Sekarang
                </button>
                {/* <button
                  onClick={() => navigate("/affiliate-guide")}
                  className="bg-white/20 border border-white/30 px-4 py-3 rounded-lg"
                >
                  Panduan Affiliate
                </button> */}
              </div>
            </div>

            <div className="mt-6 text-sm opacity-90">
              <div className="mb-2">
                Contoh Link:{" "}
                <span className="font-mono">{sampleAffiliateLink}</span>
              </div>
              <div className="text-xs">
                Catatan: pastikan data pembayaran Anda valid untuk mempercepat
                proses pencairan.
=======
          {/* Memperbaiki typo bg-gradien menjadi bg-gradient */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold">Siap jadi partner?</h3>
              <p className="mt-2 text-indigo-100">Bergabung sekarang dan mulai dapatkan penghasilan tambahan.</p>
              <div className="mt-4 flex gap-3">
                <button onClick={openSignup} className="bg-white text-indigo-700 px-4 py-3 rounded-lg font-semibold">Daftar Sekarang</button>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
              </div>
            </div>
          </div>
        </div>
      </div>
<<<<<<< HEAD
      {/* Modal (simple) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeSignup} />

          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold">Form Pendaftaran Affiliate</h3>
            <p className="text-sm text-gray-600 mt-1">
              Isi data untuk membuat akun affiliate.
            </p>

            <form className="mt-4 grid grid-cols-1 gap-3 ">
              <div>
              <label className="block font-semibold"> Nama </label>
              <input
                className="mt-1 block w-full border rounded-lg px-3 py-2"
                placeholder="Masukkan Nama lengkap"/>
              </div>
                <div>
              <label className="block font-semibold"> E-mail</label>
              <input className="mt-1 block w-full border rounded-lg px-3 py-2" placeholder="Masukkan Email aktif" />
                </div>
                <div>
                <label className="block font-semibold "> No WhatsApp</label>
                <input  className="mt-1 block w-full border rounded-lg px-3 py-2"
                placeholder="Masukkan no WhatsApp aktif"/> 
                </div>
              <div>
                <label className="block font-semibold"> Alamat </label>
              <textarea
              placeholder="Masukkan alamat kamu" 
              rows={4}
              className="mt-1 block w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block font-semibold"> Kode </label>
              <input className="mt-1 block w-full border rounded-lg px-3 py-2" placeholder="Buat kode afiliasimu.."/>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    alert(
                      "Contoh: data terkirim (UI only). Ganti dengan API call)"
                    );
                    closeSignup();
                  }}
                  className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg"
                >
                  Kirim & Daftar
                </button>
                <button
                  type="button"
                  onClick={closeSignup}
                  className="flex-1 border rounded-lg px-4 py-3"
                >
=======

      {/* Modal - Tampilan Asli Najwa + Integrasi API */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!loading ? closeSignup : null} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900">Form Pendaftaran Affiliate</h3>
            <p className="text-sm text-gray-600 mt-1">Isi data untuk membuat akun affiliate.</p>

            {/* Tambahkan onSubmit agar form bisa dikirim dengan Enter */}
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="mt-4 grid grid-cols-1 gap-3">
              <div>
                <label className="block font-semibold text-gray-700">Nama</label>
                <input name="nama" value={formData.nama} onChange={handleChange} required className="mt-1 block w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="Masukkan Nama lengkap" />
              </div>
              <div>
                <label className="block font-semibold text-gray-700">E-mail</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border rounded-lg px-3 py-2" placeholder="Masukkan Email aktif" />
              </div>
              <div>
                <label className="block font-semibold text-gray-700">No WhatsApp</label>
                <input name="no_wa" value={formData.no_wa} onChange={handleChange} required className="mt-1 block w-full border rounded-lg px-3 py-2" placeholder="Contoh: 0812..." />
              </div>
              <div>
                <label className="block font-semibold text-gray-700">Alamat</label>
                <textarea name="alamat" value={formData.alamat} onChange={handleChange} placeholder="Masukkan alamat kamu" rows={3} className="mt-1 block w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block font-semibold text-gray-700">Kode Afiliasi Pilihan (Min. 4 Karakter)</label>
                <input name="kode_afiliasi" value={formData.kode_afiliasi} onChange={handleChange} required className="mt-1 block w-full border rounded-lg px-3 py-2" placeholder="Contoh: NAJWA01" />
              </div>
              <div className="flex gap-3 mt-4">
                {/* Gunakan type="submit" */}
                <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:bg-indigo-300">
                  {loading ? "Memproses..." : "Kirim & Daftar"}
                </button>
                <button type="button" onClick={closeSignup} disabled={loading} className="flex-1 border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50">
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
                  Batal
                </button>
              </div>
            </form>
<<<<<<< HEAD

            <button
              onClick={closeSignup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
=======
            <button onClick={closeSignup} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
          </div>
        </div>
      )}
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
