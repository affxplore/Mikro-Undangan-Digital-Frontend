// src/models/DiscountModel.js

export function fromBackend(d) {
  return {
    id: d.id,
    name: d.name,
    promo: d.promo,
    voucher: d.voucher,
<<<<<<< HEAD
    createdAt: d.createdAt,
=======
    createdAt: d.createdAt,  // backend sudah camelCase
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
    updatedAt: d.updatedAt,
  };
}

<<<<<<< HEAD
// FIX BUG #4: Gunakan plain JSON bukan FormData karena route discount menggunakan upload.none()
// FormData tidak diperlukan karena tidak ada file upload di discount
export function toBackend(d) {
  return {
    name: d.name,
    promo: d.promo,
    voucher: d.voucher,
  };
=======
export function toBackend(d) {
  const formData = new FormData();
  formData.append("name", d.name);
  formData.append("promo", d.promo);
  formData.append("voucher", d.voucher);
  return formData;
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
}
