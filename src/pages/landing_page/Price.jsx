import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, MotionConfig, useMotionValue, useTransform } from "framer-motion";
import { Check, X, Zap, Crown, Sparkles, Info } from "lucide-react";
import useSubscription from "../../api/subscription/useSubscription";
import useTransaction from "../../api/transactions/useTransactions";
import { toast } from "react-toastify";

// Helpers
const currency = (n) => new Intl.NumberFormat("id-ID").format(n);

// Data statis untuk fitur dan ikon, menggunakan slug sebagai kunci
const staticPlanData = {
  basic: {
    icon: Zap,
    color: "from-slate-900 to-slate-800",
    features: ["1 Tema Premium", "Tautan Undangan (subdomain)", "Galeri Foto (10 foto)", "Musik Latar", "Google Maps Lokasi"],
    notIncluded: ["Custom Domain", "Support Prioritas"],
    buttonText: "Pilih Basic",
  },
  pro: {
    icon: Crown,
    color: "from-indigo-600 to-fuchsia-600",
    features: ["Semua di Basic", "Semua Tema Premium", "Galeri Tanpa Batas", "RSVP & Buku Tamu", "Custom Domain", "Tanpa Branding"],
    notIncluded: ["Support 24/7"],
    ribbon: "Paling Populer",
    buttonText: "Pilih Pro",
    highlight: true,
  },
  business: {
    icon: Sparkles,
    color: "from-amber-500 to-pink-500",
    features: ["Semua di Pro", "Multi-Project (hingga 20 acara)", "Tim Kolaborator", "Integrasi Payment", "Support Prioritas", "Analytics Lanjutan"],
    notIncluded: [],
    buttonText: "Pilih Business",
  },
};

