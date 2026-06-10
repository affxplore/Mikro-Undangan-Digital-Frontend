import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../api/auth/useAuth'; 
import { Loader, Eye, EyeOff } from 'lucide-react'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    whatsapp_number: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const [errors, setErrors] = useState({
    whatsapp_number: '',
    password: '',
    confirm_password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // inline validation
    if (name === "password") {
      checkPasswordStrength(value);
      if (value.length < 8) {
        setErrors((prev) => ({ ...prev, password: "Password minimal 8 karakter" }));
      } else if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/\d/.test(value)) {
        setErrors((prev) => ({ ...prev, password: "Harus ada huruf besar, kecil, dan angka" }));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    }

    if (name === "confirm_password") {
      if (value !== formData.password) {
        setErrors((prev) => ({ ...prev, confirm_password: "Password tidak sama" }));
      } else {
        setErrors((prev) => ({ ...prev, confirm_password: "" }));
      }
    }

    if (name === "whatsapp_number") {
      if (!/^\d+$/.test(value)) {
        setErrors((prev) => ({ ...prev, whatsapp_number: "Nomor hanya boleh angka" }));
      } else if (value.length < 12) {
        setErrors((prev) => ({ ...prev, whatsapp_number: "Nomor WhatsApp minimal 12 digit" }));
      } else {
        setErrors((prev) => ({ ...prev, whatsapp_number: "" }));
      }
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = "";
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNum = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);

    if (password.length >= 12 && hasUpper && hasLower && hasNum && hasSpecial) {
      strength = "Kuat 💪";
    } else if (password.length >= 8 && hasUpper && hasLower && hasNum) {
      strength = "Sedang 🙂";
    } else if (password.length > 0) {
      strength = "Lemah ⚠️";
    }
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  if (errors.password || errors.whatsapp_number || errors.confirm_password) {
    toast.error("Periksa kembali form yang masih salah!");
    setLoading(false);
    return;
  }

  try {
    await register(formData);
    toast.success("Registrasi berhasil! 🎉");

    // kasih delay sebelum navigate
    setTimeout(() => {
      navigate('/otp', { state: { email: formData.email } });
    }, 2000); // delay 2 detik
  } catch (err) {
    toast.error(err.message || 'Terjadi kesalahan saat registrasi.');
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
        <h2 className="text-lg font-bold mb-4 text-center">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-medium mb-1">Nama Lengkap</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-xs font-medium mb-1">Nomor WhatsApp</label>
            <input
              type="text"
              name="whatsapp_number"
              value={formData.whatsapp_number}
              onChange={handleChange}
              required
              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.whatsapp_number && (
              <p className="text-xs text-red-600 mt-0.5">{errors.whatsapp_number}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-500"
              >
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-600 mt-0.5">{errors.password}</p>
            )}
            {passwordStrength && !errors.password && (
              <p
                className={`text-xs mt-0.5 ${
                  passwordStrength.includes("Kuat")
                    ? "text-green-600"
                    : passwordStrength.includes("Sedang")
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {passwordStrength}
              </p>
            )}
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label className="block text-xs font-medium mb-1">Konfirmasi Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 pr-8"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-2 text-gray-500"
              >
                {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="text-xs text-red-600 mt-0.5">{errors.confirm_password}</p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-1.5 rounded-lg hover:bg-blue-700 transition flex justify-center items-center disabled:bg-blue-300 text-sm"
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin" size={16} /> : 'Register'}
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="text-xs text-gray-600">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default RegisterPage;

