// src/api/subscription/SubscriptionModel.jsx
// import React, { useState, useEffect } from 'react';

// export function fromBackend(s) {
//   if (!s) return null;
//   return {
//     id: s.id,
//     slug: s.slug,
//     name: s.name,
//     description: s.description,
//     invitation_limit: s.invitation_limit,
//     allow_branding_removal: s.allow_branding_removal,

    // Ubah array 'prices' menjadi format yang lebih rapi

//     prices: Array.isArray(s.prices) ? s.prices.map(p => ({
//       id: p.id,
//       amount: p.amount,
//       interval: typeof p.interval === 'object' ? p.interval.interval : p.interval,
//     })) : [],
//     createdAt: s.createdAt,
//     updatedAt: s.updatedAt,
//   };
// }

// export function toBackend(s) {

  // Validasi data dasar

//   if (!s.slug || typeof s.slug !== 'string' || s.slug.trim() === '') {
//     throw new Error('Slug tidak boleh kosong');
//   }
  
//   if (!s.name || typeof s.name !== 'string' || s.name.trim() === '') {
//     throw new Error('Nama paket tidak boleh kosong');
//   }
  
//   if (!s.description || typeof s.description !== 'string' || s.description.trim() === '') {
//     throw new Error('Deskripsi tidak boleh kosong');
//   }
  
//   const invitationLimit = parseInt(s.invitation_limit, 10);
//   if (isNaN(invitationLimit) || invitationLimit < 1) {
//     throw new Error('Batas undangan harus berupa angka positif');
//   }
// }

  // Payload untuk membuat atau mengupdate subscription

  // const payload = {
  //   slug: s.slug.trim(),
  //   name: s.name.trim(),
  //   description: s.description.trim() || '',
  //   invitation_limit: invitationLimit,
  //   allow_branding_removal: Boolean(s.allow_branding_removal),
  // };

    // Di dalam komponen SubscriptionModal

  // const SubscriptionModal = ({ isOpen, initialData, onSave, onCancel, refreshList, updateWithPrices }) => {
  // const [form, setForm] = useState({
  //   id: initialData?.id || null,
  //   slug: initialData?.slug || '',
  //   name: initialData?.name || '',
  //   description: initialData?.description || '',
  //   invitation_limit: initialData?.invitation_limit || 0,
  //   allow_branding_removal: initialData?.allow_branding_removal || false,
  
    // PASTIKAN BARIS INI SEPERTI INI:

//   prices: initialData?.prices || [] 
// });

//   return (
//     <div className="modal">
//       <h2>{form.id ? 'Edit Paket' : 'Tambah Paket'}</h2>
      
//       {/* Gunakan optional chaining sebelum .map */}
//       {form.prices?.map((p, index) => (
//         <div key={index}>
//           <p>{p.interval}: {p.amount}</p>
//         </div>
//       ))}

//       <button onClick={onCancel}>Batal</button>
//       <button onClick={() => onSave(form)}>Simpan</button>
//     </div>
//   );
// };

  // Tambahkan prices jika ada

//   if (s.prices && Array.isArray(s.prices)) {
//     const validPrices = [];
    
//     for (const price of s.prices) {
//       const amount = parseFloat(price.amount);

//       let rawInterval = price.interval;

// if (rawInterval && typeof rawInterval === 'object') {
//       rawInterval = rawInterval.interval;
//     }
      
//   let interval = String(rawInterval || "").toLowerCase().trim();
//     if (['bulanan', 'bulan', 'monthly', 'month'].includes(interval)) {
//       interval = 'month'; 
//   } else if (['tahunan', 'tahun', 'yearly', 'year'].includes(interval)) {
//       interval = 'year';
//   }
    
// if (!['month', 'year'].includes(interval)) {
//       throw new Error(`Interval "${interval}" tidak valid. Gunakan "month" atau "year"`);
//     }

//     validPrices.push({
//       amount: amount,
//       interval: interval
//     });
//   }
  
//   payload.prices = validPrices;
// }

  
//   console.log('Subscription payload to backend:', payload);
//   return payload;
// }






// Hapus import React, useState, useEffect dari sini! 
// File Model hanya untuk fungsi logika (Logic Only), bukan komponen.

export function fromBackend(s) {
  if (!s) return null;
  return {
    id: s.id,
    slug: s.slug,
    name: s.name,
    description: s.description || '',
    invitation_limit: s.invitation_limit || 0,
    allow_branding_removal: Boolean(s.allow_branding_removal),
    prices: Array.isArray(s.prices) ? s.prices.map(p => ({
      id: p.id,
      amount: p.amount,
      // Jika interval adalah objek dari backend, ambil properti interval-nya
      interval: typeof p.interval === 'object' ? p.interval.interval : p.interval,
    })) : [],
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
}

export function toBackend(s) {
  // 1. Validasi Dasar
  if (!s.slug?.trim()) throw new Error('Slug tidak boleh kosong');
  if (!s.name?.trim()) throw new Error('Nama paket tidak boleh kosong');
  
  const invitationLimit = parseInt(s.invitation_limit, 10);
  if (isNaN(invitationLimit) || invitationLimit < 1) {
    throw new Error('Batas undangan harus berupa angka positif');
  }

  // 2. Siapkan Payload Dasar
  const payload = {
    slug: s.slug.trim(),
    name: s.name.trim(),
    description: s.description?.trim() || '',
    invitation_limit: invitationLimit,
    allow_branding_removal: Boolean(s.allow_branding_removal),
  };

  // 3. Tambahkan prices jika ada (Logika masuk ke dalam fungsi)
  if (s.prices && Array.isArray(s.prices)) {
    const validPrices = [];
    
    for (const price of s.prices) {
      const amount = parseFloat(price.amount);
      let rawInterval = price.interval;

      // Proteksi jika interval berupa objek
      if (rawInterval && typeof rawInterval === 'object') {
        rawInterval = rawInterval.interval;
      }
      
      let interval = String(rawInterval || "").toLowerCase().trim();
      
      // Normalisasi teks ke format backend
      if (['bulanan', 'bulan', 'monthly', 'month'].includes(interval)) {
        interval = 'month'; 
      } else if (['tahunan', 'tahun', 'yearly', 'year'].includes(interval)) {
        interval = 'year';
      }
        
      if (!['month', 'year'].includes(interval)) {
        throw new Error(`Interval "${interval}" tidak valid.`);
      }

      validPrices.push({
        amount: amount,
        interval: interval
      });
    }
    
    payload.prices = validPrices;
  }

  return payload; // Mengembalikan objek data ke pemanggil
}