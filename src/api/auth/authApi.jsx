import apiService from '../apiService';

export const loginRequest = (credentials) => {
  return apiService.post('/auth/login', credentials);
};

export const registerRequest = (userData) => {
  return apiService.post('/auth/register', userData);
};

// --- TAMBAHKAN FUNGSI INI ---
/**
 * Mengirim refresh token ke endpoint logout untuk dicabut.
 * @param {string} refreshToken
 */
export const apiLogout = (refreshToken) => {
  // Backend mengharapkan objek dengan properti 'token'
  return apiService.post('/auth/logout', { token: refreshToken });
};
