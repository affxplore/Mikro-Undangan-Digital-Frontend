// import axios from "axios"
// import { useCallback, useEffect, useState } from "react"
// import { fromBackend, toBackend } from "./CategoriesModel"

// var url = "http://192.168.1.36:2222/api/v1"


// const apiCategori = {
//     getList: (params) => {
//         // check token
//         // get api
//         return axios.get(url + "/categories?" + params)
//     },

//     getById : (id) => {
//         return axios.get(url + "/categories/1?" + id)
//     },

//     postCreate : (data) => {
//         return axios.post(url +"/categories/" + data)
//     },

//     Edit : (id) => { 
//         return axios.put(url +"/categories/1" + id )
//     },

//     Delete : (id) =>{
//         return axios.delete(url+"/categories/1" + id)
//     }
// }



// function useCategories() {
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
//             const res = await apiCategori.getList("")
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

//     const getById = useCallback(async (id) => {
//         setLoading(true);
//         setError(null);

//         try {
//             const res = await apiCategori.getById(id)
//             const listData = res?.data?.data

//             // const data = listData.map(fromBackend)

//             setData(data)
//             console.log("id" , res);
            
//         } catch (error) {
//             console.log(error)
//             setError(error)
//         } finally {
//             setLoading(false)
//         }

//     }, []); 


//     const postCreate = useCallback(async (data) => {
//         setLoading(true);
//         setError(null);

//         try {
//             const res = await apiCategori.postCreate(data)
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

//     const Edit = useCallback(async (id) => {
//         setLoading(true);
//         setError(null);

//         try {
//             const res = await apiCategori.putEdit(id)
//             const listData = res?.data?.data

//             // const data = listData.map(fromBackend)

//             setData(data)
//             console.log("id" , res);
            
//         } catch (error) {
//             console.log(error)
//             setError(error)
//         } finally {
//             setLoading(false)
//         }

//     }, []); 

//     const Delete = useCallback(async (id) => {
//         setLoading(true);
//         setError(null);

//         try {
//             const res = await apiCategori.Delete(id)
//             const listData = res?.data?.data

//             // const data = listData.map(fromBackend)

//             setData(data)
//             console.log("id" , res);
            
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
//         getById,
//         postCreate,
//         Edit,
//         Delete,
//     }
// }

// export default useCategories;

// C:\project\mikro-undangan\src\api\categories\useCategories.jsx

// File: src/api/categories/useCategories.jsx

import apiService from "../apiService";
import { useCallback, useState } from "react";
import { fromBackend, toBackend } from "./CategoriesModel"; // Impor toBackend

const apiCategories = {
  getList: (params) => apiService.get("/categories", { params }),
  postCreate: (formData) => apiService.post("/categories", formData),
  putUpdate: (id, formData) => apiService.put(`/categories/${id}`, formData),
  deleteCategory: (id) => apiService.delete(`/categories/${id}`),
};

export default function useCategories() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState(null);

  const getList = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiCategories.getList(params);
      const listData = res.data?.data || [];
      const paginationData = res.data?.pagination || {};
      // ===== TAMBAHKAN CONSOLE LOG DI SINI =====
      console.log("Data mentah dari backend:", listData);
      
      const mappedData = listData.map(fromBackend);
      
      console.log("Data setelah di-map (siap tampil):", mappedData);
      // =========================================
      setData(listData.map(fromBackend)); // fromBackend akan membuat URL gambar lengkap
      setPagination(paginationData);
    } catch (err) {
      setError(err);
      console.error("Gagal mengambil daftar kategori:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // UBAH FUNGSI INI
  const postCreate = useCallback(async (categoryData) => {
    setLoading(true);
    setError(null);
    // Biarkan hook yang membuat FormData
    const formData = toBackend(categoryData);
    try {
      await apiCategories.postCreate(formData);
    } catch (err) {
      setError(err);
      console.error("Gagal membuat kategori:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // UBAH FUNGSI INI
  const putUpdate = useCallback(async (id, categoryData) => {
    setLoading(true);
    setError(null);
    // Biarkan hook yang membuat FormData
    const formData = toBackend(categoryData);
    try {
      await apiCategories.putUpdate(id, formData);
    } catch (err) {
      setError(err);
      console.error(`Gagal mengupdate kategori ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (id) => {
    setError(null);
    try {
      await apiCategories.deleteCategory(id);
    } catch (err) {
      setError(err);
      console.error(`Gagal menghapus kategori ${id}:`, err);
      throw err;
    }
  }, []);

  return {
    data,
    loading,
    pagination,
    error,
    getList,
    postCreate,
    putUpdate,
    deleteCategory,
  };
}