import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LoaderCircle, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../../api/auth/useAuth";
import apiService from "../../../api/apiService";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:2222";

const AccountSetting = () => {
  const { user, authLoading, setUser } = useAuth();

  // State untuk field yang bisa berubah (password dan file gambar)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicPreview, setProfilePicPreview] = useState(
    user?.avatarUrl ? `${SERVER_URL}${user.avatarUrl}` : null
  );
  const [profilePicFile, setProfilePicFile] = useState(null);

  // State untuk proses penyimpanan
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isAdmin =
    user.role?.name === "Super Admin" ||
    user.role?.name === "Owner" ||
    user.role?.name === "Admin";
  const dashboardLink = isAdmin ? "/dashboardadmin" : "/dashboard";

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(null);
    setSaveError(null);

    // Ambil nilai terbaru langsung dari target form
    if (newPassword && newPassword !== confirmPassword) {
      setSaveError("Konfirmasi password baru tidak cocok.");
      setIsSaving(false);
      return;
    }
    // -------------------------------------------

    const formData = new FormData(e.target);

    // Hapus field password jika kosong (agar tidak mengirim string kosong)
    if (!formData.get("password")) {
      formData.delete("password");
    }

    // Tambahkan file gambar jika ada
    if (profilePicFile) {
      formData.set("profilePicture", profilePicFile);
    }

    try {
      const response = await apiService.put(
        `/users/${user.id}/profile`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setUser(response.data.data);
      setSaveSuccess("Profil berhasil diperbarui!");

      // Kosongkan semua field password setelah sukses
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setProfilePicFile(null);
    } catch (err) {
      setSaveError(err.response?.data?.message || "Gagal menyimpan perubahan.");
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderCircle className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
        <AlertTriangle className="w-16 h-16 mb-4" />
        <h2 className="text-xl font-semibold">Data Pengguna Tidak Ditemukan</h2>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="flex flex-col flex-1 min-h-screen bg-gray-300">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
            Hi, {user.username || "Pengguna"}
          </h2>
          <p className="text-gray-700 text-center mb-6">
            Ubah informasi tentang diri Anda.
          </p>
          <form
            onSubmit={handleSave}
            className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto"
          >
            <div className="flex flex-col items-center mb-8">
              {profilePicPreview ? (
                <img
                  src={profilePicPreview}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mb-3"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-3 text-gray-500 border-4 border-white shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
              <label className="cursor-pointer text-sm text-blue-600 hover:underline">
                Ubah Foto Profil
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-6">
              Informasi Akun
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="full_name"
                  defaultValue={user.full_name || ""}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  defaultValue={user.username || ""}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={user.email || ""}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor WhatsApp
                </label>
                <input
                  type="text"
                  name="whatsapp_number"
                  defaultValue={user.whatsapp_number || ""}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                  // required
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-6">
              Ubah Password
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password Lama
                  <span className="text-xs text-gray-500">
                    {" "}
                    (Wajib diisi jika ingin ganti password)
                  </span>
                </label>
                <input
                  type="password"
                  name="currentPassword" // Nama field untuk password lama
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password" // Nama field untuk password BARU
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  name="confirmPassword" // Nama field untuk konfirmasi
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                />
              </div>
            </div>

            <div className="flex flex-col items-end mt-8">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                {isSaving ? "Menyimpan..." : "Save Changes"}
              </button>
              {saveSuccess && (
                <p className="text-green-600 mt-2 text-sm">{saveSuccess}</p>
              )}
              {saveError && (
                <p className="text-red-600 mt-2 text-sm">{saveError}</p>
              )}
            </div>

            <p className="mt-8 text-center text-sm text-gray-600">
              Kembali ke{" "}
              <Link
                to={dashboardLink}
                className="text-blue-600 hover:underline"
              >
                Dashboard
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountSetting;
