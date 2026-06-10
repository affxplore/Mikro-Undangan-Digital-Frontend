// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { User, LoaderCircle, AlertTriangle } from "lucide-react";
// import  {useUsers}  from "../../../api/users/useUsers";

// const ProfilePage = () => {
//   const {
//         data,
//         loading,
//         pagination,
//         error,
//         getList,
//         // getById,
//         // create,
//         // update,
//         // delete
//   } = useUsers();
//   // State untuk data, status loading, dan pesan error
//   // const [loading, setLoading] = useState(true);
//   // const [error, setError] = useState(null);
//   // useEffect(() => {

//     const user = data[0]

//   // }, []);

//   // Fungsi helper untuk menentukan style badge berdasarkan tipe langganan
//   const getSubscriptionStyles = (subscription) => {
//     // Menggunakan toLowerCase() agar tidak case-sensitive ('Pro' atau 'pro' akan sama)
//     switch (subscription?.toLowerCase()) {
//       case "pro":
//         return "bg-yellow-500 text-white"; // Emas/Kuning untuk level tertinggi
//       case "lite":
//         return "bg-green-500 text-white"; // Hijau untuk level menengah
//       case "basic":
//         return "bg-blue-500 text-white"; // Biru untuk level dasar berbayar
//       case "free":
//         return "bg-gray-500 text-white"; // Abu-abu untuk gratis
//       default:
//         return "bg-slate-400 text-white"; // Warna default jika nilainya tidak dikenali
//     }
//   };

//   // Tampilan saat data sedang dimuat
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <LoaderCircle className="w-12 h-12 animate-spin text-blue-500" />
//       </div>
//     );
//   }

//   // Tampilan jika terjadi error
//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
//         <AlertTriangle className="w-16 h-16 mb-4" />
//         <h2 className="text-xl font-semibold">Terjadi Kesalahan</h2>
//         <p>{error}</p>
//       </div>
//     );
//   }

//   // Tampilan jika user tidak ditemukan setelah loading selesai
//   if (!user) {
//     return <div className="text-center p-10">Profil tidak ditemukan.</div>;
//   }

//   const profileImageUrl = user.profilePicture
//     ? `${API_BASE_URL}${user.profilePicture}`
//     : null;

//   return (
//     <div className="bg-white min-h-screen flex justify-center items-center p-4 w-full">
//       <div className="bg-blue-300 rounded-2xl shadow-lg w-full max-w-2xl relative p-8 pt-20">
//         {/* Foto Profil & Label Langganan */}
//         <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
//           {/* 1. Tambahkan pembungkus 'relative' di sini */}
//           <div className="relative">
//             {/* Div untuk foto profil */}
//             <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
//               {profileImageUrl ? (
//                 <img
//                   src={profileImageUrl}
//                   alt="Foto Profil"
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <User className="w-14 h-14 text-gray-400" />
//               )}
//             </div>

//             {/* 2. Pindahkan 'span' ke dalam pembungkus 'relative' */}
//             {user.subscription && (
//               <span
//                 // 3. Ganti class untuk positioning absolut
//                 className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-4 py-1 text-sm font-semibold rounded-full shadow-md ${getSubscriptionStyles(
//                   user.subscription
//                 )}`}
//               >
//                 {user.subscription.charAt(0).toUpperCase() +
//                   user.subscription.slice(1)}
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Grid Data User */}
//         <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <div className="mb-6">
//               <div className="border border-black rounded-lg bg-white text-black p-3">
//                 <label className="block text-sm text-gray-600">
//                   Nama Lengkap
//                 </label>
//                 <p className="font-bold">{user.full_name || "-"}</p>
//               </div>
//             </div>
//             <div className="mb-6">
//               <div className="border border-black rounded-lg bg-white text-black p-3">
//                 <label className="block text-sm text-gray-600">Email</label>
//                 <p className="font-bold">{user.email || "-"}</p>
//               </div>
//             </div>
//           </div>
//           <div>
//             <div className="mb-6">
//               <div className="border border-black rounded-lg bg-white text-black p-3">
//                 <label className="block text-sm text-gray-600">Username</label>
//                 <p className="font-bold">@{user.username || "-"}</p>
//               </div>
//             </div>
//             <div className="mb-6">
//               <div className="border border-black rounded-lg bg-white text-black p-3">
//                 <label className="block text-sm text-gray-600">
//                   Nomor WhatsApp
//                 </label>
//                 <p className="font-bold">{user.whatsapp_number || "-"}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tombol Kembali */}
//         <div className="mt-6 flex justify-center">
//           <Link
//             to="/dashboard"
//             className="bg-white text-blue-600 px-6 py-2 rounded-lg shadow hover:bg-gray-100 transition"
//           >
//             Kembali ke Dashboard
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

