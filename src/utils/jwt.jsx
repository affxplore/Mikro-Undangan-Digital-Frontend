// export const AU_LS_KEY = "au"; // konsisten dgn useAuth kamu

// export function getAuth() {
//   try { return JSON.parse(localStorage.getItem(AU_LS_KEY) || "null"); }
//   catch { return null; }
// }

// export function setAuth(data) {
//   if (!data) return localStorage.removeItem(AU_LS_KEY);
//   localStorage.setItem(AU_LS_KEY, JSON.stringify(data));
// }

// export function clearAuth() {
//   localStorage.removeItem(AU_LS_KEY);
// }

// export function parseJwt(token) {
//   try {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split('')
//         .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
//         .join('')
//     );
//     return JSON.parse(jsonPayload);
//   } catch { return null; }
// }

// export function isTokenExpired(token) {
//   const p = parseJwt(token);
//   if (!p?.exp) return true; // if no exp, consider expired for security
//   const now = Math.floor(Date.now() / 1000);
//   return p.exp <= now;
// }

// export function isAuthenticated() {
//   const au = getAuth();
//   const token = au?.accesstoken; // matches your localStorage structure
//   if (!token) return false;
//   return !isTokenExpired(token);
// }

// export function getAccessToken() {
//   const au = getAuth();
//   return au?.accesstoken || null; // matches your localStorage structure
// }

// // Kunci yang akan kita gunakan di localStorage
// const AUTH_STORAGE_KEY = 'auth';

// /**
//  * Mengambil data autentikasi dari localStorage.
//  */
// export function getAuth() {
//   try {
//     const authString = localStorage.getItem(AUTH_STORAGE_KEY);
//     return authString ? JSON.parse(authString) : null;
//   } catch (error) {
//     console.error("Gagal mengambil data auth dari storage", error);
//     return null;
//   }
// }

// /**
//  * Menyimpan data autentikasi ke localStorage.
//  * @param {object} authData - Data auth untuk disimpan.
//  */
// export function setAuth(authData) {
//   try {
//     localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
//   } catch (error) {
//     console.error("Gagal menyimpan data auth ke storage", error);
//   }
// }

// /**
//  * Menghapus data autentikasi dari localStorage.
//  */
// export function clearAuth() {
//   localStorage.removeItem(AUTH_STORAGE_KEY);
// }

// // -- Fungsi utilitas murni (tidak berinteraksi dengan state) --

// export function parseJwt(token) {
//   try {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
//     return JSON.parse(jsonPayload);
//   } catch {
//     return null;
//   }
// }

// export function isTokenExpired(token) {
//   const payload = parseJwt(token);
//   if (!payload?.exp) return true;
//   const nowInSeconds = Math.floor(Date.now() / 1000);
//   return payload.exp <= nowInSeconds;
// }

// Kunci yang akan kita gunakan di localStorage

// Kunci yang akan kita gunakan di localStorage
const AUTH_STORAGE_KEY = 'auth';

/**
 * Mengambil data autentikasi dari localStorage.
 */
export function getAuth() {
  try {
    const authString = localStorage.getItem(AUTH_STORAGE_KEY);
    return authString ? JSON.parse(authString) : null;
  } catch (error) {
    console.error("Gagal mengambil data auth dari storage", error);
    return null;
  }
}

/**
 * Menyimpan data autentikasi ke localStorage.
 * @param {object} authData - Data auth untuk disimpan.
 */
export function setAuth(authData) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
  } catch (error) {
    console.error("Gagal menyimpan data auth ke storage", error);
  }
}

/**
 * Menghapus data autentikasi dari localStorage.
 */
export function clearAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

// -- Fungsi utilitas murni (tidak berinteraksi dengan state) --

export function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const payload = parseJwt(token);
  if (!payload?.exp) return true;
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= nowInSeconds;
}