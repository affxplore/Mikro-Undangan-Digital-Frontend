// import { useCallback, useState } from "react";
// import apiService from "../apiService";
// import { fromBackend, toBackend } from "./UcapanTamuModels";

// const API_URL = "/ucapan_tamus";

// const apiGuestMessage = {
//   getList: (params) => apiService.get(API_URL, { params }),
//   getById: (id) => apiService.get(`${API_URL}/${id}`),
//   create: (payload) => apiService.post(API_URL, payload),
//   update: (id, payload) => apiService.put(`${API_URL}/${id}`, payload),
//   remove: (id) => apiService.delete(`${API_URL}/${id}`),
// };

// export default function useUcapanTamu() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalRows: 0, limit: 10 });
//   const [error, setError] = useState(null);

//   const getList = useCallback(async (params = {}) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const query = {
//         page: params.page || pagination.currentPage,
//         limit: params.limit || pagination.limit,
//       };
//       const res = await apiGuestMessage.getList(query);
//       const list = res?.data?.data || [];
//       const pag = res?.data?.pagination || {};

//       setData(list.map(fromBackend));
//       setPagination({
//         currentPage: pag.currentPage || query.page,
//         totalPages: pag.totalPages || 1,
//         totalRows: pag.totalRows || list.length,
//         limit: query.limit,
//       });
//     } catch (err) {
//       setError(err);
//       console.error("Failed to fetch Guest Message:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [pagination.limit, pagination.currentPage]);

//   const create = useCallback(async (subData) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const payload = toBackend(subData);
//       const res = await apiGuestMessage.create(payload);
//       await getList();
//       return res?.data?.data;
//     } catch (err) {
//       setError(err);
//       console.error("Failed to create Guest Message:", err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, [getList]);

//   const update = useCallback(async (id, subData) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const payload = toBackend(subData);
//       const res = await apiGuestMessage.update(id, payload);
//       await getList(); // Refetch after updating
//       return res?.data?.data;
//     } catch (err) {
//       setError(err);
//       console.error("Failed to update Guest Message:", err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, [getList]);

//   const remove = useCallback(async (id) => {
//     setLoading(true);
//     setError(null);
//     try {
//       await apiGuestMessage.remove(id);
//       await getList(); // Refetch after removing
//     } catch (err) {
//       setError(err);
//       console.error("Failed to delete Guest Message:", err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, [getList]);

//   return {
//     data,
//     loading,
//     pagination,
//     error,
//     getList,
//     create,
//     update,
//     remove,
//   };
// }

// // src/api/ucapan tamu/useUcapanTamu.jsx
// import { useState, useCallback } from "react";
// import apiGuestMessage from "../apiService";
// import { fromBackend } from "./UcapanTamuModels";

// export default function useUcapanTamu(defaultInvitationId) {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalRows: 0,
//     limit: 10,
//   });
//   const [error, setError] = useState(null);

//   const getList = useCallback(
//     async (params = {}) => {
//       setLoading(true);
//       setError(null);
//       try {
//         const query = {
//           invitation_id: defaultInvitationId, // ✅ selalu pakai default
//           page: params.page || pagination.currentPage,
//           per_page: params.per_page || pagination.limit,
//         };

//         const res = await apiGuestMessage.getList(query);
//         const list = res?.data?.data || [];
//         const pag = res?.data?.pagination || {};

//         setData(list.map(fromBackend));
//         setPagination({
//           currentPage: pag.currentPage || query.page,
//           totalPages: pag.totalPages || 1,
//           totalRows: pag.totalRows || list.length,
//           limit: query.per_page,
//         });
//       } catch (err) {
//         setError(err);
//         console.error("❌ Failed to fetch Guest Message:", err);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [defaultInvitationId, pagination.currentPage, pagination.limit]
//   );

//   const remove = useCallback(
//     async (id) => {
//       try {
//         await apiGuestMessage.remove(id, { invitation_id: defaultInvitationId });
//         await getList(); // refresh data
//       } catch (err) {
//         console.error("❌ Failed to delete Guest Message:", err);
//       }
//     },
//     [defaultInvitationId, getList]
//   );

//   return {
//     data,
//     loading,
//     pagination,
//     error,
//     getList,
//     remove,
//   };
// }

// src/api/ucapanTamu/useUcapanTamu.jsx

import { useState, useCallback } from "react";
import apiService from "../apiService";
import { fromBackend, toBackend } from "./UcapanTamuModels";

// Definisikan endpoint API di satu tempat
const API_ENDPOINT = "/ucapan_tamus";

export default function useUcapanTamu() {
  // Hapus defaultInvitationId jika tidak selalu digunakan
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState(null);

  const getList = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Menyesuaikan dengan cara backend menerima filter
      const queryParams = {
        page: params.page || 1,
        limit: params.limit || 10,
        filter: JSON.stringify({
          invitation_id: params.invitation_id, // Wajib ada sesuai controller
          search: params.search || undefined,
        }),
      };

      // Panggil endpoint menggunakan apiService
      const res = await apiService.get(API_ENDPOINT, { params: queryParams });
 console.log('[useInvitations] Respons API mentah:', res); // <-- LOG 1

      const list = res?.data?.data || [];
      const pag = res?.data?.pagination || {};

      setData(list.map(fromBackend));
      setPagination(pag);

      return res.data;

    } catch (err) {
      setError(err);
      
      console.error("❌ Gagal mengambil daftar Ucapan Tamu:", err);
      // Jika backend mengirim pesan error, tampilkan
      if (err.response?.data?.meta?.message) {
        alert(`Error: ${err.response.data.meta.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (ucapanData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = toBackend(ucapanData);
      const res = await apiService.post(API_ENDPOINT, payload);
      return fromBackend(res.data.data); // Kembalikan data yang baru dibuat
    } catch (err) {
      setError(err);
      console.error("❌ Gagal membuat Ucapan Tamu:", err);
      throw err; // Lemparkan error agar bisa ditangani di komponen
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id, ucapanData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = toBackend(ucapanData);
      const res = await apiService.put(`${API_ENDPOINT}/${id}`, payload);
      return fromBackend(res.data.data);
    } catch (err) {
      setError(err);
      console.error(`❌ Gagal mengupdate Ucapan Tamu ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.delete(`${API_ENDPOINT}/${id}`);
      // Opsi: refresh daftar setelah menghapus
      // getList({ invitation_id: ... });
    } catch (err) {
      setError(err);
      console.error(`❌ Gagal menghapus Ucapan Tamu ${id}:`, err);
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
    create,
    update,
    remove,
  };
}