import React from "react";
import { Link } from "react-router-dom";
import { User, LoaderCircle, AlertTriangle } from "lucide-react";
import { useAuth } from "../../../api/auth/useAuth"; // 1. Ganti import

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:2222";

const ProfilePage = () => {
  // 2. Ambil data 'user' dan 'loading' langsung dari konteks Auth
  const { user, authLoading } = useAuth();

  // Fungsi helper untuk badge (tidak berubah)
  const getSubscriptionStyles = (subscription) => {
    // --- PERBAIKAN DI SINI ---
    // 1. Ambil nama subscription, baik itu string langsung atau dari properti .name di dalam objek.
    const subscriptionName =
      typeof subscription === "string" ? subscription : subscription?.name;

    // 2. Gunakan subscriptionName yang sudah pasti string untuk switch case.
    switch (subscriptionName?.toLowerCase()) {
      case "business":
        return "bg-gradient-to-br from-blue-400 to-fuchsia-500 text-white";
      case "pro":
        return "bg-gradient-to-t from-cyan-500 to-amber-400";
      case "basic":
        return "bg-gradient-radial from-[#EEAECA] to-[#94BBE9]";
      case "lite":
        return "bg-blue-500 text-white";
      case "free":
        return "bg-gray-500 text-blue-400";
      default:
        return "bg-slate-400 text-white";
    }
  };

  // Tampilan saat data sedang dimuat
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderCircle className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  // Tampilan jika user tidak ditemukan
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
        <AlertTriangle className="w-16 h-16 mb-4" />
        <h2 className="text-xl font-semibold">Profil tidak ditemukan.</h2>
        <p>Silakan login kembali untuk melihat profil Anda.</p>
      </div>
    );
  }

  const isAdmin = user.role?.name === 'Super Admin' || user.role?.name === 'Owner' || user.role?.name === 'Admin';
  const dashboardLink = isAdmin ? '/dashboardadmin' : '/dashboard';

  // 3. Sesuaikan nama variabel agar cocok dengan JSX Anda
  const profileImageUrl = user.avatarUrl
    ? `${SERVER_URL}${user.avatarUrl}`
    : null;

  // 4. TAMPILAN JSX ANDA (TIDAK ADA YANG DIUBAH)
  return (
    <div className="bg-white min-h-screen flex justify-center items-center p-4 w-full">
      <div className="bg-blue-300 rounded-2xl shadow-lg w-full max-w-2xl relative p-8 pt-20">
        {/* Foto Profil & Label Langganan */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <div className="relative">
            <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Foto Profil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-14 h-14 text-gray-400" />
              )}
            </div>
            {user.subscription && (
              <span
                className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-4 py-1 text-sm font-semibold rounded-full shadow-md ${getSubscriptionStyles(
                  user.subscription
                )}`}
              >
                {/* --- PERBAIKAN DI SINI --- */}
                {/* Tampilkan nama subscription dengan cara yang aman */}
                {(typeof user.subscription === "string"
                  ? user.subscription
                  : user.subscription?.name
                )
                  ?.charAt(0)
                  .toUpperCase() +
                  (typeof user.subscription === "string"
                    ? user.subscription
                    : user.subscription?.name
                  )?.slice(1)}
                {/* ------------------------- */}
              </span>
            )}
          </div>
        </div>

        {/* Grid Data User */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-6">
              <div className="border border-black rounded-lg bg-white text-black p-3">
                <label className="block text-sm text-gray-600">
                  Nama Lengkap
                </label>
                <p className="font-bold">{user.full_name || "-"}</p>
              </div>
            </div>
            <div className="mb-6">
              <div className="border border-black rounded-lg bg-white text-black p-3">
                <label className="block text-sm text-gray-600">Email</label>
                <p className="font-bold">{user.email || "-"}</p>
              </div>
            </div>
          </div>
          <div>
            <div className="mb-6">
              <div className="border border-black rounded-lg bg-white text-black p-3">
                <label className="block text-sm text-gray-600">Username</label>
                <p className="font-bold">@{user.username || "-"}</p>
              </div>
            </div>
            <div className="mb-6">
              <div className="border border-black rounded-lg bg-white text-black p-3">
                <label className="block text-sm text-gray-600">
                  Nomor WhatsApp
                </label>
                <p className="font-bold">{user.whatsapp_number || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tombol Kembali */}
        <div className="mt-6 flex justify-center gap-10">
          <Link
            to={dashboardLink}
             className="bg-white text-blue-600 px-6 py-2 rounded-lg shadow hover:bg-gray-100 transition"
              >
            Kembali ke Dashboard
          </Link>
            <Link
            to="/dashboard/accountset" // Link ke AccountSetting tetap sama
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Edit Profil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
