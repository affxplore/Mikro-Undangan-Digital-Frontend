import axios from "axios";
import { getAuth, setAuth, clearAuth } from "../utils/jwt"; // Pastikan helper ini diimpor

// Ambil URL base dari .env
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2222/api/v1";

// Buat instance Axios
const apiService = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Interceptor untuk otomatis menambahkan token ke setiap request
apiService.interceptors.request.use(
  (config) => {
    // 1. Ambil seluruh string auth dari localStorage
    const authString = localStorage.getItem("auth");

    if (authString) {
      // 2. Parse string tersebut menjadi objek
      const authData = JSON.parse(authString);
      // 3. Ambil properti 'accessToken' dari objek tersebut
      const token = authData?.accessToken;

      // 4. Jika token ada, tempelkan ke header
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor response untuk menangani refresh token
apiService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Cek jika error adalah 403 (token invalid/expired) dan belum pernah di-retry
    // if (error.response?.status === 403 && !originalRequest._retry) {
    if (error.response?.status === 401 && !originalRequest._retry) {
 
      originalRequest._retry = true; // Tandai agar tidak terjadi loop refresh tak terbatas

      try {
        // Panggil endpoint refresh-token
        const { data } = await apiService.get("/auth/refresh-token");
        const newAccessToken = data.accessToken;

        // --- INI BAGIAN UTAMA PERBAIKANNYA ---
        // 1. Ambil data auth lama dari localStorage
        const currentAuth = getAuth(); 
        if (currentAuth) {
            // 2. Buat objek auth baru dengan token yang diperbarui
            const newAuthData = {
                ...currentAuth,
                accessToken: newAccessToken,
            };
            // 3. Simpan kembali objek utuh ke localStorage
            setAuth(newAuthData); 
        }
        // --- AKHIR PERBAIKAN ---

        // Perbarui header di request yang gagal dengan token baru
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Ulangi request yang gagal tersebut
        return apiService(originalRequest);

      } catch (refreshError) {
        // Jika refresh token juga gagal, logout pengguna
        console.error("Sesi habis atau refresh token gagal. Silakan login kembali.");
        clearAuth(); // Hapus data auth dari storage
        window.location.href = "/login"; // Redirect paksa ke halaman login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiService;