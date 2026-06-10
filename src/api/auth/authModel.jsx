export function fromLoginResponse(backendData) {
  return {
    accessToken: backendData.accessToken,
    refreshToken: backendData.refreshToken, // Tetap ambil refreshToken jika ada
    
    // Gunakan spread operator (...) untuk menyalin semua properti dari backendData.user,
    // lalu kita bisa pastikan properti penting lainnya ada.
    user: {
      ...backendData.user, // <-- INI BARIS KUNCINYA
      
      // Pastikan nama properti konsisten
      id: backendData.user.id,
      email: backendData.user.email,
      full_name: backendData.user.full_name,
      username: backendData.user.username,
      whatsapp_number: backendData.user.whatsapp_number,
      subscription: backendData.user.subscription,
      avatarUrl: backendData.user.avatarUrl,
      role: backendData.user.role,
      accessLevels: backendData.user.accessLevels,
    },
  };
}
