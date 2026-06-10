// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   CheckCircle2,
//   BadgeCheck,
//   ShieldCheck,
//   ShoppingCart,
//   CreditCard,
//   Wallet,
//   QrCode,
//   ArrowRight,
//   Info,
//   HelpCircle,
//   TimerReset,
//   Phone,
//   Mail,
// } from "lucide-react";




import React, { useState } from "react";

export default function Checkout() {
  const [selectedServices, setSelectedServices] = useState([]);
  const [methodType, setMethodType] = useState("auto");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [promoCode, setPromoCode] = useState("");

  const services = [
    { id: 1, name: "Layanan VIP", price: 50000 },
    { id: 2, name: "Extra Undangan", price: 30000 },
    { id: 3, name: "Konsultasi Premium", price: 75000 },
  ];

  const autoMethods = [
    { name: "BCA", icon: "https://upload.wikimedia.org/wikipedia/commons/5/55/Bank_Central_Asia.svg" },
    { name: "Mandiri", icon: "https://upload.wikimedia.org/wikipedia/commons/9/99/Logo_Bank_Mandiri.svg" },
    { name: "BNI", icon: "https://upload.wikimedia.org/wikipedia/commons/9/95/Logo_Bank_BNI.svg" }
  ];

  const manualMethods = [
    { name: "Rekening Bank", icon: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Bank_font_awesome.svg" },
    { name: "Dana", icon: "https://upload.wikimedia.org/wikipedia/commons/4/4e/DANA_Logo.svg" },
    { name: "OVO", icon: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Logo_ovo_purple.svg" },
    { name: "Alfamart", icon: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Alfamart_logo.svg" }
  ];

  const basePrice = 100000;
  const selectedServicesTotal = selectedServices.reduce(
    (acc, id) => acc + (services.find((s) => s.id === id)?.price || 0),
    0
  );

  const discount = promoCode === "DISKON50" ? 0.5 * (basePrice + selectedServicesTotal) : 0;
  const totalPrice = basePrice + selectedServicesTotal - discount;

  const toggleService = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handlePay = () => {
    if (!paymentMethod) {
      alert("Silakan pilih metode pembayaran!");
      return;
    }
    alert(`Pembayaran berhasil! Total: Rp${totalPrice.toLocaleString("id-ID")}`);
  };

  const renderMethodOptions = (methods) => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
      {methods.map((m) => (
        <div
          key={m.name}
          onClick={() => setPaymentMethod(m.name)}
          className={`cursor-pointer flex flex-col items-center p-4 rounded-2xl shadow-md transition transform hover:scale-105 border-2 ${
            paymentMethod === m.name ? "border-blue-600 bg-blue-50" : "border-transparent bg-white"
          }`}
        >
          <img src={m.icon} alt={m.name} className="w-14 h-14 object-contain mb-2" />
          <span className={`font-medium ${paymentMethod === m.name ? "text-blue-700" : "text-gray-600"}`}>{m.name}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-3xl p-8 space-y-8">
        <h1 className="text-3xl font-extrabold text-center text-gray-800">Halaman Pembayaran</h1>

        {/* Tambah Layanan */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Tambah Layanan</h2>
          <div className="space-y-3">
            {services.map((service) => (
              <label
                key={service.id}
                className="flex items-center justify-between border rounded-xl px-5 py-3 hover:bg-blue-50 cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.id)}
                    onChange={() => toggleService(service.id)}
                    className="accent-blue-600 w-5 h-5"
                  />
                  <span className="text-gray-700 font-medium">{service.name}</span>
                </div>
                <span className="font-semibold text-gray-800">Rp{service.price.toLocaleString("id-ID")}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Metode Pembayaran */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Metode Pembayaran</h2>
          <div className="flex gap-4 mb-6 justify-center">
            <button
              onClick={() => {
                setMethodType("auto");
                setPaymentMethod("");
              }}
              className={`px-6 py-3 rounded-xl font-semibold shadow ${
                methodType === "auto"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Verifikasi Otomatis
            </button>
            <button
              onClick={() => {
                setMethodType("manual");
                setPaymentMethod("");
              }}
              className={`px-6 py-3 rounded-xl font-semibold shadow ${
                methodType === "manual"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Verifikasi Manual
            </button>
          </div>

          {methodType === "auto" ? renderMethodOptions(autoMethods) : renderMethodOptions(manualMethods)}
        </div>

        {/* Detail Pembayaran */}
        <div className="bg-gray-50 rounded-2xl p-6 space-y-2 shadow-inner">
          <p className="flex justify-between text-gray-700"><span>Harga Dasar</span><span>Rp{basePrice.toLocaleString("id-ID")}</span></p>
          {selectedServices.map((id) => {
            const service = services.find((s) => s.id === id);
            return (
              <p key={id} className="flex justify-between text-gray-700">
                <span>{service.name}</span>
                <span>Rp{service.price.toLocaleString("id-ID")}</span>
              </p>
            );
          })}
          {discount > 0 && (
            <p className="flex justify-between text-green-600 font-medium">
              <span>Diskon</span>
              <span>- Rp{discount.toLocaleString("id-ID")}</span>
            </p>
          )}
          <hr className="my-2" />
          <p className="flex justify-between font-bold text-xl text-gray-800">
            <span>Total</span>
            <span>Rp{totalPrice.toLocaleString("id-ID")}</span>
          </p>
        </div>

        {/* Kode Promo */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Kode Promo</h2>
          <input
            type="text"
            placeholder="Masukkan kode promo"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-xl px-5 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Tombol Bayar */}
        <button
          onClick={handlePay}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-2xl shadow-lg transition transform hover:scale-105"
        >
          Bayar Sekarang
        </button>
      </div>
    </div>
  );
}

