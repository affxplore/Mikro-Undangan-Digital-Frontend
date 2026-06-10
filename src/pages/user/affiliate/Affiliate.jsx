import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {Link} from "react-router-dom";
import {
  Copy,
  LinkIcon,
  Share2,
  TrendingUp,
  BarChart2,
  Wallet,
  CheckCircle2,
  Clock3,
  CircleDollarSign,
  Info,
  Download,
  ExternalLink,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

// Helper: classnames
function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Mock data (plug in from API later)
const MOCK_SUMMARY = {
  totalCommission: 5243500,
  unpaidCommission: 1835000,
  paidCommission: 3408500,
  totalClicks: 1289,
  totalReferrals: 94,
  conversionRate: 7.29,
};

const MOCK_CLICKS = Array.from({ length: 14 }).map((_, i) => {
  const day = new Date();
  day.setDate(day.getDate() - (13 - i));
  const d = day.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
  return {
    date: d,
    clicks: Math.floor(Math.random() * 140) + 12,
    conversions: Math.floor(Math.random() * 14),
  };
});

const MOCK_COMMISSIONS = [
  { id: "ORD-98321", date: "12 Agu 2025", customer: "Bayu Saputra", amount: 75000, status: "approved", notes: "Paket Basic" },
  { id: "ORD-98307", date: "10 Agu 2025", customer: "Anita Dewi", amount: 120000, status: "paid", notes: "Paket Pro" },
  { id: "ORD-98271", date: "08 Agu 2025", customer: "Fajar Nugroho", amount: 95000, status: "pending", notes: "Paket Basic" },
  { id: "ORD-98250", date: "07 Agu 2025", customer: "Rani Pratiwi", amount: 180000, status: "approved", notes: "Paket Premium" },
  { id: "ORD-98190", date: "04 Agu 2025", customer: "Dewi Lestari", amount: 130000, status: "paid", notes: "Paket Pro" },
];

const MOCK_PAYOUTS = [
  { id: "WD-3021", date: "11 Agu 2025", method: "Bank BCA", amount: 1500000, status: "processed" },
  { id: "WD-2987", date: "02 Agu 2025", method: "OVO", amount: 900000, status: "success" },
  { id: "WD-2944", date: "25 Jul 2025", method: "Bank BRI", amount: 800000, status: "success" },
];

const currency = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export default function AffiliateManagePage() {
  const [refLink] = useState("https://app.mikroundangan.com/ref/rio-12345");
  const summary = MOCK_SUMMARY;

  const totalConversions = useMemo(() => MOCK_CLICKS.reduce((s, x) => s + x.conversions, 0), []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(refLink);
      alert("Link referral disalin!");
    } catch {
      alert("Gagal menyalin link");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <div className=" top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-blue-600 bg-gradien-to-br from-blue-600 to-blue-500 shadow-md flex items-center justify-center">
              <LinkIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">Manage Affiliate</h1>
              <p className="text-slate-500 text-sm">Pantau komisi, klik referral, dan penarikan dalam satu tempat.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-2 text-sm font-medium rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <Link to='/withdraw' className="px-3 py-2 text-sm font-medium rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow">Ajukan Penarikan</Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Summary cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Komisi"
            value={currency(summary.totalCommission)}
            icon={CircleDollarSign}
            accent="from-blue-600 to-blue-500"
            chip="Semua waktu"
          />
          <StatCard
            title="Belum Dibayar"
            value={currency(summary.unpaidCommission)}
            icon={Clock3}
            accent="from-cyan-600 to-blue-500"
            chip="Menunggu payout"
          />
          <StatCard
            title="Sudah Dibayar"
            value={currency(summary.paidCommission)}
            icon={Wallet}
            accent="from-sky-600 to-indigo-500"
            chip="Diterima"
          />
          <StatCard
            title="Klik Referral"
            value={summary.totalClicks}
            icon={TrendingUp}
            accent="from-indigo-600 to-blue-500"
            chip={`${summary.conversionRate}% CR`}
          />
        </section>

        {/* Tools */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 rounded-3xl border border-slate-100 bg-gradien-to-b from-white to-slate-50 shadow-sm"
          >
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-slate-800">Performa Referral (14 hari)</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">
                <div className="xl:col-span-3 h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_CLICKS} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="c1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }} />
                      <Area type="monotone" dataKey="clicks" stroke="#2563eb" fill="url(#c1)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="xl:col-span-2 h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={MOCK_CLICKS} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }} />
                      <Line type="monotone" dataKey="conversions" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="mt-4 text-sm text-slate-500 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Total konversi 14 hari: <span className="font-medium text-slate-700">{totalConversions}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="rounded-3xl border border-slate-100 bg-gradien-to-b from-white to-slate-50 shadow-sm"
          >
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-slate-800">Link & Tools Afiliasi</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-slate-600">Link Referral</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    readOnly
                    value={refLink}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-200/60"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="rounded-2xl border border-slate-200 px-3 py-3 hover:bg-slate-50 text-slate-700"
                    aria-label="Copy referral link"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <ShareButton label="Share WhatsApp" href={`https://wa.me/?text=${encodeURIComponent(refLink)}`} />
                <ShareButton label="Share Facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(refLink)}`} />
                <ShareButton label="Share X" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(refLink)}&text=Daftar%20sekarang!`} />
              </div>

              <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-800">
                <p className="font-medium">Tips cepat:</p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>Pasang link di bio Instagram & profil WhatsApp.</li>
                  <li>Gunakan kode kupon khusus agar konversi mudah dilacak.</li>
                  <li>Bagikan testimoni untuk tingkatkan <em>conversion rate</em>.</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Tables */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="lg:col-span-2 rounded-3xl border border-slate-100 bg-white shadow-sm"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CircleDollarSign className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-slate-800">Riwayat Komisi</h2>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
                Lihat semua <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <div className="p-2">
              <div className="overflow-auto rounded-2xl border border-slate-100">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-slate-600">
                      <th className="px-4 py-3">Tanggal</th>
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Komisi</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Catatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_COMMISSIONS.map((row, idx) => (
                      <tr key={row.id} className={cx("border-t border-slate-100", idx % 2 ? "bg-white" : "bg-slate-50/40")}> 
                        <td className="px-4 py-3 text-slate-700">{row.date}</td>
                        <td className="px-4 py-3 font-mono text-slate-800">{row.id}</td>
                        <td className="px-4 py-3 text-slate-700">{row.customer}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">{currency(row.amount)}</td>
                        <td className="px-4 py-3">{<StatusPill status={row.status} />}</td>
                        <td className="px-4 py-3 text-slate-600">{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-3xl border border-slate-100 bg-white shadow-sm"
          >
            <div className="p-6 border-b border-slate-100 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-600" />
              <h2 className="font-semibold text-slate-800">Riwayat Penarikan</h2>
            </div>
            <div className="p-2">
              <div className="overflow-hidden rounded-2xl border border-slate-100">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-slate-600">
                      <th className="px-4 py-3">Tanggal</th>
                      <th className="px-4 py-3">Metode</th>
                      <th className="px-4 py-3">Jumlah</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_PAYOUTS.map((row, idx) => (
                      <tr key={row.id} className={cx("border-t border-slate-100", idx % 2 ? "bg-white" : "bg-slate-50/40")}> 
                        <td className="px-4 py-3 text-slate-700">{row.date}</td>
                        <td className="px-4 py-3 text-slate-700">{row.method}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">{currency(row.amount)}</td>
                        <td className="px-4 py-3">{<StatusPill status={row.status} />}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Guide */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 rounded-3xl border border-slate-100 bg-gradien-to-b from-white to-slate-50 shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              <h2 className="font-semibold text-slate-800">Panduan Singkat Program</h2>
            </div>
            <div className="p-6 text-sm text-slate-700">
              <ul className="grid sm:grid-cols-2 gap-4">
                <li className="rounded-2xl p-4 border border-blue-100 bg-blue-50/60">
                  <p className="font-medium text-blue-800">Syarat & Ketentuan</p>
                  <p className="mt-1 text-slate-700">Komisi dibayarkan setiap Senin–Jumat untuk saldo &gt; Rp100.000. Order yang refund tidak dihitung.</p>
                </li>
                <li className="rounded-2xl p-4 border border-cyan-100 bg-cyan-50/60">
                  <p className="font-medium text-cyan-800">Cara Dapat Komisi</p>
                  <p className="mt-1 text-slate-700">Bagikan link referral. Saat user membeli paket, komisi otomatis tercatat.</p>
                </li>
                <li className="rounded-2xl p-4 border border-indigo-100 bg-indigo-50/60">
                  <p className="font-medium text-indigo-800">Batas Pencairan</p>
                  <p className="mt-1 text-slate-700">Minimal pencairan Rp100.000. Proses 1–2 hari kerja.</p>
                </li>
                <li className="rounded-2xl p-4 border border-sky-100 bg-sky-50/60">
                  <p className="font-medium text-sky-800">Kontak Bantuan</p>
                  <p className="mt-1 text-slate-700">WhatsApp admin: 08xx-xxxx-xxxx (jam kerja 09.00–17.00 WIB).</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white shadow-sm p-6">
            <h3 className="font-semibold text-slate-800">FAQ Singkat</h3>
            <div className="mt-4 space-y-4 text-sm">
              <details className="group rounded-2xl border border-slate-200 p-4">
                <summary className="cursor-pointer font-medium text-slate-800">Bagaimana cara mendaftar?</summary>
                <p className="mt-2 text-slate-600">Semua user otomatis punya link referral. Cukup bagikan link di atas.</p>
              </details>
              <details className="group rounded-2xl border border-slate-200 p-4">
                <summary className="cursor-pointer font-medium text-slate-800">Kapan komisi masuk?</summary>
                <p className="mt-2 text-slate-600">Komisi tercatat setelah pembayaran terkonfirmasi dan masa garansi lewat.</p>
              </details>
              <details className="group rounded-2xl border border-slate-200 p-4">
                <summary className="cursor-pointer font-medium text-slate-800">Apakah ada batas penarikan?</summary>
                <p className="mt-2 text-slate-600">Minimal Rp100.000 per penarikan. Tidak ada batas maksimal.</p>
              </details>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, accent = "from-blue-600 to-blue-500", chip }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden"
    >
      <div className="p-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className={cx("h-12 w-12 rounded-2xl shadow-inner text-white flex items-center justify-center bg-gradien-to-br", accent)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {chip && (
        <div className="px-5 pb-5">
          <span className="inline-flex items-center text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-1">
            {chip}
          </span>
        </div>
      )}
    </motion.div>
  );
}

function StatusPill({ status }) {
  const map = {
    paid: { text: "Paid", class: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    approved: { text: "Approved", class: "bg-sky-50 text-sky-700 border-sky-100" },
    pending: { text: "Pending", class: "bg-amber-50 text-amber-700 border-amber-100" },
    processed: { text: "Diproses", class: "bg-blue-50 text-blue-700 border-blue-100" },
    success: { text: "Sukses", class: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    failed: { text: "Gagal", class: "bg-rose-50 text-rose-700 border-rose-100" },
  };
  const cfg = map[status] || { text: status, class: "bg-slate-50 text-slate-700 border-slate-200" };
  return <span className={cx("inline-flex items-center px-2.5 py-1 rounded-full text-xs border", cfg.class)}>{cfg.text}</span>;
}

function ShareButton({ label, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm"
    >
      <Share2 className="h-4 w-4" />
      {label}
    </a>
  );
}
