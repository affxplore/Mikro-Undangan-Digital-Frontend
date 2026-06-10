/* eslint-disable no-unused-vars */
import React, { useState, useRef, useCallback } from "react";

export default function SystemSetting() {
  const [activeTab, setActiveTab] = useState("domain");

  // Domain & Email Server
  const [domain, setDomain] = useState("");
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [fromEmail, setFromEmail] = useState("");

  // Payment Gateway
  const [paymentProvider, setPaymentProvider] = useState("midtrans");
  const [paymentApiKey, setPaymentApiKey] = useState("");
  const [paymentMode, setPaymentMode] = useState("sandbox");

  // Keamanan
  const [enableCaptcha, setEnableCaptcha] = useState(true);
  const [maxAttempts, setMaxAttempts] = useState(5);
  const [blockDurationMin, setBlockDurationMin] = useState(30);

  // Backup & Restore
  const [lastBackup, setLastBackup] = useState(null);
  const [backupStatus, setBackupStatus] = useState("");
  const restoreInputRef = useRef(null);


    // Refs for the input fields to avoid state updates on every keystroke
  const domainRef = useRef(null);
  const smtpHostRef = useRef(null);
  const smtpPortRef = useRef(null);
  const smtpUserRef = useRef(null);
  const smtpPassRef = useRef(null);
  const fromEmailRef = useRef(null);
  // Notifikasi sederhana
  const [toast, setToast] = useState(null);
  function showToast(message, type = "info") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  // Mock: Simpan konfigurasi per-section
  async function handleSave(section) {
    try {
      showToast("Menyimpan...", "info");
      // Simulasi delay
      await new Promise((r) => setTimeout(r, 800));
      showToast(`Konfigurasi ${section} berhasil disimpan.`, "success");
      // TODO: panggil API backend untuk menyimpan
    } catch (err) {
      showToast("Gagal menyimpan konfigurasi.", "error");
    }
  }

  // Mock: Test koneksi SMTP
  async function handleTestSMTP() {
    showToast("Menguji koneksi SMTP...", "info");
    await new Promise((r) => setTimeout(r, 1000));
    // Contoh aturan validasi singkat
    if (!smtpHost || !fromEmail) {
      showToast("Host SMTP dan From Email harus diisi.", "error");
      return;
    }
    showToast("Koneksi SMTP berhasil! Email percobaan terkirim.", "success");
  }

  // Mock: Test payment gateway
  async function handleTestPayment() {
    showToast("Menguji koneksi payment gateway...", "info");
    await new Promise((r) => setTimeout(r, 1000));
    if (!paymentApiKey) {
      showToast("API key payment gateway belum diisi.", "error");
      return;
    }
    showToast("Payment gateway merespon (sandbox).", "success");
  }

  // Mock: Backup sekarang
  async function handleBackupNow() {
    setBackupStatus("running");
    showToast("Backup dimulai...", "info");
    await new Promise((r) => setTimeout(r, 1500));
    const timestamp = new Date().toISOString();
    setLastBackup(timestamp);
    setBackupStatus("done");
    showToast("Backup selesai.", "success");
  }

  // Mock: Restore dari file
  async function handleRestore() {
    const files = restoreInputRef.current?.files;
    if (!files || files.length === 0) {
      showToast("Pilih file backup untuk restore.", "error");
      return;
    }
    showToast("Memulai proses restore...", "info");
    await new Promise((r) => setTimeout(r, 1800));
    showToast("Restore selesai. Pastikan memeriksa integritas data.", "success");
  }

  // Simple small components inside file
  function SectionCard({ title, children, footer }) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="space-y-4">{children}</div>
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    );
  }

  function InputRow({ label, children, hint }) {
    return (
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
        <label className="w-full md:w-48 text-sm text-gray-600">{label}</label>
        <div className="flex-1">{children}
        {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Pengaturan Sistem</h1>
            <p className="text-sm text-gray-500">Halaman untuk mengatur konfigurasi platform.</p>
          </div>
          {/* <div className="flex space-x-2">
            <button
              className="px-3 py-2 bg-white rounded-xl border text-sm"
              onClick={() => setActiveTab("domain")}
            >
              Buka Semua
            </button>
          </div> */}
        </div>

        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-12 md:col-span-3">
            <div className="bg-white rounded-2xl p-4 sticky top-6">
              <nav className="space-y-2">
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === "domain" ? "bg-sky-50 border border-sky-200" : "hover:bg-gray-50"}`}
                  onClick={() => setActiveTab("domain")}
                >
                  Domain & Email Server
                </button>
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === "payment" ? "bg-sky-50 border border-sky-200" : "hover:bg-gray-50"}`}
                  onClick={() => setActiveTab("payment")}
                >
                  Payment Gateway
                </button>
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === "security" ? "bg-sky-50 border border-sky-200" : "hover:bg-gray-50"}`}
                  onClick={() => setActiveTab("security")}
                >
                  Keamanan
                </button>
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === "backup" ? "bg-sky-50 border border-sky-200" : "hover:bg-gray-50"}`}
                  onClick={() => setActiveTab("backup")}
                >
                  Backup & Restore
                </button>
              </nav>
            </div>
          </aside>

          <main className="col-span-12 md:col-span-9">
            {/* DOMAIN & EMAIL */}
{activeTab === "domain" && (
              <div>
                <SectionCard
                  title="Domain & Pengaturan Email"
                  footer={
                    <div className="flex justify-end space-x-2">
                      <button
                        className="px-4 py-2 bg-white rounded-lg border"
                        onClick={() => {
                          // reset contoh
                          domainRef.current.value = "";
                          smtpHostRef.current.value = "";
                          smtpPortRef.current.value = 587;
                          smtpUserRef.current.value = "";
                          smtpPassRef.current.value = "";
                          fromEmailRef.current.value = "";
                          showToast("Form domain & email direset.");
                        }}
                      >
                        Reset
                      </button>
                      <button
                        className="px-4 py-2 bg-sky-600 text-white rounded-lg"
                        onClick={() => handleSave("Domain & Email")}
                      >
                        Simpan
                      </button>
                    </div>
                  }
                >
                  <InputRow label="Nama Domain">
                    <input
                      className="w-full rounded-md border px-3 py-2"
                      placeholder="misal: example.com"
                      ref={domainRef}
                    />
                  </InputRow>

                  <div className="pt-4 border-t" />

                  <h3 className="text-sm font-medium text-gray-700">Pengaturan SMTP</h3>
                  <InputRow label="SMTP Host">
                    <input
                      className="w-full rounded-md border px-3 py-2"
                      placeholder="smtp.mailtrap.io"
                      ref={smtpHostRef}
                    />
                  </InputRow>
                  <InputRow label="Port">
                    <input
                      type="number"
                      className="w-40 rounded-md border px-3 py-2"
                      ref={smtpPortRef}
                    />
                  </InputRow>
                  <InputRow label="Username">
                    <input
                      className="w-full rounded-md border px-3 py-2"
                      ref={smtpUserRef}
                    />
                  </InputRow>
                  <InputRow label="Password">
                    <input
                      type="password"
                      className="w-full rounded-md border px-3 py-2"
                      ref={smtpPassRef}
                    />
                  </InputRow>
                  <InputRow label="From Email">
                    <input
                      className="w-full rounded-md border px-3 py-2"
                      placeholder="no-reply@example.com"
                      ref={fromEmailRef}
                    />
                  </InputRow>
                  <div className="flex items-center space-x-3">
                    <button
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
                      onClick={handleTestSMTP}
                    >
                      Test SMTP
                    </button>
                    <span className="text-sm text-gray-400">Tes koneksi SMTP dan kirim email percobaan.</span>
                  </div>
                </SectionCard>

                <SectionCard title="Catatan & Tips">
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    <li>Pastikan DNS (A/AAAA/CNAME) mengarah ke server yang benar jika mengatur domain.</li>
                    <li>Gunakan akun email khusus untuk pengiriman notifikasi (no-reply).</li>
                    <li>Jika SMTP memerlukan TLS, pastikan port & konfigurasi di backend sesuai.</li>
                  </ul>
                </SectionCard>
              </div>
            )}

            {/* PAYMENT */}
            {activeTab === "payment" && (
              <div>
                <SectionCard
                  title="Payment Gateway"
                  footer={
                    <div className="flex justify-end space-x-2">
                      <button
                        className="px-4 py-2 bg-white rounded-lg border"
                        onClick={() => {
                          setPaymentApiKey("");
                          setPaymentMode("sandbox");
                          setPaymentProvider("midtrans");
                          showToast("Form payment direset.");
                        }}
                      >
                        Reset
                      </button>
                      <button
                        className="px-4 py-2 bg-sky-600 text-white rounded-lg"
                        onClick={() => handleSave("Payment Gateway")}
                      >
                        Simpan
                      </button>
                    </div>
                  }
                >
                  <InputRow label="Provider">
                    <select
                      className="w-full rounded-md border px-3 py-2"
                      value={paymentProvider}
                      onChange={(e) => setPaymentProvider(e.target.value)}
                    >
                      <option value="midtrans">Midtrans</option>
                      <option value="stripe">Stripe</option>
                      <option value="xendit">Xendit</option>
                      <option value="manual">Manual / Offline</option>
                    </select>
                  </InputRow>

                  <InputRow label="API Key / Secret">
                    <input
                      className="w-full rounded-md border px-3 py-2"
                      placeholder="Masukkan API key"
                      value={paymentApiKey}
                      onChange={(e) => setPaymentApiKey(e.target.value)}
                    />
                  </InputRow>

                  <InputRow label="Mode">
                    <div className="flex items-center space-x-3">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="mode"
                          value="sandbox"
                          checked={paymentMode === "sandbox"}
                          onChange={() => setPaymentMode("sandbox")}
                        />
                        <span className="ml-2 text-sm">Sandbox / Test</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="mode"
                          value="live"
                          checked={paymentMode === "live"}
                          onChange={() => setPaymentMode("live")}
                        />
                        <span className="ml-2 text-sm">Live / Produksi</span>
                      </label>
                    </div>
                  </InputRow>

                  <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg" onClick={handleTestPayment}>
                      Test Gateway
                    </button>
                    <span className="text-sm text-gray-400">Pastikan API key & mode benar sebelum pindah ke produksi.</span>
                  </div>
                </SectionCard>

                <SectionCard title="Integrasi & Developer Notes">
                  <p className="text-sm text-gray-600">Simpan callback/notify URL pada dashboard provider: <code className="bg-gray-100 px-2 py-1 rounded">https://your-domain.com/payment/callback</code></p>
                </SectionCard>
              </div>
            )}

            {/* SECURITY */}
            {activeTab === "security" && (
              <div>
                <SectionCard
                  title="Pengaturan Keamanan"
                  footer={
                    <div className="flex justify-end space-x-2">
                      <button className="px-4 py-2 bg-white rounded-lg border" onClick={() => {
                        setEnableCaptcha(true);
                        setMaxAttempts(5);
                        setBlockDurationMin(30);
                        showToast('Pengaturan keamanan direset.');
                      }}>Reset</button>
                      <button className="px-4 py-2 bg-sky-600 text-white rounded-lg" onClick={() => handleSave('Keamanan')}>Simpan</button>
                    </div>
                  }
                >
                  <InputRow label="Enable CAPTCHA">
                    <label className="inline-flex items-center space-x-3">
                      <input type="checkbox" checked={enableCaptcha} onChange={(e) => setEnableCaptcha(e.target.checked)} />
                      <span className="text-sm">Aktifkan reCAPTCHA / hCaptcha pada form pendaftaran & login</span>
                    </label>
                  </InputRow>

                  <InputRow label="Max Percobaan Login">
                    <input type="number" className="w-28 rounded-md border px-3 py-2" value={maxAttempts} onChange={(e) => setMaxAttempts(Number(e.target.value))} />
                  </InputRow>

                  <InputRow label="Durasi Blok (menit)">
                    <input type="number" className="w-28 rounded-md border px-3 py-2" value={blockDurationMin} onChange={(e) => setBlockDurationMin(Number(e.target.value))} />
                  </InputRow>

                  <div className="text-sm text-gray-500">Aturan ini akan membantu mencegah serangan brute-force. Implementasi rate-limit harus dilakukan di level API / gateway.</div>
                </SectionCard>

                <SectionCard title="Audit & Logging">
                  <p className="text-sm text-gray-600">Aktifkan logging audit untuk tindakan admin, perubahan konfigurasi, dan akses sensitif. Simpan log secara terpisah dan rotasi sesuai kebijakan retensi.</p>
                </SectionCard>
              </div>
            )}

            {/* BACKUP & RESTORE */}
            {activeTab === "backup" && (
              <div>
                <SectionCard
                  title="Backup & Restore Database"
                  footer={
                    <div className="flex justify-end space-x-2">
                      <button className="px-4 py-2 bg-white rounded-lg border" onClick={() => {
                        setLastBackup(null);
                        setBackupStatus("");
                        showToast('Status backup direset.');
                      }}>Reset Status</button>
                    </div>
                  }
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium">Backup Sekarang</h4>
                      <p className="text-sm text-gray-500">Buat snapshot data saat ini. Disarankan sebelum melakukan update besar.</p>
                      <div className="mt-3 flex items-center space-x-3">
                        <button className="px-4 py-2 bg-amber-600 text-white rounded-lg" onClick={handleBackupNow}>Backup Sekarang</button>
                        {backupStatus === 'running' && <span className="text-sm text-gray-500">Menjalankan...</span>}
                        {lastBackup && <span className="text-sm text-gray-500">Terakhir: {new Date(lastBackup).toLocaleString()}</span>}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium">Restore dari Backup</h4>
                      <p className="text-sm text-gray-500">Upload file backup (.zip / .sql) untuk merestore data. Restore dapat menimpa data saat ini — lakukan backup terlebih dahulu.</p>
                      <div className="mt-3 space-y-2">
                        <input ref={restoreInputRef} type="file" accept=".zip,.sql" />
                        <div className="flex items-center space-x-3">
                          <button className="px-4 py-2 bg-red-600 text-white rounded-lg" onClick={handleRestore}>Mulai Restore</button>
                          <button className="px-4 py-2 bg-white rounded-lg border" onClick={() => { if (restoreInputRef.current) restoreInputRef.current.value = null; showToast('File restore dihapus.'); }}>Hapus File</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Jadwal & Retensi">
                  <p className="text-sm text-gray-600">Anda dapat mengatur jadwal backup (mis: harian / mingguan) dan kebijakan retensi di bagian backend. Pastikan penyimpanan backup terenskripsi dan diuji secara berkala.</p>
                </SectionCard>
              </div>
            )}

          </main>
        </div>

        {/* Toast sederhana */}
        {toast && (
          <div className="fixed right-6 bottom-6">
            <div className={`px-4 py-2 rounded-lg shadow-lg ${toast.type === 'error' ? 'bg-red-600 text-white' : toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-white'}`}>
              {toast.message}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-400 mt-6">Versi: 1.0 — Sesuaikan integrasi API & keamanan sebelum digunakan di produksi.</div>
      </div>
    </div>
  );
}
