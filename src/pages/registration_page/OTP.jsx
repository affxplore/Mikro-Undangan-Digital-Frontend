// const OtpPage = () => {
//   return (
//     <>
//       <div className="bg-gray-100 flex items-center justify-center min-h-screen">
//         <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//           <h1 className="text-2xl font-bold mb-4">Verify OTP</h1>
//           <p className="mb-6">
//             Enter the OTP sent to your email: <b></b>
//           </p>

//           <form action="otp.php" method="POST">
//             <div className="mb-4">
//               <input
//                 type="text"
//                 name="otp"
//                 placeholder="Enter OTP"
//                 required
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//               />
//             </div>
//             <button
//               type="submit"
//               name="verify"
//               className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300"
//             >
//               Verify OTP
//             </button>
//           </form>

//           <form action="otp_verification.php" method="POST" className="mt-4">
//             <button
//               type="submit"
//               name="resend"
//               className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
//               disabled
//             >
//               Resend OTP
//             </button>
//           </form>

//           <p className="text-sm text-gray-500 mt-4">
//             OTP expires in <span id="countdown">90</span> seconds.
//           </p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default OtpPage;

// Lokasi: pages/registration_page/OTP.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiService from '../../api/apiService'; // Impor axios instance

const OtpPage = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(60);

    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    // Timer countdown untuk tombol resend
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Redirect jika halaman diakses langsung tanpa data email
    useEffect(() => {
        if (!email) navigate('/register');
    }, [email, navigate]);

    // Handler untuk submit form verifikasi
    const handleVerifySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await apiService.post('/auth/verify-otp', { email, otp });
            alert("Verifikasi berhasil! Silakan login.");
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || "Verifikasi gagal.");
        } finally {
            setLoading(false);
        }
    };

    // Handler untuk tombol resend OTP
    const handleResendOtp = async () => {
        setResendLoading(true);
        setError('');
        try {
            await apiService.post('/auth/request-otp', { email });
            alert("OTP baru telah dikirim.");
            setCountdown(60); // Reset timer
        } catch (err) {
            setError(err.response?.data?.message || "Gagal mengirim ulang OTP.");
        } finally {
            setResendLoading(false);
        }
    };

    return (
         <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('/pict/BG-v1.jpg')" }}
        >
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-2">Verifikasi Email</h2>
                <p className="text-center text-sm text-gray-600 mb-6">Masukkan kode OTP yang dikirim ke {email}</p>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleVerifySubmit}>
                    <input
                        type="text"
                        placeholder="Masukkan 6 digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        className="w-full border px-3 py-2 rounded mb-4 text-center"
                        required
                    />
                    <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded disabled:bg-gray-400">
                        {loading ? 'Memverifikasi...' : 'Verifikasi'}
                    </button>
                </form>

                <button
                    onClick={handleResendOtp}
                    disabled={countdown > 0 || resendLoading}
                    className="w-full text-blue-600 mt-4 text-center disabled:text-gray-400"
                >
                    {resendLoading ? 'Mengirim...' : (countdown > 0 ? `Kirim ulang dalam ${countdown} detik` : 'Kirim Ulang OTP')}
                </button>
            </div>
        </div>
    );
};

export default OtpPage;