export default function PricingPage() {
<<<<<<< HEAD
  const { createSubscriptionPayment, loading: paymentLoading } = useTransaction(); // Panggil hook
=======
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
  const { data: subscriptions, loading, getList } = useSubscription();
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(true);

  useEffect(() => {
    getList({ limit: 999, sort: 'id:asc' });
  }, [getList]);

  const displayPlans = useMemo(() => {
    return subscriptions
<<<<<<< HEAD
      .filter(sub => sub.slug !== 'free')
      .map(sub => {
        const staticData = staticPlanData[sub.slug] || {};
=======
      .filter(sub => sub.slug.toLowerCase() !== 'free')
      .map(sub => {
        const safeSlug = sub.slug.toLowerCase();
        const staticData = staticPlanData[safeSlug] || {};
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
        return { ...sub, ...staticData };
      });
  }, [subscriptions]);

<<<<<<< HEAD
  const handleChoosePlan = async (priceId) => {
    if (paymentLoading) return;
    try {
      // 1. Minta token pembayaran dari backend Anda
      const paymentData = await createSubscriptionPayment(priceId);
      
      // 2. Jika token diterima, buka pop-up pembayaran Midtrans
      if (paymentData && paymentData.token) {
        window.snap.pay(paymentData.token, {
          onSuccess: function(result){
            toast.success("Pembayaran berhasil! Paket Anda akan segera diupdate.");
            // Arahkan pengguna kembali ke dasbor setelah beberapa saat
            setTimeout(() => navigate('/dashboard/invitations'), 2000);
          },
          onPending: function(result){
            toast.info("Menunggu konfirmasi pembayaran Anda...");
          },
          onError: function(result){
            toast.error("Pembayaran gagal. Silakan coba lagi.");
          },
          onClose: function(){
            /* Pengguna menutup pop-up sebelum menyelesaikan pembayaran */
            toast.warn("Anda menutup jendela pembayaran.");
          }
        });
      }
    } catch (error) {
      // Toast error dari hook sudah otomatis muncul
      console.error("Gagal memulai proses pembayaran:", error);
    }
=======
  const handleChoosePlan = (priceId, planName, amount, interval) => {
    if (!priceId) {
      toast.error("ID Harga tidak ditemukan.");
      return;
    }
    // Mengarahkan ke halaman form pembayaran sesuai keinginanmu
    navigate(`/checkout`, {
      state: {
        priceId,
        packageName: planName,
        amount: amount,
        interval: interval === 'year' ? 'Tahunan' : 'Bulanan'
      }
    });
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
  };

  const discountText = "Hemat hingga 2 bulan";

  return (
    <MotionConfig transition={{ type: "spring", bounce: 0.2, duration: 0.6, delay: 0.1 }}>
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-fuchsia-50 text-slate-900">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute -top-36 -right-20 h-80 w-80 rounded-full bg-gradient-to-tr from-indigo-300 to-indigo-500 blur-3xl opacity-70 transform rotate-12" />
          <div className="absolute -bottom-36 -left-20 h-80 w-80 rounded-full bg-gradient-to-br from-fuchsia-200 to-fuchsia-400 blur-3xl opacity-70 transform -rotate-12" />

          <div className="container mx-auto px-4 pt-20 pb-12">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Pilih Paket yang <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">Pas</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-3 max-w-2xl text-slate-600">
              Harga sederhana, fitur komplet. Cocok untuk undangan pribadi, pasangan, hingga vendor profesional.
            </motion.p>

            {/* Billing Toggle */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 inline-flex items-center gap-3">
              <span className={`text-sm ${annual ? "text-slate-400" : "text-slate-900 font-medium"}`}>Bulanan</span>
              <button
                onClick={() => setAnnual((v) => !v)}
                className="relative h-9 w-16 rounded-full bg-slate-200/80 p-1 ring-1 ring-slate-200 hover:ring-slate-300 transition"
                aria-label="Toggle billing"
              >
                <motion.span
                  layout
                  className="block h-7 w-7 rounded-full bg-white shadow"
                  style={{ x: annual ? 32 : 0 }}
                />
              </button>
              <span className={`text-sm ${annual ? "text-slate-900 font-medium" : "text-slate-400"}`}>Tahunan</span>
              <motion.span initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-xs rounded-full bg-emerald-50 text-emerald-700 px-2 py-1 ring-1 ring-emerald-100">
                {discountText}
              </motion.span>
            </motion.div>
          </div>
        </section>

        {/* Cards */}
<<<<<<< HEAD
       <section className="container mx-auto px-4 pb-12">
=======
        <section className="container mx-auto px-4 pb-12">
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
          {loading ? (
            <p className="text-center">Memuat paket...</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {displayPlans.map((p, idx) => (
                <PricingCard
                  key={p.id}
                  plan={p}
                  annual={annual}
                  onChoose={handleChoosePlan}
                  orderIndex={idx}
                />
              ))}
            </div>
          )}
          
          {/* Hint */}
          <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
<<<<<<< HEAD
            <Info className="h-4 w-4" />
=======
            <span className="shrink-0"><Info className="h-4 w-4" /></span>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
            <p>Harga dapat berubah sewaktu-waktu. Fitur dapat berbeda bergantung ketersediaan & kebijakan.</p>
          </div>
        </section>

        {/* Comparison snip */}
        <Comparison />

        {/* FAQ */}
        <FAQ />

        {/* CTA */}
        <section className="container mx-auto px-4 pt-6 pb-16">
          <div className="rounded-3xl bg-slate-900 text-white p-8 md:p-10 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold">Siap membuat undangan pertama Anda?</h3>
                <p className="mt-2 text-slate-300 max-w-2xl">Pilih paket, atur detail, dan bagikan undangan dalam hitungan menit.</p>
              </div>
              <div className="flex gap-3">
<<<<<<< HEAD
                <button onClick={() => navigate(`/checkout?plan=pro&term=${annual ? "year" : "month"}`)} className="rounded-2xl bg-white text-slate-900 px-5 py-3 text-sm font-semibold shadow-sm hover:bg-slate-100">
=======
                <button 
                  onClick={() => {
                    const proPlan = subscriptions.find(s => s.slug.toLowerCase() === 'pro');
                    const interval = annual ? 'year' : 'month';
                    const priceData = proPlan?.prices?.find(p => p.interval === interval);
                    if (priceData) handleChoosePlan(priceData.id);
                  }} 
                  className="rounded-2xl bg-white text-slate-900 px-5 py-3 text-sm font-semibold shadow-sm hover:bg-slate-100"
                >
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
                  Mulai dari Paket Pro
                </button>
                <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold hover:bg-white/10">
                  Lihat Paket Lagi
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MotionConfig>
  );
}

function PricingCard({ plan, annual, onChoose, orderIndex }) {
  const rotate = useMotionValue(0);
  const translateY = useTransform(rotate, [-10, 10], [-4, 4]);
  
  const interval = annual ? 'year' : 'month';
<<<<<<< HEAD
  const priceData = plan.prices.find(p => p.interval === interval);
  
  // Pengecekan keamanan jika plan.icon tidak ada
=======
  const priceData = plan.prices?.find(p => p.interval === interval);
  
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
  const PlanIcon = plan.icon || Info; 

  if (!priceData) return null;

  const price = priceData.amount;
  const per = annual ? "/tahun" : "/bulan";

<<<<<<< HEAD
  const handleSelect = () => {
    onChoose(priceData.id);
  };


=======
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: orderIndex * 0.06 }}
    >
      <motion.div
<<<<<<< HEAD

=======
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
        style={{ rotateX: rotate, y: translateY }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const dy = (e.clientY - rect.top) / rect.height - 0.5;
          rotate.set(dy * -8);
        }}
        onMouseLeave={() => rotate.set(0)}
        className={`relative h-full rounded-3xl bg-white ring-1 ring-slate-100 shadow-sm overflow-hidden ${
          plan.highlight ? "md:scale-[1.02]" : ""
        }`}
      >
        {plan.ribbon && (
          <motion.div
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
<<<<<<< HEAD
            className="absolute left-0 right-0 top-3 mx-auto w-max rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200"
=======
            className="absolute left-0 right-0 top-3 mx-auto w-max rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200 z-10"
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
          >
            {plan.ribbon}
          </motion.div>
        )}

        {/* Header */}
        <div className={`p-6 border-b border-slate-100 bg-gradient-to-r ${plan.color} text-white`}>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/15 p-2">
              <PlanIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <p className="text-sm/5 text-white/80">{plan.tagline || plan.description}</p>
            </div>
          </div>

          <div className="mt-4 flex items-end gap-2">
            <span className="text-3xl font-extrabold tracking-tight">Rp {currency(price)}</span>
            <span className="text-sm/6 text-white/80">{per}</span>
          </div>
        </div>

        {/* Features */}
        <div className="p-6 flex flex-col gap-4">
          <ul className="space-y-2">
            {(plan.features || []).map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span className="mt-0.5 rounded-full bg-emerald-50 p-1 ring-1 ring-emerald-100">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                </span>
<<<<<<< HEAD
                <span className="text-slate-700">{f}</span>
=======
                <span className="text-slate-700 text-sm">{f}</span>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
              </li>
            ))}
            {(plan.notIncluded || []).map((f) => (
              <li key={f} className="flex items-start gap-2 opacity-60">
                <span className="mt-0.5 rounded-full bg-slate-50 p-1 ring-1 ring-slate-100">
                  <X className="h-3.5 w-3.5" />
                </span>
<<<<<<< HEAD
                <span className="text-slate-500 line-through">{f}</span>
=======
                <span className="text-slate-500 line-through text-sm">{f}</span>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
              </li>
            ))}
          </ul>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
