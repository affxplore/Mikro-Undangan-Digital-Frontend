// src/models/DiscountModel.js

export function fromBackend(d) {
  return {
    id: d.id,
    name: d.name,
    promo: d.promo,
    voucher: d.voucher,
    createdAt: d.createdAt,  // backend sudah camelCase
    updatedAt: d.updatedAt,
  };
}

export function toBackend(d) {
  const formData = new FormData();
  formData.append("name", d.name);
  formData.append("promo", d.promo);
  formData.append("voucher", d.voucher);
  return formData;
}
