
// export function fromBackend(u) {
//     return {
//         id: u.id,
//         username: u.username,
//         full_name: u.fullname,
//         whatsapp_number: u.noWa,
//         // profilePicture: null,
//         role_id: u.role,
//         email: u.email,
//         isActive: u.active,
//         subscription: u.Sub,
//     //     createdAt: 2025-08-28T02:11:13.068Z,
//     //     updatedAt: 2025-08-28T02:11:13.068Z,
//     //     role : u.role
//     // }
// }}

// export function toBackend(a) {
//     return {
//         username: a.username,
//         full_name : u.fullname,
//         whatsapp_number: u.noWa,
//         email: u.email,
//         isActive: u.active,
//         subscription : u.Sub,
//         role_id: u.role,


//         // full_name:RioPras
//         // whatsapp_number:0812345634
//         // password:rioprasss
//         // role_id:3
//         // email:rioprasset123@gmail.com
//         // isActive:true
//         // subscription:free
//     }
// }


// /**
//  * Mengubah format data user dari backend ke format yang lebih mudah digunakan di frontend.
//  * @param {object} userFromApi - Satu objek user dari respons API backend.
//  */
// export function fromBackend(userFromApi) {
//   // Pastikan data yang masuk valid
//   if (!userFromApi) return null;
  
//   return {
//     id: userFromApi.id,
//     username: userFromApi.username,
//     full_name: userFromApi.full_name, // FIX: Sesuaikan dengan nama field dari backend
//     whatsapp_number: userFromApi.whatsapp_number, // FIX: Sesuaikan dengan nama field dari backend
//     profilePicture: userFromApi.profilePicture, // Tambahkan ini
//     role: userFromApi.role, // Backend mengirim objek role
//     role_id: userFromApi.role_id,
//     email: userFromApi.email,
//     isActive: userFromApi.isActive,
//     subscription: userFromApi.subscription,
//     createdAt: userFromApi.createdAt,
//     updatedAt: userFromApi.updatedAt,
//   };
// }

// /**
//  * Mengubah format data dari form frontend ke format yang diterima backend.
//  * @param {object} userFromForm - Satu objek user dari state form di frontend.
//  */
// export function toBackend(userFromForm) {
//   if (!userFromForm) return null;

//   return {
//     username: userFromForm.username,
//     full_name: userFromForm.full_name, // FIX: Menggunakan 'userFromForm' bukan 'u'
//     whatsapp_number: userFromForm.whatsapp_number,
//     email: userFromForm.email,
//     isActive: userFromForm.isActive,
//     subscription: userFromForm.subscription,
//     role_id: userFromForm.role_id,
//     // Password biasanya dikirim terpisah atau hanya saat membuat/mengedit
//   };
// }

// File: src/api/users/userModel.jsx

const SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:2222";

/**
 * Mengubah format data user dari backend ke format yang lebih mudah digunakan di frontend.
 */
export function fromBackend(userFromApi) {
  if (!userFromApi) return null;
  
  return {
    id: userFromApi.id,
    username: userFromApi.username,
    // Gunakan nama properti yang konsisten di frontend, misal: 'nama'
    nama: userFromApi.full_name, 
    no_telp: userFromApi.whatsapp_number,
    // Buat URL lengkap untuk gambar profil
    profilePicture: userFromApi.profilePicture ? `${SERVER_URL}${userFromApi.profilePicture}` : null,
    // Ambil nama role jika role adalah objek
    role: userFromApi.role?.name || userFromApi.role, 
    role_id: userFromApi.role_id,
    email: userFromApi.email,
    status: userFromApi.isActive, // Gunakan 'status' agar konsisten dengan komponen
    subscription: userFromApi.subscription,
    createdAt: userFromApi.createdAt,
    updatedAt: userFromApi.updatedAt,
  };
}

/**
 * Mengubah format data dari form frontend ke format yang diterima backend.
 */
export function toBackend(userFromForm) {
  if (!userFromForm) return null;

  const payload = {
    username: userFromForm.username,
    full_name: userFromForm.nama,
    whatsapp_number: userFromForm.no_telp,
    email: userFromForm.email,
    isActive: userFromForm.status,
    role_id: userFromForm.role_id, // Pastikan form mengirim role_id
  };
  
  // Hanya sertakan password jika diisi (untuk create atau update password)
  if (userFromForm.password) {
    payload.password = userFromForm.password;
  }

  return payload;
}