<<<<<<< HEAD
            onClick={handleSelect}
=======
            onClick={() => onChoose(priceData.id, plan.name, priceData.amount, priceData.interval)}
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
            className={`mt-2 inline-flex items-center justify-center rounded-2xl px-4 py-2.5 font-semibold shadow-sm ring-1 transition ${
              plan.highlight
                ? "bg-slate-900 text-white ring-slate-900 hover:bg-slate-800"
                : "bg-white text-slate-900 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {plan.buttonText}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Comparison() {
  const rows = [
    { feature: "Tema Premium", basic: "1 tema", pro: "Semua tema", business: "Semua + kustom" },
    { feature: "Custom Domain", basic: false, pro: true, business: true },
    { feature: "Galeri Foto", basic: "10 foto", pro: "Tak terbatas", business: "Tak terbatas" },
    { feature: "RSVP & Buku Tamu", basic: true, pro: true, business: true },
    { feature: "Multi-Project", basic: false, pro: false, business: "hingga 20" },
    { feature: "Support Prioritas", basic: false, pro: false, business: true },
  ];

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <h2 className="text-2xl md:text-3xl font-bold">Perbandingan Cepat</h2>
        <p className="mt-2 text-slate-600">Lihat sekilas perbedaan fitur setiap paket.</p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-100 shadow-sm">
        <motion.table initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="w-full table-fixed">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="w-2/5 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600">Fitur</th>
              <th className="w-1/5 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600">Basic</th>
              <th className="w-1/5 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600">Pro</th>
              <th className="w-1/5 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600">Business</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <motion.tr key={r.feature} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="border-t border-slate-100">
<<<<<<< HEAD
                <td className="px-4 py-3 text-slate-700">{r.feature}</td>
=======
                <td className="px-4 py-3 text-slate-700 text-sm">{r.feature}</td>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
                <td className="px-4 py-3">{renderCell(r.basic)}</td>
                <td className="px-4 py-3">{renderCell(r.pro)}</td>
                <td className="px-4 py-3">{renderCell(r.business)}</td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>
    </section>
  );
}

function renderCell(val) {
  if (val === true)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
        <Check className="h-3.5 w-3.5" /> Tersedia
      </span>
    );
  if (val === false)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-100">
        <X className="h-3.5 w-3.5" />-
      </span>
    );
<<<<<<< HEAD
  return <span className="text-slate-700">{val}</span>;
=======
  return <span className="text-slate-700 text-sm">{val}</span>;
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
}

function FAQ() {
  const items = [
    {
      q: "Apakah harga sudah termasuk PPN?",
      a: "Harga belum termasuk pajak yang berlaku (jika ada). Total akan ditampilkan saat checkout.",
    },
    {
      q: "Bisakah upgrade/downgrade paket kapan saja?",
      a: "Bisa. Perubahan paket akan diprorata sesuai sisa masa aktif.",
    },
    {
      q: "Apakah ada garansi uang kembali?",
      a: "Kami menyediakan garansi refund 7 hari jika fitur inti tidak berfungsi sebagaimana mestinya.",
    },
    {
      q: "Bagaimana dengan custom domain?",
      a: "Untuk paket Pro & Business, Anda dapat menghubungkan domain Anda melalui dashboard dengan panduan DNS yang jelas.",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">Pertanyaan Umum</h2>
        <p className="mt-2 text-slate-600">Masih ragu? Berikut jawaban dari pertanyaan paling sering.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((it, i) => (
          <FAQItem key={i} q={it.q} a={it.a} index={i} />)
        )}
      </div>
    </section>
  );
}

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <button onClick={() => setOpen((v) => !v)} className="w-full text-left">
        <div className="flex items-center justify-between gap-4">
          <p className="font-semibold text-slate-900">{q}</p>
          <motion.span animate={{ rotate: open ? 45 : 0 }} className="rounded-full bg-slate-50 p-1 ring-1 ring-slate-100">
            <X className="h-4 w-4" />
          </motion.span>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
<<<<<<< HEAD
          <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-3 text-slate-600 overflow-hidden">
=======
          <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-3 text-slate-600 overflow-hidden text-sm">
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
            {a}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
