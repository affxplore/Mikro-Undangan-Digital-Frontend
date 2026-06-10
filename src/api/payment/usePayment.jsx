import { useCallback, useState } from "react";
import apiService from "../apiService"; // <-- 1. GANTI import dari 'axios' ke 'apiService'
import { fromBackend, toBackend } from "./paymentModel"; // Sesuaikan nama file jika perlu
import { toast } from "react-toastify";

// 2. Gunakan path relatif. Base URL sudah ada di apiService.
const API_URL = "/payments";


// Definisikan fungsi API call
const apiPay = {
  getList: (params) => apiService.get(API_URL, { params }),
  getById: (id) => apiService.get(`${API_URL}/${id}`),
  // Hapus header Content-Type, biarkan browser menentukannya saat FormData digunakan
  postCreate: (formData) => apiService.post(API_URL, formData),
  putUpdate: (id, formData) => apiService.put(`${API_URL}/${id}`, formData),
  deletePayment: (id) => apiService.delete(`${API_URL}/${id}`),
  createSubscriptionPayment: (payload) => apiService.post(`${API_URL}/create-subscription-payment`, payload),
};

// Custom hook 'usePayment'
export default function usePayment() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRows: 0,
    limit: 10,
  });

  const createSubscriptionPayment = useCallback(async (priceId) => {
    setLoading(true);
    try {
      const payload = { price_id: priceId };
      const res = await apiService.post(`${API_URL}/create-subscription-payment`, payload);
      toast.success("Mengarahkan ke halaman pembayaran...");
      return res.data.data; // Mengembalikan objek { token: "..." }
    } catch (err) {
      toast.error(err.response?.data?.meta?.message || "Gagal membuat transaksi.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fungsi untuk mengambil daftar data (tidak ada perubahan signifikan di sini)
  const getList = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = {
          page: params.page || 1,
          limit: params.limit || pagination.limit,
          // Mengubah 'search' menjadi 'filter' agar lebih konsisten dengan backend Anda
          filter: JSON.stringify({ 
            search: params.search || undefined,
            status: params.status || undefined,
          }),
          
          sort: params.sort || undefined,
        };
        
        const res = await apiPay.getList(queryParams);

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
        console.error("Error fetching payment list:", err);
      } finally {
        setLoading(false);
      }
    },
    [pagination.limit]
  );

  // Fungsi untuk membuat data baru
  const create = useCallback(async (paymentData) => {
    setLoading(true);
    setError(null);
    const formData = toBackend(paymentData);
    try {
      const res = await apiPay.postCreate(formData);
      return res.data.data; // Kembalikan data yang baru dibuat
    } catch (err) {
      setError(err);
      console.error("Error creating payment:", err);
      throw err; // Lemparkan error agar bisa ditangkap di komponen
    } finally {
      setLoading(false);
    }
  }, []);

  // Fungsi untuk mengupdate data
  const update = useCallback(async (id, paymentData) => {
    setLoading(true);
    setError(null);
    const formData = toBackend(paymentData);
    try {
      const res = await apiPay.putUpdate(id, formData);
      return res.data.data; // Kembalikan data yang diupdate
    } catch (err) {
      setError(err);
      console.error("Error updating payment:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fungsi untuk menghapus data
  const remove = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await apiPay.deletePayment(id);
    } catch (err) {
      setError(err);
      console.error("Error deleting payment:", err);
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
    createSubscriptionPayment
  };
}