// src/api/subscription/SubscriptionModel.jsx

export function fromBackend(s) {
  return {
    id: s.id,
    slug: s.slug,
    name: s.name,
    description: s.description,
    invitation_limit: s.invitation_limit,
    allow_branding_removal: s.allow_branding_removal,
    // Ubah array 'prices' menjadi format yang lebih rapi
    prices: Array.isArray(s.prices) ? s.prices.map(p => ({
      id: p.id,
      amount: p.amount,
      interval: p.interval,
    })) : [],
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
}

export function toBackend(s) {
  // Validasi data dasar
  if (!s.slug || typeof s.slug !== 'string' || s.slug.trim() === '') {
    throw new Error('Slug tidak boleh kosong');
  }
  
  if (!s.name || typeof s.name !== 'string' || s.name.trim() === '') {
    throw new Error('Nama paket tidak boleh kosong');
  }
  
  if (!s.description || typeof s.description !== 'string' || s.description.trim() === '') {
    throw new Error('Deskripsi tidak boleh kosong');
  }
  
  const invitationLimit = parseInt(s.invitation_limit, 10);
  if (isNaN(invitationLimit) || invitationLimit < 1) {
    throw new Error('Batas undangan harus berupa angka positif');
  }

  // Payload untuk membuat atau mengupdate subscription
  const payload = {
    slug: s.slug.trim(),
    name: s.name.trim(),
    description: s.description.trim(),
    invitation_limit: invitationLimit,
    allow_branding_removal: Boolean(s.allow_branding_removal),
  };

  // Tambahkan prices jika ada
  if (s.prices && Array.isArray(s.prices)) {
    const validPrices = [];
    
    for (const price of s.prices) {
      const amount = parseFloat(price.amount);
      
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Semua harga harus berupa angka positif');
      }
      
      if (!['month', 'year'].includes(price.interval)) {
        throw new Error('Interval harga harus "month" atau "year"');
      }
      
      validPrices.push({
        amount: amount,
        interval: price.interval
      });
    }
    
    payload.prices = validPrices;
  }
  
  console.log('Subscription payload to backend:', payload);
  return payload;
}