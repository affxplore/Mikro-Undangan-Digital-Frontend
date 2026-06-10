import { useCallback, useState } from "react";
import apiService from "../apiService";
import { fromBackend, toBackend } from "./InvitationsModel";
import { toast } from 'react-toastify';


const API_URL = "/invitations";

const apiInv = {
  getList: (params) => apiService.get(API_URL, { params }),
  getById: (id) => apiService.get(`${API_URL}/${id}`),
  // Endpoint baru untuk membuat undangan lengkap
  getPublicById: (id) => apiService.get(`${API_URL}/public/${id}`), // <-- Fungsi baru
  createFull: (payload) => apiService.post(`${API_URL}/create-full`, payload),
   update: (id, payload) => apiService.put(`${API_URL}/${id}`, payload), // <-- Ganti nama dari putUpdate
  deleteInvitation: (id) => apiService.delete(`${API_URL}/${id}`),
  activate: (id) => apiService.patch(`${API_URL}/${id}/activate`),
};

export default function useInvitations() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const getList = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = {
        page: params.page || 1,
        limit: params.limit || 10,
        filter: JSON.stringify({
          search: params.search || undefined,
          status: params.filterStatus || undefined,
          category_id: params.category_id || undefined, // <-- Tambahkan filter kategori
        }),
      };
    
    
      const res = await apiInv.getList(queryParams);
       console.log('[useInvitations] Respons API mentah:', res); // <-- LOG 1

      const listData = res.data.data || [];
      const paginationData = res.data.pagination || {};
      
      setData(listData.map(fromBackend));
      setPagination(paginationData);
      
 console.log('[useInvitations] Mengembalikan data:', res.data); // <-- LOG 2
  
      return res.data; // <-- Kembalikan data mentah dari respons API
     

    } catch (err) {
      setError(err);
      console.error("Error fetching invitations list:", err);
    } finally {
      setLoading(false);
    }
  }, []);

 const getPublicById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiInv.getPublicById(id);
      return fromBackend(res.data.data);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);


  const getById = useCallback( async (id) => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiInv.getById(id);
        return fromBackend(res.data.data); // Kembalikan data yang sudah dimapping
      } catch (err) {
        setError(err);
        console.error("Error fetching invitation by ID:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []);

  // --- FUNGSI BARU UNTUK ALUR KERJA UTAMA ---
  const createFull = useCallback(async (invitationData) => {
    setLoading(true);
    setError(null);
    // toBackend sekarang mengembalikan objek JSON
    const payload = toBackend(invitationData);
    try {
      const res = await apiInv.createFull(payload);
      // Kembalikan data yang sudah di-map agar konsisten
      return fromBackend(res.data.data); 
    } catch (err) {
      setError(err);
      console.error("Error creating full invitation:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id, invitationData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = toBackend(invitationData);
      
      // --- TAMBAHKAN CONSOLE LOG INI ---
      console.log(`[useInvitations] Payload yang dikirim untuk UPDATE ID ${id}:`, payload);
      
      const res = await apiInv.update(id, payload);
      return fromBackend(res.data.data);
    } catch (err) {
      setError(err);
      console.error("Error updating invitation:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await apiInv.deleteInvitation(id);
    } catch (err) {
      setError(err);
      console.error("Error deleting invitation:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const activate = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      // Baris ini sekarang akan berfungsi karena apiInv.activate sudah ada
      const res = await apiInv.activate(id); 
      toast.success("Undangan berhasil diaktifkan!");
      return res.data;
    } catch (err) {
      setError(err);
      console.error("Error activating invitation:", err);
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
    getById,
    getPublicById,
    createFull, // <-- Ekspor fungsi yang baru
    update,
    remove,
    activate,
  };
} 