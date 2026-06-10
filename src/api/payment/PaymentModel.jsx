const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:2222";

/**
 * Mengubah data DARI backend KE format frontend
 */
export function fromBackend(p) {
  return {
    id: p.id,
    name: p.name,
    accountNumber: p.bank_account || "",
    // Langsung buat URL lengkap untuk ditampilkan
    qrCode: p.qr_code ? `${SERVER_URL}${p.qr_code}` : "", 
    active: p.isActive,
  };
}

/**
 * Mengubah data DARI frontend KE format FormData untuk backend
 */
export function toBackend(p) {
  const formData = new FormData();

  formData.append('name', p.name);
  formData.append('bank_account', p.accountNumber);
  formData.append('isActive', p.active);

  // Hanya kirim field qr_code jika ada file baru yang dipilih.
  // Jika tidak, backend tidak akan mengubah gambar yang sudah ada.
  if (p.qrCode instanceof File) {
    formData.append('qr_code', p.qrCode);
  }
  
  return formData;
}