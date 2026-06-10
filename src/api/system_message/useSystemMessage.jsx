// src/api/systemMessage/useSystemMessage.jsx

import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import apiService from "../apiService";
import { fromBackend, toBackend } from "./systemMessageModel";

const API_URL = "/system-messages";

export default function useSystemMessage() {
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
      console.error("Failed to fetch system messages:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (msgData) => {
    setLoading(true);
    try {
      const payload = toBackend(msgData);
      const res = await apiService.post(API_URL, payload);
      const newData = fromBackend(res.data.data);
      setData((prev) => [...prev, newData]);
      toast.success("System message berhasil dibuat!");
      return newData;
    } catch (err) {
      toast.error(err.response?.data?.meta?.message || "Gagal membuat system message.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id, msgData) => {
    setLoading(true);
    try {
      const payload = toBackend(msgData);
      const res = await apiService.put(`${API_URL}/${id}`, payload);
      const updatedData = fromBackend(res.data.data);
      setData((prev) => prev.map((item) => (item.id === id ? updatedData : item)));
      toast.success("System message berhasil diperbarui!");
      return updatedData;
    } catch (err) {
      toast.error(err.response?.data?.meta?.message || "Gagal memperbarui system message.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id) => {
    setLoading(true);
    try {
      await apiService.delete(`${API_URL}/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("System message berhasil dihapus!");
    } catch (err) {
      toast.error(err.response?.data?.meta?.message || "Gagal menghapus system message.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, pagination, error, getList, create, update, remove };
}
