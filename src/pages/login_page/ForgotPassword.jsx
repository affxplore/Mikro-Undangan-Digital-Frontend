// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// // contoh API service lu, sesuaikan sama project
// import { forgotPassword } from "../../api/auth/authApi";

// export default function ForgotPassword() {
//   const [formData, setFormData] = useState({ email: "" });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.email || formData.email.length < 5) {
//       toast.error("Email / nomor WA tidak valid");
//       return;
//     }

//     try {
//       setLoading(true);
//       await forgotPassword(formData); // panggil API

//       toast.success("Kode OTP telah dikirim, silakan cek inbox/WA kamu!");
//       setTimeout(() => {
//         navigate("/otp"); // arahkan ke halaman OTP lu
//       }, 2000);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Gagal mengirim OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="bg-white p-6 rounded-xl shadow-md w-96">
//         <h2 className="text-xl font-semibold text-center mb-4">Forgot Password</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email / Nomor WA
//             </label>
//             <input
//               type="text"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Masukkan email atau nomor WA"
//               className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
//           >
//             {loading ? "Mengirim..." : "Kirim OTP"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }






// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { Loader } from "lucide-react";

// const ForgotPasswordPage = () => {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [successMsg, setSuccessMsg] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccessMsg("");

//     try {
//       // TODO: sambungkan dengan forgotPasswordRequest
//       await new Promise((resolve) => setTimeout(resolve, 1500)); // simulasi delay

//       setSuccessMsg("Link reset password sudah dikirim ke email kamu 📧");
//       setTimeout(() => {
//         navigate("/otp"); // setelah success redirect ke halaman OTP
//       }, 2500);
//     } catch (err) {
//       setError("Gagal mengirim permintaan reset password.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center bg-cover bg-center"
//       style={{ backgroundImage: "url('/pict/BG-v1.jpg')" }}
//     >
//       <div className="max-w-xs w-full bg-white shadow-2xl rounded-xl p-4">
//         <h2 className="text-lg font-bold mb-4 text-center">Lupa Password</h2>

//         <form onSubmit={handleSubmit} className="space-y-3">
//           <div>
//             <label className="block text-xs font-medium mb-1">
//               Email / WhatsApp
//             </label>
//             <input
//               type="text"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
//               placeholder="Masukkan email atau nomor WA"
//             />
//           </div>

//           {error && <p className="text-xs text-red-600">{error}</p>}
//           {successMsg && <p className="text-xs text-green-600">{successMsg}</p>}

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-1.5 rounded-lg hover:bg-blue-700 transition flex justify-center items-center disabled:bg-blue-300 text-sm"
//             disabled={loading}
//           >
//             {loading ? <Loader className="animate-spin" size={16} /> : "Kirim"}
//           </button>
//         </form>

//         <div className="text-center mt-3">
//           <p className="text-xs text-gray-600">
//             Ingat password?{" "}
//             <Link to="/login" className="text-blue-600 hover:underline">
//               Login
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader } from 'lucide-react';
import apiService from '../../api/apiService';

const ForgotPasswordPage = () => {
    // State untuk input, bisa berisi email atau nomor WA
    const [identifier, setIdentifier] = useState('');
    const [loading, setLoading] = useState(false);
    // State dipisah untuk pesan sukses dan error
    const [successMsg, setSuccessMsg] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMsg('');
        setError('');

        try {
            // NOTE: Backend Anda saat ini mencari berdasarkan 'email'. 
            // Jika Anda ingin bisa mencari berdasarkan nomor WA juga,
            // Anda perlu update backend. Untuk saat ini, kita tetap kirim
            // dengan key 'email' agar tidak error.
            const response = await apiService.post('/auth/forgot-password', { email: identifier });
            
            // Set pesan sukses jika berhasil
            setSuccessMsg(response.data.message);
        } catch (err) {
            // Set pesan error jika gagal
            const serverError = err.response?.data?.message || "Terjadi kesalahan. Coba lagi nanti.";
            setError(serverError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('/pict/BG-v1.jpg')" }}
        >
            <div className="max-w-xs w-full bg-white shadow-2xl rounded-xl p-4">
                <h2 className="text-lg font-bold mb-4 text-center">Lupa Password</h2>
                
                {/* Form hanya ditampilkan jika belum ada pesan sukses.
                  Ini mencegah user mengirim form berulang kali.
                */}
                {!successMsg && (
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium mb-1">
                                Email / WhatsApp
                            </label>
                            <input
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Masukkan email atau nomor WA"
                            />
                        </div>

                        {error && <p className="text-xs text-red-600 text-center">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-1.5 rounded-lg hover:bg-blue-700 transition flex justify-center items-center disabled:bg-blue-300 text-sm"
                            disabled={loading}
                        >
                            {loading ? <Loader className="animate-spin" size={16} /> : "Kirim"}
                        </button>
                    </form>
                )}
                
                {/* Tampilkan pesan sukses di sini jika ada */}
                {successMsg && <p className="text-sm text-green-700 text-center py-4">{successMsg}</p>}

                <div className="text-center mt-3">
                    <p className="text-xs text-gray-600">
                        Ingat password?{" "}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;