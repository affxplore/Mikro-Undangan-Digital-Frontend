import React, {
  useState,
  useCallback,
  useMemo,
  useContext,
  createContext,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest, registerRequest, apiLogout } from "./authApi.jsx";
import { fromLoginResponse } from "./authModel.jsx";
import {
  getAuth,
  setAuth as setAuthInStorage,
  clearAuth,
} from "../../utils/jwt.jsx";
import { isTokenExpired, parseJwt } from "../../utils/jwt.jsx";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getAuth);
  // 1. Tambahkan state untuk loading autentikasi awal
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  // 2. Gunakan useEffect untuk mengubah status loading setelah komponen pertama kali di-mount
  useEffect(() => {
    // Logika di sini bisa lebih kompleks jika Anda perlu memvalidasi token ke backend
    // Tapi untuk sekarang, kita hanya menandakan bahwa pengecekan awal dari localStorage selesai.
    setAuthLoading(false);
  }, []); // Array dependensi kosong [] memastikan ini hanya berjalan sekali

  const login = useCallback(
    async (credentials) => {
      try {
        const response = await loginRequest(credentials);
        const authData = fromLoginResponse(response.data.data);

        setAuthInStorage(authData);
        setAuth(authData);

        const userRole = authData.user.role?.name;
        if (userRole === "Super Admin" || userRole === "Owner") {
          navigate("/dashboardadmin");
        } else {
          navigate("/dashboard");
        }
        return authData;
      } catch (err) {
        console.error("Login failed:", err);
        throw err.response?.data || new Error("Login gagal");
      }
    },
    [navigate]
  );

  const register = useCallback(async (userData) => {
    const response = await registerRequest(userData);
    return response; // return ke RegisterPage
  }, []);

  const logout = useCallback(() => {
    const currentAuth = getAuth();
    if (currentAuth?.refreshToken) {
      apiLogout(currentAuth.refreshToken).catch((err) =>
        console.error("API logout failed:", err)
      );
    }
    clearAuth();
    setAuth(null);
    navigate("/login");
  }, [navigate]);

  const loginWithToken = useCallback(
    (token) => {
      console.log("useAuth/loginWithToken: Menerima token:", token);

      // 1. Decode token untuk mendapatkan data user
      const userData = parseJwt(token);
      console.log(
        "useAuth/loginWithToken: Hasil decode token (userData):",
        userData
      );

      if (userData) {
        // 2. Buat data auth yang akan disimpan
        const authData = {
          accessToken: token,
          user: {
            id: userData.id,
            full_name: userData.name,
            email: userData.email,
            username: userData.username,
            role: { name: userData.role },
            permissions: userData.permissions,
            avatarUrl: userData.avatarUrl,
             subscription: userData.subscription,
          },
        };

        // 3. Simpan ke storage dan state
        setAuthInStorage(authData);
        setAuth(authData);

        console.log(
          `useAuth/loginWithToken: Role terdeteksi '${userData.role}', mengarahkan ke dashboard...`
        );

        // 4. Arahkan ke dashboard yang sesuai
        if (
          userData.role === "Super Admin" ||
          userData.role === "Owner" ||
          userData.role === "Admin"
        ) {
          navigate("/dashboardadmin");
        } else {
          navigate("/dashboard");
        }
      } else {
        console.error(
          "useAuth/loginWithToken: Gagal decode token atau role tidak ditemukan, logout."
        );

        // Jika token tidak valid
        logout();
      }
    },
    [navigate, logout]
  );

  const value = useMemo(
    () => ({
      auth,
      isAuthenticated: !!(
        auth?.accessToken && !isTokenExpired(auth.accessToken)
      ),
      user: auth?.user,
      authLoading, // 3. Ekspor state 'authLoading' agar bisa digunakan oleh komponen lain
      login,
      register,
      logout,
      loginWithToken,
      setUser: (newUserData) => {
        // Fungsi untuk update user, berguna di AccountSetting
        const currentAuth = getAuth();
        if (currentAuth) {
          const newAuth = { ...currentAuth, user: newUserData };
          setAuthInStorage(newAuth);
          setAuth(newAuth);
        }
      },
    }),
    [auth, authLoading, login, register, logout, loginWithToken]
  ); // Tambahkan authLoading ke dependensi useMemo

  return (
    <AuthContext.Provider value={value}>
      {/* Tahan render children sampai loading selesai untuk pengalaman yang lebih mulus */}
      {!authLoading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
