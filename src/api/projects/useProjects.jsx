import apiService from "../apiService";
import { useCallback, useState } from "react";
import { fromBackend, toBackend } from "./ProjectsModel";

const API_ENDPOINT = "/projects";

const apiProjects = {
  getList: (params) => apiService.get(API_ENDPOINT, { params }),
  getById: (id) => apiService.get(`${API_ENDPOINT}/${id}`),
  postCreate: (payload) => apiService.post(API_ENDPOINT, payload),
  putUpdate: (id, payload) => apiService.put(`${API_ENDPOINT}/${id}`, payload),
  deleteProject: (id) => apiService.delete(`${API_ENDPOINT}/${id}`),
};



export default function useProjects() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState(null);

  const getById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
     const res = await apiProjects.getById(id);
      
      // --- TAMBAHKAN LOG DI SINI ---
      console.log("1. DATA MENTAH DARI BACKEND (getById):", res.data.data);
      
      const mappedData = fromBackend(res.data.data);
      
      console.log("2. DATA SETELAH MAPPING (getById):", mappedData);
      // --- AKHIR LOG ---

      return mappedData;
    } catch (err) {
      setError(err);
      console.error(`Gagal mengambil project ${id}:`, err); // Log ini sudah ada
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getList = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiProjects.getList(params);
      const listData = res.data?.data || [];
      const paginationData = res.data?.pagination || {};
      
      setData(listData.map(fromBackend));
      setPagination(paginationData);
    } catch (err) {
      setError(err);
      console.error("Gagal mengambil daftar project:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (projectData) => {
    setLoading(true);
    setError(null);
    const payload = toBackend(projectData); // Siapkan payload JSON
    try {
      const res = await apiProjects.postCreate(payload);
      return fromBackend(res.data.data); // Kembalikan data yang sudah di-map
    } catch (err) {
      setError(err);
      console.error("Gagal membuat project:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id, projectData, setGlobalLoading = true) => {
    if (setGlobalLoading) {
      setLoading(true);
    }
    setError(null);
    const payload = toBackend(projectData); // Siapkan payload JSON
    try {
      const res = await apiProjects.putUpdate(id, payload);
      return fromBackend(res.data.data); // Kembalikan data yang sudah di-map
    } catch (err) {
      setError(err);
      console.error(`Gagal mengupdate project ${id}:`, err);
      throw err;
    } finally {
      if (setGlobalLoading) {
        setLoading(false);
      }
    }
  }, []);

  const remove = useCallback(async (id) => {
    // Optimistik: bisa juga setLoading(true) jika diperlukan
    setError(null);
    try {
      await apiProjects.deleteProject(id);
    } catch (err) {
      setError(err);
      console.error(`Gagal menghapus project ${id}:`, err);
      throw err;
    }
  }, []);

  return {
    data,
    loading,
    pagination,
    error,
    getById,
    getList,
    create,
    update,
    remove,
  };
}
