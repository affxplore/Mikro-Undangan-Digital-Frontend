// src/models/DiscountModel.js

export function fromBackend(d) {
  return {
    id: d.id,
    name: d.name,
    promo: d.promo,
    voucher: d.voucher,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

// FIX BUG #4: Gunakan plain JSON bukan FormData karena route discount menggunakan upload.none()
// FormData tidak diperlukan karena tidak ada file upload di discount
export function toBackend(d) {
  return {
    name: d.name,
    promo: d.promo,
    voucher: d.voucher,
  };
}
