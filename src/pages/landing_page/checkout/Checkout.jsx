import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; 
// Pastikan path import ini benar sesuai struktur folder kamu
import usePayment from "../../../api/payment/usePayment.jsx";
import bcaLogo from "../../../assets/img/bca.jpg";
import mandiriLogo from "../../../assets/img/mandiri.jpg";
import bniLogo from "../../../assets/img/bni.jpg";
import danaLogo from "../../../assets/img/dana.jpg";
import ovoLogo from "../../../assets/img/ovo.jpg";

export default function Checkout() {
  const { state } = useLocation();
  
  // Ambil data dari hook custom kamu
  // Jika loading, kita berikan fallback agar tidak error
  const paymentHook = usePayment();
  const dbPayments = paymentHook?.data || [];
  const getList = paymentHook?.getList;

  // 1. Data dari Halaman Sebelumnya (Price.jsx)
  // Mengambil harga dasar dan nama paket secara dinamis
  const basePrice = Number(state?.amount) || 0;
  const packageName = state?.packageName || "Paket Belum Dipilih";
  const intervalText = state?.interval || "Terpilih";

  // 2. State Management
  const [selectedServices, setSelectedServices] = useState([]);
  const [methodType, setMethodType] = useState("auto"); // "auto" atau "manual"
  const [paymentMethod, setPaymentMethod] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [selectedPaymentDetail, setSelectedPaymentDetail] = useState(null);

  // Load data rekening dari database saat komponen dipasang
  useEffect(() => {
    if (getList) getList();
  }, [getList]); 

  const services = [
    { id: 1, name: "Layanan VIP", price: 50000 },
    { id: 2, name: "Extra Undangan", price: 30000 },
    { id: 3, name: "Konsultasi Premium", price: 75000 },
  ];

  const autoMethods = [
    { name: "BCA", icon: bcaLogo },
    { name: "Mandiri", icon: mandiriLogo },
    { name: "BNI", icon: bniLogo }
  ];

  const manualMethods = [
    { name: "Dana", icon: danaLogo },
    { name: "OVO", icon: ovoLogo },
  ];

  // 3. Logika Perhitungan Harga Otomatis
  const selectedServicesTotal = selectedServices.reduce(
    (acc, id) => acc + (services.find((s) => s.id === id)?.price || 0),
    0
  );

  const discount = promoCode === "DISKON50" ? 0.5 * (basePrice + selectedServicesTotal) : 0;
  const totalPrice = basePrice + selectedServicesTotal - discount;

  // 4. Handlers
  const toggleService = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // FUNGSI SAAT KLIK BANK/E-WALLET
  const selectPayment = (methodName) => {
    setPaymentMethod(methodName);
    
    // Mencari data detail (nomor rekening) dari database yang namanya cocok dengan yang diklik
    if (dbPayments) {
      const detail = dbPayments.find(p => 
        p.name.toLowerCase().includes(methodName.toLowerCase())
      );
      setSelectedPaymentDetail(detail);
    }
  };

  const handlePay = () => {
    if (!paymentMethod) {
      alert("Silakan pilih metode pembayaran terlebih dahulu!");
      return;
    }
    alert(`Pesanan ${packageName} dikonfirmasi! Total: Rp${totalPrice.toLocaleString("id-ID")}`);
  };

  const renderMethodOptions = (methods) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-3">
      {methods.map((m) => (
        <div
          key={m.name}
          onClick={() => selectPayment(m.name)}
          className={`cursor-pointer flex flex-col items-center p-4 rounded-2xl shadow-sm transition transform hover:scale-105 border-2 ${
            paymentMethod === m.name ? "border-blue-600 bg-blue-50" : "border-gray-100 bg-white"
          }`}
        >
          <img src={m.icon} alt={m.name} className="w-12 h-12 object-contain mb-2" />
          <span className={`text-xs font-bold ${paymentMethod === m.name ? "text-blue-700" : "text-gray-600"}`}>{m.name}</span>
        </div>
      ))}
    </div>
  );

  return (
    /* PERBAIKAN: pt-24 agar tidak mepet navbar */
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 flex justify-center items-start p-4 font-sans">
      
      <div className="bg-white shadow-2xl rounded-[2.5rem] w-full max-w-5xl p-6 md:p-10 flex flex-col md:flex-row gap-10">
        
        {/* KOLOM KIRI: FORM */}
        <div className="flex-1 space-y-8">
          <header>
            <h1 className="text-3xl font-black text-gray-800">Halaman Pembayaran</h1>
            <p className="text-gray-500 text-sm">Selesaikan pembayaran untuk mengaktifkan paket Anda.</p>
          </header>

          {/* Layanan Tambahan */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Layanan Tambahan</h2>
            <div className="space-y-3">
              {services.map((service) => (
                <label key={service.id} className="group flex items-center justify-between border rounded-2xl px-5 py-4 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer transition-all">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.id)}
                      onChange={() => toggleService(service.id)}
                      className="accent-blue-600 w-5 h-5"
                    />
                    <span className="text-gray-700 font-semibold">{service.name}</span>
                  </div>
                  <span className="font-bold text-gray-500">+Rp{service.price.toLocaleString("id-ID")}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Pilih Metode */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Metode Pembayaran</h2>
            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-4 w-fit">
              <button
                onClick={() => { setMethodType("auto"); setPaymentMethod(""); setSelectedPaymentDetail(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${methodType === "auto" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}
              >
                Otomatis
              </button>
              <button
                onClick={() => { setMethodType("manual"); setPaymentMethod(""); setSelectedPaymentDetail(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${methodType === "manual" ? "bg-white text-purple-600 shadow-sm" : "text-gray-500"}`}
              >
                Manual
              </button>
            </div>
            {methodType === "auto" ? renderMethodOptions(autoMethods) : renderMethodOptions(manualMethods)}
          </section>

          {/* INSTRUKSI PEMBAYARAN: Muncul saat Bank diklik & Hapus Pulse */}
          {paymentMethod && selectedPaymentDetail && (
            <div className="p-6 bg-blue-600 rounded-3xl text-white shadow-lg animate-in fade-in duration-500">
              <p className="text-blue-100 text-xs font-medium uppercase tracking-wider">Transfer Ke {paymentMethod}:</p>
              <div className="mt-4 p-4 bg-white/10 rounded-2xl border border-white/20">
                <p className="text-2xl font-mono font-black tracking-widest text-center">
                  {selectedPaymentDetail.bank_account}
                </p>
                <p className="text-center text-xs mt-2 text-blue-100">A/N {selectedPaymentDetail.name}</p>
              </div>
              <p className="text-[10px] mt-4 opacity-80 italic text-center">
                *Pastikan nominal transfer sesuai dengan total tagihan di ringkasan.
              </p>
            </div>
          )}
        </div>

        {/* KOLOM KANAN: RINGKASAN */}
        <div className="md:w-80 bg-slate-50 rounded-[2rem] p-8 flex flex-col justify-between border border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Ringkasan</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{packageName} ({intervalText})</span>
                <span className="font-bold text-gray-800 text-right">Rp{basePrice.toLocaleString("id-ID")}</span>
              </div>
              
              {selectedServices.map((id) => {
                const s = services.find((srv) => srv.id === id);
                return (
                  <div key={id} className="flex justify-between text-xs animate-in slide-in-from-right-2">
                    <span className="text-gray-400">{s.name}</span>
                    <span className="font-semibold text-gray-600">Rp{s.price.toLocaleString("id-ID")}</span>
                  </div>
                );
              })}

              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600 font-bold">
                  <span>Diskon Promo</span>
                  <span>-Rp{discount.toLocaleString("id-ID")}</span>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-end mb-8">
                <span className="text-gray-400 text-xs font-bold uppercase">Total Bayar</span>
                <span className="text-2xl font-black text-blue-600">
                  Rp{totalPrice.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Kode Promo"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <button
                  onClick={handlePay}
                  className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
                >
                  BAYAR SEKARANG
                </button>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 text-center mt-8">
            Keamanan data Anda terjamin. <br /> <span className="underline">Kebijakan Privasi</span>
          </p>
        </div>

      </div>
    </div>
  );
}