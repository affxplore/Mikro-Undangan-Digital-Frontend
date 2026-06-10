import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import temp1 from '../../assets/img/temp-wedding1.avif'
import ultah from '../../assets/img/temp-ultah1.jpg';
import natal from '../../assets/img/temp-natal1.jpg';
import LandingNav from '../../components/LandingNavbar';
import LandingFoot from '../../components/LandingFoot';


export default function LandingPage() {
  const [faqOpen, setFaqOpen] = useState({});
  const toggleFaq = (index) => {
    setFaqOpen(prev => ({ ...prev, [index]: !prev[index] }));
  };

  
  const categories = [
    { title: 'Pernikahan', img :temp1 },
    { title: 'Ulang Tahun', img: ultah},
    { title: 'Natal', img: natal },     
  ];
  const featured = Array.from({ length: 8 }).map((_, i) => ({
    title: `Template ${i + 1}`,
    img: temp1
  }));
  const faqs = [
    'Bagaimana cara membuat undangan kustom secara online?',
    'Informasi penting apa saja yang harus saya sertakan dalam undangan saya?',
    'Bisakah saya mempersonalisasi template undangan saya?',
    'Apakah platform Anda menawarkan fitur RSVP terintegrasi?'
  ];

  return (
    <>
      {/* Navbar */}
<<<<<<< HEAD
     

      {/* Hero */}
      <header className="pt-24 pb-16 bg-gradient-to-br from-blue-300 to-white">
=======
    

      {/* Hero */}
      <header className="pt-24 pb-16 bg-gradien-to-br from-blue-300 to-white">
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
        <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 text-blue-600">Buat Undangan Online Cepat Tanpa Ribet..</h1>
            <h3 className="text-2xl lg:text-2xl font-semibold mb-4 text-blue-600">
              Tersedia Berbagai Macam Template Untuk Berbagai Acara </h3>
            {/* <p className="text-gray-600 mb-6">Buat undangan online gratis yang menakjubkan dan sederhanakan manajemen tamu.</p> */}
            <div className="flex max-w-md">
              <input type="text" placeholder="Cari template" className="flex-1 px-4 py-3 rounded-l-lg border border-gray-800 focus:outline-none" />
              <button className="px-6 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition">Cari</button>
            </div>
          </div>
          <div className="flex-1 text-center">
            <img src="../src/assets/img/contoh.png" alt="preview" className="mx-auto rounded-2xl shadow-blue-500 " />
          </div>
        </div>
      </header>

      {/* Categories */}
      <section className="py-16"> 
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-blue-600">Temukan Kategori Undangan Populer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map(cat => (
              <div key={cat.title} className="border rounded-2xl overflow-hidden hover:shadow-xl transition">
                <img src={cat.img} alt={cat.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{cat.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-blue-600">Desain Menarik Untuk Berbagai Acara</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition">
                <img src={item.img} alt={item.title} className="w-full h-64 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Lihat Semua Template</button>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">Pertanyaan yang Sering Diajukan</h2>
          <div className="space-y-4">
            {faqs.map((q, i) => (
              <div key={i} className="border-b pb-4">
                <button onClick={() => toggleFaq(i)} className="w-full text-left flex justify-between items-center py-2">
                  <span className="font-medium">{q}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-600 transform ${faqOpen[i] ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {faqOpen[i] && <p className="mt-2 text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-black py-15">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white mb-4 md:mb-0">© MikroUndangan.com 2025. All rights reserved.</p>
          <ul className="flex flex-wrap space-x-6 text-white">
            {['Hubungi Kami', 'Pusat Bantuan', 'Kebijakan Privasi', 'Syarat & Ketentuan'].map(item => (
              <li key={item}><a href="#">{item}</a></li>
            ))}
          </ul>
        </div>
      </footer> */}

      
      </>
  );
}
