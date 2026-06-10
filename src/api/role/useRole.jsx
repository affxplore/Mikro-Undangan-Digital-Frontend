// import axios from "axios";
// import { useCallback, useEffect, useState } from "react";
// import { fromBackend, toBackend }  from "./RoleModel";

// // Assuming you get the token from localStorage (you can adjust this according to your storage method)
// const token = localStorage.getItem('authToken'); // Replace 'authToken' with the actual key used to store the token

// var url = "http://localhost:2222/api/v1";

// const apiRole = {
//   getList: (params) => {
//     return axios.get(url + "/roles?" + new URLSearchParams(params), {
//       headers: {
//         Authorization: `Bearer ${token}`, // Add the Authorization header with the token
//       },
//     });
//   },
//   getById: (id) => {
//     return axios.get(url + "/roles/" + id, {
//       headers: {
//         Authorization: `Bearer ${token}`, // Add the Authorization header with the token
//       },
//     });
//   },
//   postCreate: (data) => {
//     return axios.post(url + "/roles", data, {
//       headers: {
//         Authorization: `Bearer ${token}`, // Add the Authorization header with the token
//       },
//     });
//   },
//   Edit: (id, data) => {
//     return axios.put(url + "/roles/" + id, data, {
//       headers: {
//         Authorization: `Bearer ${token}`, // Add the Authorization header with the token
//       },
//     });
//   },
//   Delete: (id) => {
//     return axios.delete(url + "/roles/" + id, {
//       headers: {
//         Authorization: `Bearer ${token}`, // Add the Authorization header with the token
//       },
//     });
//   },
// };

// function useRole() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 10,
//   });
//   const [error, setError] = useState(null);

//   const getList = useCallback(async (params = { page: 1, limit: 10 }) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await apiRole.getList(params);
//       const listData = res?.data?.data;

//       setPagination({
//         ...pagination,
//         total: res?.data?.total,
//       });

//       setData(listData);
//       console.log("Fetched data:", listData);
//     } catch (error) {
//       console.log(error);
//       setError(error);
//     } finally {
//       setLoading(false);
//     }
//   }, [pagination]);

//   const getById = useCallback(async (id) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await apiRole.getById(id);
//       setData(res?.data?.data);
//       console.log("Fetched by ID:", res);
//     } catch (error) {
//       console.log(error);
//       setError(error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const postCreate = useCallback(async (data) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await apiRole.postCreate(data);
//       setData(res?.data?.data);
//       console.log("Created data:", res);
//     } catch (error) {
//       console.log(error);
//       setError(error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const updateData = useCallback(async (id, data) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await apiRole.Edit(id, data);
//       setData(res?.data?.data);
//       console.log("Updated data:", res);
//     } catch (error) {
//       console.log(error);
//       setError(error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const deleteData = useCallback(async (id) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await apiRole.Delete(id);
//       getList(); // Refresh the list after deletion
//       console.log("Deleted data:", res);
//     } catch (error) {
//       console.log(error);
//       setError(error);
//     } finally {
//       setLoading(false);
//     }
//   }, [getList]);

//   useEffect(() => {
//     getList({ page: 1, limit: 10 }); // Default pagination params
//   }, [getList]);

//   return {
//     data,
//     loading,
//     pagination,
//     error,
//     getList,
//     getById,
//     postCreate,
//     updateData,
//     deleteData,
//   };
// }

// export default useRole;
import { useCallback, useEffect, useState } from "react";
import apiService from "../apiService";
import { toast } from "react-toastify";

function useRole() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getList = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.get("/roles", { params });
      setData(res.data.data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getList({ limit: 100 }); // Ambil semua data peran saat hook dimuat
  }, [getList]);

  // --- FUNGSI CREATE BARU ---
  const createRole = useCallback(async (roleData) => {
    setLoading(true);
    try {
      await apiService.post("/roles", roleData);
      toast.success(`Role "${roleData.name}" berhasil dibuat.`);
      await getList({ limit: 100 }); // Refresh list setelah create
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error(error.response?.data?.message || "Gagal membuat role.");
      throw error; // Lempar error agar modal tidak tertutup otomatis
    } finally {
      setLoading(false);
    }
  }, [getList]);

  // --- FUNGSI UPDATE BARU ---
  const updateRole = useCallback(async (roleId, roleData) => {
    setLoading(true);
    try {
      await apiService.put(`/roles/${roleId}`, roleData);
      toast.success(`Role berhasil diperbarui.`);
      await getList({ limit: 100 }); // Refresh list setelah update
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error(error.response?.data?.message || "Gagal memperbarui role.");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [getList]);

  // --- FUNGSI DELETE BARU ---
  const deleteRole = useCallback(async (roleId) => {
    setLoading(true);
    try {
      await apiService.delete(`/roles/${roleId}`);
      toast.success("Role berhasil dihapus.");
      await getList({ limit: 100 }); // Refresh list setelah delete
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus role.");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [getList]);

  return {
    rolesData: data,
    rolesLoading: loading,
    rolesError: error,
    refetchRoles: getList,
    createRole, // Ekspor fungsi baru
    updateRole, // Ekspor fungsi baru
    deleteRole, // Ekspor fungsi baru
  };
}

export default useRole;