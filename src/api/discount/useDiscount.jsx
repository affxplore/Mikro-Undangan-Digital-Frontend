// src/hooks/useDiscount.js

import { useCallback, useState } from "react";
import apiService from "../apiService";
import { fromBackend, toBackend } from "./DiscountModel";

const API_URL = "/discounts";

const apiDisc = {
  getList: (params) => apiService.get(API_URL, { params }),
  getById: (id) => apiService.get(`${API_URL}/${id}`),
  postCreate: (formData) => apiService.post(API_URL, formData),
  putUpdate: (id, formData) => apiService.put(`${API_URL}/${id}`, formData),
  deleteDiscount: (id) => apiService.delete(`${API_URL}/${id}`),
};

export default function useDiscount() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRows: 0,
    limit: 10,
  });

  // Ambil list data
  const getList = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = {
          page: params.page || 1,
          limit: params.limit || pagination.limit,
          filter: JSON.stringify({
            search: params.search || undefined,
            status: params.status || undefined,
          }),
          sort: params.sort || undefined,
        };

        const res = await apiDisc.getList(queryParams);

        const listData = res.data.data || [];
        const paginationData = res.data.pagination || {};

        const mappedData = listData.map(fromBackend);

        setData(mappedData);
        setPagination({
          currentPage: paginationData.currentPage,
          totalPages: paginationData.totalPages,
          totalRows: paginationData.totalRows,
          limit: queryParams.limit,
        });
      } catch (err) {
        setError(err);
        console.error("Error fetching discount list:", err);
      } finally {
        setLoading(false);
      }
    },
    [pagination.limit]
  );

  // Create
  const create = useCallback(async (discountData) => {
    setLoading(true);
    setError(null);
    const formData = toBackend(discountData);
    try {
      const res = await apiDisc.postCreate(formData);
      return fromBackend(res.data.data); // pastikan mapping masuk
    } catch (err) {
      setError(err);
      console.error("Error creating discount:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update
  const update = useCallback(async (id, discountData) => {
    setLoading(true);
    setError(null);
    const formData = toBackend(discountData);
    try {
      const res = await apiDisc.putUpdate(id, formData);
      return fromBackend(res.data.data);
    } catch (err) {
      setError(err);
      console.error("Error updating discount:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete
  const remove = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await apiDisc.deleteDiscount(id);
    } catch (err) {
      setError(err);
      console.error("Error deleting discount:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    pagination,
    getList,
    create,
    update,
    remove,
  };
}





// import { useCallback, useState } from "react";
// import apiService from "../apiService"; // <-- 1. GANTI import dari 'axios' ke 'apiService'
// import { fromBackend, toBackend } from "./DiscountModel"; // Sesuaikan nama file jika perlu

// // 2. Gunakan path relatif. Base URL sudah ada di apiService.
// const API_URL = "/discounts";

// // Definisikan fungsi API call
// const apiDisc = {
//   getList: (params) => apiService.get(API_URL, { params }),
//   getById: (id) => apiService.get(`${API_URL}/${id}`),
//   // Hapus header Content-Type, biarkan browser menentukannya saat FormData digunakan
//   postCreate: (formData) => apiService.post(API_URL, formData),
//   putUpdate: (id, formData) => apiService.put(`${API_URL}/${id}`, formData),
//   deleteDiscount: (id) => apiService.delete(`${API_URL}/${id}`),
// };

// // Custom hook 'usePayment'
// export default function useDiscount() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalRows: 0,
//     limit: 10,
//   });

//   // Fungsi untuk mengambil daftar data (tidak ada perubahan signifikan di sini)
//   const getList = useCallback(
//     async (params = {}) => {
//       setLoading(true);
//       setError(null);
//       try {
//         const queryParams = {
//           page: params.page || 1,
//           limit: params.limit || pagination.limit,
//           // Mengubah 'search' menjadi 'filter' agar lebih konsisten dengan backend Anda
//           filter: JSON.stringify({ 
//             search: params.search || undefined,
//             status: params.status || undefined,
//           }),
//           sort: params.sort || undefined,
//         };
        
//         const res = await apiDisc.getList(queryParams);

//         const listData = res.data.data || [];
//         const paginationData = res.data.pagination || {};
//         const mappedData = listData.map(fromBackend);
        
//         setData(mappedData);
//         setPagination({
//           currentPage: paginationData.currentPage,
//           totalPages: paginationData.totalPages,
//           totalRows: paginationData.totalRows,
//           limit: queryParams.limit,
//         });

//       } catch (err) {
//         setError(err);
//         console.error("Error fetching payment list:", err);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [pagination.limit]
//   );

//   // Fungsi untuk membuat data baru
//   const create = useCallback(async (discountData) => {
//     setLoading(true);
//     setError(null);
//     const formData = toBackend(discountData);
//     try {
//       const res = await apiDisc.postCreate(formData);
//       return res.data.data; // Kembalikan data yang baru dibuat
//     } catch (err) {
//       setError(err);
//       console.error("Error creating payment:", err);
//       throw err; // Lemparkan error agar bisa ditangkap di komponen
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Fungsi untuk mengupdate data
//   const update = useCallback(async (id, discountData) => {
//     setLoading(true);
//     setError(null);
//     const formData = toBackend(discountData);
//     try {
//       const res = await apiDisc.putUpdate(id, formData);
//       return res.data.data; // Kembalikan data yang diupdate
//     } catch (err) {
//       setError(err);
//       console.error("Error updating payment:", err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Fungsi untuk menghapus data
//   const remove = useCallback(async (id) => {
//     setLoading(true);
//     setError(null);
//     try {
//       await apiDisc.deleteDiscount(id);
//     } catch (err) {
//       setError(err);
//       console.error("Error deleting discount:", err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   return {
//     data,
//     loading,
//     error,
//     pagination,
//     getList,
//     create,
//     update,
//     remove, // Ganti nama agar tidak konflik dengan keyword 'delete'
//   };
// }
