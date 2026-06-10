// export function fromBackend(k) {
//     return {
//             id: k.id,   
//             name: k.name,
//             img_icon: k.img,
            
//     }
// }

// export function toBackend(k){
//     return { 
//             name:k.name,
//             img_icon: k.img


//     }
// }



// Ambil URL API lengkap dari environment variable
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2222/api/v1";

// Buat URL server dasar dengan menghapus path API
// Ini akan menghasilkan: http://localhost:2222
const SERVER_BASE_URL = new URL(API_URL).origin;

/**
 * Mengubah data DARI backend KE format frontend
 */
export function fromBackend(k) {
  // Ambil path dari backend, contoh: '/public/uploads/kategori/icon.png'
  const originalPath = k.img_icon;
  let finalUrl = null;

  if (originalPath) {
     finalUrl = `${SERVER_BASE_URL}${originalPath}`;
  }

  return {
    id: k.id,
    name: k.name,
    iconImg: finalUrl,
  };
}

/**
 * Mengubah data DARI frontend KE format FormData untuk backend
 */
export function toBackend(categoryData) {
  const formData = new FormData();
  formData.append('name', categoryData.name);
  if (categoryData.iconFile instanceof File) {
    formData.append('img_icon', categoryData.iconFile);
  }
  return formData;
}