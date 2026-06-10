// import apiService from "../apiService";
// import { useCallback, useState } from "react";
// import { fromBackend, toBackend } from "./systemContentModel"; // Impor toBackend


// const apiContent = {
//   getList: (params) => apiService.get("/system-contents", { params }),
//   postCreate: (payload) => apiService.post("/system-contents", payload),
//   putUpdate: (id, payload) => apiService.put(`/system-contents/${id}`, payload),
//   removeContent: (id) => apiService.delete(`/system-contents/${id}`),
// };

// export default function useSystemContent() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [pagination, setPagination] = useState({});
//   const [error, setError] = useState(null);

//   const getList = useCallback(async (params = {}) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await apiContent.getList(params);
//       const listData = res.data?.data || [];
//       const paginationData = res.data?.pagination || {};
//       // ===== TAMBAHKAN CONSOLE LOG DI SINI =====
//       console.log("Data mentah dari backend:", listData);
      
//       const mappedData = listData.map(fromBackend);
      
//       console.log("Data setelah di-map (siap tampil):", mappedData);
//       // =========================================
//       setData(listData.map(fromBackend)); // fromBackend akan membuat URL gambar lengkap
//       setPagination(paginationData);
//     } catch (err) {
//       setError(err);
//       console.error("Gagal mengambil daftar system-content :", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // UBAH FUNGSI INI
//   const postCreate = useCallback(async ( ContentData) => {
//     setLoading(true);
//     setError(null);
//     // Biarkan hook yang membuat FormData
//     const formData = toBackend(ContentData);
//     try {
//       await apiContent.postCreate(formData);
//     } catch (err) {
//       setError(err);
//       console.error("Gagal membuat content:", err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // UBAH FUNGSI INI
//   const putUpdate = useCallback(async (id, ContentData) => {
//     setLoading(true);
//     setError(null);
//     // Biarkan hook yang membuat FormData
//     const formData = toBackend(ContentData);
//     try {
//       await apiContent.putUpdate(id, formData);
//     } catch (err) {
//       setError(err);
//       console.error(`Gagal mengupdate content ${id}:`, err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const removeContent = useCallback(async (id) => {
//     setError(null);
//     try {
//       await apiContent.removeContent(id);
//     } catch (err) {
//       setError(err);
//       console.error(`Gagal menghapus content ${id}:`, err);
//       throw err;
//     }
//   }, []);

//   return {
//     data,
//     loading,
//     pagination,
//     error,
//     getList,
//     postCreate,
//     putUpdate,
//     removeContent,
//   };
// }


// src/api/system-content/useSystemContent.jsx

import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import apiService from "../apiService";
import { fromBackend, toBackend } from "./systemContentModel";

const API_URL = "/system-contents";

const apiContent = {
  getList: (params) => apiService.get(API_URL, { params }),
  getByKey: (key) => apiService.get(API_URL, { params: { filter: JSON.stringify({ key }) } }), // <-- Fungsi API baru
  getTypes: () => apiService.get(`${API_URL}/types`), // <-- Tambahkan definisi ini
  postCreate: (payload) => apiService.post(API_URL, payload),
  putUpdate: (id, payload) => apiService.put(`${API_URL}/${id}`, payload),
  removeContent: (id) => apiService.delete(`${API_URL}/${id}`),
};

export default function useSystemContent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState(null);

  const getList = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Pastikan parameter 'sort' diteruskan ke API
      const queryParams = {
        page: params.page,
        limit: params.limit,
        filter: params.filter,
        sort: params.sort, // <-- Tambahkan ini
      };
      const res = await apiService.get(API_URL, { params: queryParams });
      const listData = res.data?.data || [];
      const paginationData = res.data?.pagination || {};

      setData(listData.map(fromBackend));
      setPagination(paginationData);
    } catch (err) {
      setError(err);
      console.error("Gagal mengambil daftar system content:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getByKey = useCallback(async (key) => {
    try {
      const res = await apiContent.getByKey(key);
      console.log(`[HOOK-LOG] Respons mentah dari API untuk key '${key}':`, res.data);
      
      const list = res.data?.data || [];
      if (list.length > 0) {
        return fromBackend(list[0]); // Kembalikan hanya item pertama yang ditemukan
      }
      return null; // Kembalikan null jika tidak ada
    } catch (err) {
      console.error(`Gagal mengambil konten dengan key: ${key}`, err);
      return null;
    }
  }, []);

  const getTypes = useCallback(async () => {
    try {
      const res = await apiContent.getTypes();
      return res.data?.data || []; // Kembalikan array of strings
    } catch (err) {
      console.error("Gagal mengambil tipe konten:", err);
      return []; // Kembalikan array kosong jika gagal
    }
  }, []);

  // Ganti nama dari 'postCreate' menjadi 'create'
  const create = useCallback(async (contentData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = toBackend(contentData);
      const res = await apiService.post(API_URL, payload);
      const newData = fromBackend(res.data.data);
      setData(prev => [...prev, newData]); // Perbarui state lokal
      toast.success("Konten baru berhasil dibuat!");
      return newData;
    } catch (err) {
      setError(err);
      toast.error(err.response?.data?.meta?.message || "Gagal membuat konten.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Ganti nama dari 'putUpdate' menjadi 'update'
  const update = useCallback(async (id, contentData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = toBackend(contentData);
      const res = await apiService.put(`${API_URL}/${id}`, payload);
      const updatedData = fromBackend(res.data.data);
      setData(prev => prev.map(item => item.id === id ? updatedData : item)); // Perbarui state lokal
      toast.success("Konten berhasil diperbarui!");
      return updatedData;
    } catch (err) {
      setError(err);
      toast.error(err.response?.data?.meta?.message || "Gagal memperbarui konten.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Ganti nama dari 'removeContent' menjadi 'remove'
  const remove = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.delete(`${API_URL}/${id}`);
      setData(prev => prev.filter(item => item.id !== id)); // Perbarui state lokal
      toast.success("Konten berhasil dihapus!");
    } catch (err) {
      setError(err);
      toast.error(err.response?.data?.meta?.message || "Gagal menghapus konten.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    pagination,
    error,
    getList,
    getByKey, // Fungsi baru untuk mendapatkan konten berdasarkan key
    getTypes, // Fungsi baru untuk mendapatkan tipe konten
    create, // Nama baru
    update, // Nama baru
    remove, // Nama baru
  };
}