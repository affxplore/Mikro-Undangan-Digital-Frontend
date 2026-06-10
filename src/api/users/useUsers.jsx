// import axios from "axios"
// import { useCallback, useEffect, useState } from "react"
// import { fromBackend, toBackend } from "./usersModel"

// var url = "http://192.168.1.36:2222/api/v1"


// const apiUser = {
//     getList: (params) => {
//         // check token
//         // get api
//         return axios.get(url + "/users?" + params)
//     }
// }

// function useUsers() {
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [pagination, setPagination] = useState({
//         page: 1,
//         limit: 10,
//         total: 10,
//         page: 1,
//     });
//     const [error, setError] = useState(null);

//     const getList = useCallback(async (params = {}) => {
//         setLoading(true);
//         setError(null);

//         try {
//             const res = await apiUser.getList("")
//             const listData = res?.data?.data

//             // const data = listData.map(fromBackend)

//             setData(data)
//             console.log("data" , res);
            
//         } catch (error) {
//             console.log(error)
//             setError(error)
//         } finally {
//             setLoading(false)
//         }

//     }, []);

//     useEffect(() => {getList("")}, [])

//     return {
//         data,
//         loading,
//         pagination,
//         error,
//         getList,
//         // getById,
//         // create,
//         // update,
//         // delete
//     }
// }

// export default useUsers;
// import { useCallback, useState } from "react";
// import apiService from "../apiService";  // Ganti dengan apiService
// import { fromBackend } from "./usersModel";  // Fungsi untuk mengubah format data user

// const API_URL = "/users";  // End-point API untuk users

// const apiUser = {
//   getList: (params) => apiService.get(API_URL, { params }),
//   getById: (id) => apiService.get(`${API_URL}/${id}`),
//   postCreate: (formData) => apiService.post(API_URL, formData),
//   putUpdate: (id, formData) => apiService.put(`${API_URL}/${id}`, formData),
//   deleteUser: (id) => apiService.delete(`${API_URL}/${id}`),
// };

// export default function useUsers() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalRows: 0,
//     limit: 10,
//   });

//   const getList = useCallback(async (params = {}) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const queryParams = {
//           page: params.page || 1,
//           limit: params.limit || pagination.limit,
//           // Mengubah 'search' menjadi 'filter' agar lebih konsisten dengan backend Anda
//           filter: JSON.stringify({ 
//             search: params.search || undefined,
//             status: params.status || undefined,
//           }),
          
//           sort: params.sort || undefined,
//         };
//       const res = await apiUser.getList(queryParams);
//       const listData = res.data.data || [];
//       const paginationData = res.data.pagination || {};
//       setUsers(listData.map(fromBackend));
//       setPagination(paginationData);
//     } catch (err) {
//       setError(err);
//       console.error("Error fetching users list:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [pagination.limit]);

//   const create = useCallback(async (userData) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await apiUser.postCreate(userData);
//       return res.data.data;
//     } catch (err) {
//       setError(err);
//       console.error("Error creating user:", err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const update = useCallback(async (id, userData) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await apiUser.putUpdate(id, userData);
//       return res.data.data;
//     } catch (err) {
//       setError(err);
//       console.error("Error updating user:", err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const remove = useCallback(async (id) => {
//     setLoading(true);
//     setError(null);
//     try {
//       await apiUser.deleteUser(id);
//     } catch (err) {
//       setError(err);
//       console.error("Error deleting user:", err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   return {
//     users,
//     loading,
//     error,
//     pagination,
//     getList,
//     create,
//     update,
//     remove,
//   };
// }
// File: src/api/users/useUsers.jsx

import { useCallback, useState } from "react";
import apiService from "../apiService";
import { fromBackend, toBackend } from "./usersModel"; // Impor model

const API_URL = "/users";

const apiUser = {
  getList: (params) => apiService.get(API_URL, { params }),
  create: (data) => apiService.post(API_URL, data),
  update: (id, data) => apiService.put(`${API_URL}/${id}`, data),
  remove: (id) => apiService.delete(`${API_URL}/${id}`),
  toggleStatus: (id, status) => apiService.patch(`${API_URL}/${id}/status`, { isActive: status }),
};

export default function useUsers() {
  const [data, setData] = useState([]); // Inisialisasi dengan array kosong
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const getList = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = {
        page: params.page || 1,
        limit: params.limit || pagination.limit,
           filter: JSON.stringify({
          search: params.q,
          // role: params.role,
          status: params.status,
          role_id: params.role_id, // Tambahkan ini
          exclude_role_id: params.exclude_role_id, // Tambahkan ini
        }),
        // 
        sort: params.sort,
        // ===== MODIFIKASI DI SINI =====
        // filter: JSON.stringify({
        //   search: params.q,
        //   role: params.role,
        //   status: params.status,
        //   role_id: params.role_id, // Tambahkan ini
        //   exclude_role_id: params.exclude_role_id, // Tambahkan ini
        // }),
        // ==============================
      };
      const res = await apiUser.getList(queryParams);
      const listData = res.data.data || [];
      const paginationData = res.data.pagination || {};
      
      // PENTING: Gunakan 'fromBackend' untuk memproses data
      setData(listData.map(fromBackend)); 
      
      setPagination(paginationData);
    } catch (err) {
      setError(err);
      console.error("Error fetching users list:", err);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

   const create = useCallback(async (userData) => {
    let payload;
    let config = {};

    if (userData instanceof FormData) {
      // --- Jalur 1: Untuk ManageUser (Upload File) ---
      payload = userData;
      // Saat mengirim FormData, set header Content-Type secara eksplisit
      // atau biarkan Axios menentukannya secara otomatis (seringkali lebih baik menghapusnya agar browser yg atur boundary)
      config.headers = { "Content-Type": "multipart/form-data" };
    } else {
      // --- Jalur 2: Untuk Staff (JSON Biasa) ---
      // Gunakan transformer toBackend seperti sebelumnya
      payload = toBackend(userData); 
      config.headers = { "Content-Type": "application/json" };
    }

    try {
      await apiService.post("/users", payload, config);
    } catch (err) {
      console.error("Error creating user:", err);
      throw err;
    }
  }, []); // Hapus dependensi toBackend jika toBackend diimpor di luar scope hook

  const update = useCallback(async (id, userData) => {
    let payload;
    let config = {};

    if (userData instanceof FormData) {
      // --- Jalur 1: Untuk ManageUser (Upload File) ---
      payload = userData;
      config.headers = { "Content-Type": "multipart/form-data" };
      // Catatan: Beberapa backend API tidak mendukung PUT/PATCH dengan multipart/form-data.
      // Jika update gagal, Anda mungkin perlu menggunakan method override POST.
    } else {
      // --- Jalur 2: Untuk Staff (JSON Biasa) ---
      payload = toBackend(userData);
      config.headers = { "Content-Type": "application/json" };
    }

    try {
      await apiService.put(`/users/${id}`, payload, config);
    } catch (err) {
      console.error("Error updating user:", err);
      throw err;
    }
  }, []);

  const remove = useCallback(async (id) => {
    try {
      await apiUser.remove(id);
    } catch (err) {
      console.error("Error deleting user:", err);
      throw err;
    }
  }, []);

  const toggleStatus = useCallback(async (id, status) => {
    try {
      await apiUser.toggleStatus(id, status);
    } catch (err) {
      console.error("Error toggling user status:", err);
      throw err;
    }
  }, []);

  return {
    data, // Ganti nama kembali ke 'data' agar konsisten
    loading,
    error,
    pagination,
    getList,
    create,
    update,
    remove,
    toggleStatus,
  };
}