import React, { useState } from 'react';
<<<<<<< HEAD
import { Link, useNavigate } from 'react-router-dom';
=======
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Digabung jadi satu baris
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
import { Loader } from 'lucide-react';
import { useAuth } from '../../api/auth/useAuth';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();
<<<<<<< HEAD
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

=======
  const location = useLocation(); // Tambahkan ini agar variabel 'from' tidak error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Tentukan arah redirect setelah login sukses
  const from = location.state?.from?.pathname || "/dashboard"; 

>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = () => {
<<<<<<< HEAD
        // Arahkan ke endpoint backend yang akan me-redirect ke Google
        window.location.href = 'http://localhost:2222/api/v1/auth/google';
    };
=======
    // Arahkan ke endpoint backend yang akan me-redirect ke Google
    window.location.href = 'http://localhost:2222/api/v1/auth/google';
  };
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
<<<<<<< HEAD
=======
      // Redirect ke tujuan sebelumnya atau dashboard
      navigate(from, { replace: true });
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
    } catch (err) {
      if (err.response?.data?.code === 'ACCOUNT_PENDING') {
        setError("Akun belum aktif. Silakan verifikasi terlebih dahulu.");
        navigate('/otp', { state: { email: form.email } });
      } else {
        setError(err.message || 'Email atau password salah.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/pict/BG-v1.jpg')" }}
    >
<<<<<<< HEAD
      {/* Card Login */}
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md text-gray-800">
        
=======
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md text-gray-800">
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
        <h2 className="text-2xl font-bold text-center mb-2">Login</h2>
        <p className="text-center text-gray-500 mb-6">
          Please enter your Login and your Password
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
<<<<<<< HEAD
          {/* Email */}
=======
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
          <div className="mb-4">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Username or E-mail"
              className="w-full bg-white border border-gray-300 text-gray-700 placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

<<<<<<< HEAD
          {/* Password */}
=======
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
          <div className="mb-2">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full bg-white border border-gray-300 text-gray-700 placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

<<<<<<< HEAD
          {/* Forgot password */}
          <div className="flex justify-end mb-6">
            <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
=======
          <div className="flex justify-end mb-6">
            <Link to="/forgot-password" university className="text-sm text-blue-500 hover:underline">
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
              Forgot password?
            </Link>
          </div>

<<<<<<< HEAD
          {/* Submit */}
=======
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 active:bg-green-700 disabled:bg-green-300 flex justify-center items-center transition"
          >
            {loading ? <Loader className="animate-spin h-5 w-5" /> : 'Login'}
          </button>
        </form>

        <div className="relative flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

<<<<<<< HEAD
        {/* Or sign in with Google */}
        <div className="">
=======
        <div>
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition text-gray-700"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="h-5 w-5"
            />
            <span className="font-medium">Sign-in with Google</span>
          </button>
        </div>

<<<<<<< HEAD
        {/* Register */}
=======
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
        <p className="mt-6 text-center text-gray-600">
          Not a member yet?{' '}
          <Link to="/regis" className="text-blue-500 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default LoginPage;





























































{/* 

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Loader } from 'lucide-react';
// import { useAuth } from '../../api/auth/useAuth'; // <-- Gunakan hook sentral

// const LoginPage = () => {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const { login } = useAuth(); // Ambil fungsi login dari konteks
//   const navigate = useNavigate(); 
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//    const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     try {
//       await login(form);
//       // Navigasi sukses dihandle oleh hook useAuth
//     } catch (err) {
//       // --- PENANGANAN ERROR BARU ---
//       if (err.response?.data?.code === 'ACCOUNT_PENDING') {
//         setError("Akun belum aktif. Silakan verifikasi terlebih dahulu.");
//         // Arahkan ke halaman OTP, kirim email agar halaman OTP tahu email mana yang harus diverifikasi/dikirim ulang
//         navigate('/otp', { state: { email: form.email } });
//       } else {
//         setError(err.message || 'Email atau password salah.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
//         <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
//         {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
//         <div className="mb-4">
//           <label>Email</label>
//           <input
//             type="email"
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//             required
//           />
//         </div>
//         <div className="mb-6">
//           <label>Password</label>
//           <input
//             type="password"
//             name="password"
//             value={form.password}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//             required
//           />
//         </div>
        
//         <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 flex justify-center items-center">
//           {loading ? <Loader className="animate-spin" /> : 'Login'}
//         </button>
        
//         <p className="mt-4 text-center text-sm">
//           Belum punya akun?{' '}
//           <Link to="/regis" className="text-blue-600 hover:underline">
//             Register
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default LoginPage; */}
=======
export default LoginPage;
>>>>>>> 8850f48e5a09b0d1f89544b880aff14bec030b6d
