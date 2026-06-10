import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  CircleDollarSign,
  CreditCard,
  Building2,
  Smartphone,
  Info,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  X,
} from "lucide-react";

// Helper
function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ===== Mocked data (replace with API) =====
const MOCK_BALANCE = {
  available: 1835000, // unpaid commission available to withdraw
  minPayout: 100000,
  feePercent: 1.5, // % fee
  flatFee: 2500, // additional flat fee (IDR)
  processingDays: "1–2 hari kerja",
};

const BANKS = [
  { code: "BCA", name: "Bank Central Asia (BCA)" },
  { code: "BRI", name: "Bank Rakyat Indonesia (BRI)" },
  { code: "BNI", name: "Bank Negara Indonesia (BNI)" },
  { code: "MANDIRI", name: "Bank Mandiri" },
  { code: "CIMB", name: "CIMB Niaga" },
];

const EWALLETS = [
  { code: "DANA", name: "DANA" },
  { code: "OVO", name: "OVO" },
  { code: "GOPAY", name: "GoPay" },
  { code: "SHOPEEPAY", name: "ShopeePay" },
];

const currency = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

export default function WithdrawPage({ onBack }) {
  // Form states
  const [method, setMethod] = useState("BANK"); // BANK | EWALLET
  const [amount, setAmount] = useState(250000);
  const [holderName, setHolderName] = useState("");
  const [bankCode, setBankCode] = useState("BCA");
  const [accountNumber, setAccountNumber] = useState("");
  const [ewalletCode, setEwalletCode] = useState("DANA");
  const [ewalletNumber, setEwalletNumber] = useState("");
  const [notes, setNotes] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fee = useMemo(() => {
    const percent = (Number(amount || 0) * (MOCK_BALANCE.feePercent / 100)) || 0;
    return Math.ceil(percent + MOCK_BALANCE.flatFee);
  }, [amount]);

  const net = useMemo(() => Math.max((Number(amount || 0) - fee), 0), [amount, fee]);

  const amountError = useMemo(() => {
    const a = Number(amount || 0);
    if (!a) return "Masukkan nominal penarikan";
    if (a < MOCK_BALANCE.minPayout) return `Minimal penarikan ${currency(MOCK_BALANCE.minPayout)}`;
    if (a > MOCK_BALANCE.available) return "Nominal melebihi saldo tersedia";
    return "";
  }, [amount]);

  const detailError = useMemo(() => {
    if (method === "BANK") {
      if (!holderName) return "Nama pemilik rekening wajib diisi";
      if (!accountNumber) return "Nomor rekening wajib diisi";
      if (!/^[0-9]{6,20}$/.test(accountNumber)) return "Nomor rekening tidak valid";
    } else {
      if (!ewalletNumber) return "Nomor akun e-wallet wajib diisi";
      if (!/^[0-9]{8,20}$/.test(ewalletNumber)) return "Nomor e-wallet tidak valid";
    }
    return "";
  }, [method, holderName, accountNumber, ewalletNumber]);

  const isValid = !amountError && !detailError;

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    // Simulate API
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="h-9 w-9 rounded-2xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center"
              aria-label="Kembali"
            >
              <ArrowLeft className="h-5 w-5 text-slate-700" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">Ajukan Penarikan</h1>
              <p className="text-slate-500 text-sm">Tarik komisi afiliasi ke rekening bank atau e-wallet Anda.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Balance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-100 bg-gradien-to-br from-white to-slate-50 shadow-sm overflow-hidden"
        >
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryItem icon={Wallet} label="Saldo Tersedia" value={currency(MOCK_BALANCE.available)} accent="from-blue-600 to-blue-500" />
            <SummaryItem icon={Info} label="Minimal Penarikan" value={currency(MOCK_BALANCE.minPayout)} accent="from-sky-600 to-cyan-500" />
            <SummaryItem icon={CircleDollarSign} label="Estimasi Biaya" value={`${MOCK_BALANCE.feePercent}% + ${currency(MOCK_BALANCE.flatFee)}`} accent="from-indigo-600 to-blue-500" />
          </div>
          <div className="px-6 pb-6 text-sm text-slate-600">
            Proses pencairan {MOCK_BALANCE.processingDays}. Dana dikirim sesuai metode yang Anda pilih.
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Detail Penarikan</h2>
            <p className="text-sm text-slate-500">Lengkapi informasi berikut dengan benar untuk mempercepat proses.</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Amount */}
            <div>
              <label className="text-sm text-slate-700">Nominal Penarikan</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-200/60"
                />
                <button
                  type="button"
                  onClick={() => setAmount(MOCK_BALANCE.available)}
                  className="px-3 py-2 rounded-2xl border border-slate-200 hover:bg-slate-50 text-sm text-slate-700"
                >
                  Tarik Semua
                </button>
              </div>
              {amountError && <p className="mt-1 text-sm text-rose-600">{amountError}</p>}
            </div>

            {/* Method */}
            <div>
              <label className="text-sm text-slate-700">Metode Pencairan</label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <MethodChip
                  active={method === "BANK"}
                  icon={Building2}
                  label="Transfer Bank"
                  onClick={() => setMethod("BANK")}
                />
                <MethodChip
                  active={method === "EWALLET"}
                  icon={Smartphone}
                  label="E-Wallet"
                  onClick={() => setMethod("EWALLET")}
                />
              </div>
            </div>

            {/* Method Details */}
            {method === "BANK" ? (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-700">Bank</label>
                  <select
                    value={bankCode}
                    onChange={(e) => setBankCode(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-200/60"
                  >
                    {BANKS.map((b) => (
                      <option key={b.code} value={b.code}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-700">No. Rekening</label>
                  <input
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Contoh: 1234567890"
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-200/60"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-slate-700">Nama Pemilik Rekening</label>
                  <input
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    placeholder="Sesuai buku tabungan"
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-200/60"
                  />
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-700">E-Wallet</label>
                  <select
                    value={ewalletCode}
                    onChange={(e) => setEwalletCode(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-200/60"
                  >
                    {EWALLETS.map((w) => (
                      <option key={w.code} value={w.code}>{w.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-700">No. Akun / HP</label>
                  <input
                    value={ewalletNumber}
                    onChange={(e) => setEwalletNumber(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-200/60"
                  />
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="text-sm text-slate-700">Catatan (opsional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Misal: Mohon proses cepat, terima kasih"
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-200/60"
              />
            </div>

            {/* Breakdown */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm">
              <div className="flex items-center gap-2 text-blue-800 font-medium">
                <CreditCard className="h-4 w-4" /> Rincian Pencairan
              </div>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
                <BreakdownItem label="Diminta" value={currency(amount || 0)} />
                <BreakdownItem label="Biaya" value={currency(fee)} />
                <BreakdownItem label="Diterima" value={currency(net)} />
                <BreakdownItem label="Sisa Saldo" value={currency(Math.max(MOCK_BALANCE.available - (Number(amount || 0)), 0))} />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Data Anda aman dan terenkripsi.
              </p>
              <button
                disabled={!isValid}
                onClick={() => setConfirmOpen(true)}
                className={cx(
                  "px-4 py-2.5 rounded-2xl text-white font-medium shadow",
                  isValid ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-300 cursor-not-allowed"
                )}
              >
                Ajukan Penarikan
              </button>
            </div>
            {(amountError || detailError) && (
              <div className="text-sm text-rose-600">{amountError || detailError}</div>
            )}
          </div>
        </motion.div>
      </main>

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmOpen && (
          <div className="fixed inset-0 z-40">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40"
              onClick={() => setConfirmOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[520px] top-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-xl border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="font-semibold text-slate-800">Konfirmasi Penarikan</div>
                <button onClick={() => setConfirmOpen(false)} className="h-9 w-9 rounded-xl hover:bg-slate-50 flex items-center justify-center">
                  <X className="h-5 w-5 text-slate-600" />
                </button>
              </div>
              <div className="p-6 space-y-4 text-sm text-slate-700">
                <p>Pastikan data berikut sudah benar:</p>
                <ul className="space-y-1">
                  <li><span className="text-slate-500">Nominal: </span><span className="font-medium">{currency(amount || 0)}</span></li>
                  <li><span className="text-slate-500">Metode: </span><span className="font-medium">{method === "BANK" ? "Transfer Bank" : "E-Wallet"}</span></li>
                  {method === "BANK" ? (
                    <>
                      <li><span className="text-slate-500">Bank: </span><span className="font-medium">{BANKS.find(b => b.code === bankCode)?.name}</span></li>
                      <li><span className="text-slate-500">No. Rekening: </span><span className="font-medium">{accountNumber}</span></li>
                      <li><span className="text-slate-500">Nama Rekening: </span><span className="font-medium">{holderName}</span></li>
                    </>
                  ) : (
                    <>
                      <li><span className="text-slate-500">E-Wallet: </span><span className="font-medium">{EWALLETS.find(w => w.code === ewalletCode)?.name}</span></li>
                      <li><span className="text-slate-500">No. Akun/HP: </span><span className="font-medium">{ewalletNumber}</span></li>
                    </>
                  )}
                  {notes && <li><span className="text-slate-500">Catatan: </span><span className="font-medium">{notes}</span></li>}
                </ul>

                <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 text-blue-800">
                  Dana diterima: <span className="font-semibold">{currency(net)}</span> (setelah biaya {currency(fee)}).
                </div>

                {submitted ? (
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" /> Permintaan penarikan berhasil diajukan. Cek status di Riwayat Penarikan.
                  </div>
                ) : null}
              </div>
              <div className="p-6 pt-0 flex items-center justify-end gap-2">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="px-4 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700"
                >
                  Batal
                </button>
                <button
                  disabled={submitting || submitted}
                  onClick={handleSubmit}
                  className={cx(
                    "px-4 py-2.5 rounded-2xl text-white font-medium shadow",
                    submitting || submitted ? "bg-slate-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  )}
                >
                  {submitting ? "Mengirim..." : submitted ? "Terkirim" : "Konfirmasi & Ajukan"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SummaryItem({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-xl font-semibold text-slate-900">{value}</p>
      </div>
      <div className={cx("h-12 w-12 rounded-2xl text-white flex items-center justify-center bg-gradien-to-br shadow-inner", accent)}>
        <Wallet className="h-6 w-6" />
      </div>
    </div>
  );
}

function MethodChip({ active, icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "flex items-center justify-center gap-2 rounded-2xl px-4 py-3 border text-sm",
        active
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      )}
    >
      <Icon className={cx("h-4 w-4", active ? "text-blue-600" : "text-slate-600")} />
      {label}
    </button>
  );
}

function BreakdownItem({ label, value }) {
  return (
    <div className="rounded-xl bg-white border border-blue-100 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}
