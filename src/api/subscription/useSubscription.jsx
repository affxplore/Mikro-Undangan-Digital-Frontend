// src/api/subscription/useSubscription.jsx

import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import apiService from "../apiService";
import { fromBackend, toBackend } from "./SubscriptionModel";

const API_URL = "/subscriptions";

export default function useSubscription() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState(null);

  const getList = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = {
        page: params.page || 1,
        limit: params.limit || 10,
        sort: params.sort,
        search: params.search,
      };
      const res = await apiService.get(API_URL, { params: queryParams });
      
      setData(res.data.data.map(fromBackend));
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err);
      console.error("Failed to fetch subscriptions:", err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const create = useCallback(async (subData) => {
    setLoading(true);
    try {
      console.log('Creating subscription with data:', subData);
      const payload = toBackend(subData);
      console.log('POST request payload:', payload);
      
      // Tambahkan header untuk debugging
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      const res = await apiService.post(API_URL, payload, config);
      console.log('POST response:', res.data);
      
      if (!res.data.data) {
        console.error('Invalid response format:', res.data);
        throw new Error('Invalid response format from server');
      }
      
      const newData = fromBackend(res.data.data);
      setData(prev => [...prev, newData]);
      toast.success("Paket langganan berhasil dibuat!");
      return newData;
    } catch (err) {
      console.error('Create subscription error details:', {
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers,
        message: err.message
      });
      
      let errorMessage = "Gagal membuat paket. ";
      if (err.response?.data?.meta?.message) {
        errorMessage += err.response.data.meta.message;
      } else if (err.response?.data?.message) {
        errorMessage += err.response.data.message;
      }
      
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id, subData) => {
    setLoading(true);
    try {
      console.log('Updating subscription:', id, 'with data:', subData);
      const payload = toBackend(subData);
      console.log('PUT request payload:', payload);
      
      // Tambahkan header untuk debugging
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      const res = await apiService.put(`${API_URL}/${id}`, payload, config);
      console.log('PUT response:', res.data);
      
      if (!res.data.data) {
        console.error('Invalid response format:', res.data);
        throw new Error('Invalid response format from server');
      }
      
      const updatedData = fromBackend(res.data.data);
      setData(prev => prev.map(item => item.id === id ? updatedData : item));
      toast.success("Paket langganan berhasil diperbarui!");
      return updatedData;
    } catch (err) {
      console.error('Update subscription error details:', {
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers,
        message: err.message,
        stack: err.stack
      });
      
      let errorMessage = "Gagal memperbarui paket. ";
      if (err.response?.data?.meta?.message) {
        errorMessage += err.response.data.meta.message;
      } else if (err.response?.data?.message) {
        errorMessage += err.response.data.message;
      } else if (err.response?.data && typeof err.response.data === 'string') {
        // Handle HTML error responses
        errorMessage += "Terjadi kesalahan di server.";
        console.error('Server HTML Error:', err.response.data);
      }
      
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id) => {
    setLoading(true);
    try {
      await apiService.delete(`${API_URL}/${id}`);
      setData(prev => prev.filter(item => item.id !== id)); // Update state lokal
      toast.success("Paket langganan berhasil dihapus!");
    } catch (err) {
      toast.error(err.response?.data?.meta?.message || "Gagal menghapus paket.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, pagination, error, getList, create, update, remove };
}