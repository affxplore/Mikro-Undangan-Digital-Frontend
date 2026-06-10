import { useCallback, useState } from "react";
import apiService from "../apiService";
import { fromBackend, toBackend } from "./KategoriPesanModel";

const API_ENDPOINT = "/kategori_pesans";

export default function useKategoriPesan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const getList = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const filterPayload = {
        search: params.search,
      };

      const queryParams = {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        sort: params.sort,
        filter: JSON.stringify(filterPayload),
      };

      if (!params.sort) {
        delete queryParams.sort;
      }

      const res = await apiService.get(API_ENDPOINT, { params: queryParams });
      const list = res?.data?.data || [];
      const paginationData = res?.data?.pagination || {};
      const mapped = list.map(fromBackend);

      setData(mapped);
      setPagination(paginationData);
      return mapped;
    } catch (err) {
      setError(err);
      console.error("Gagal mengambil kategori pesan:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.get(`${API_ENDPOINT}/${id}`);
      return fromBackend(res?.data?.data || {});
    } catch (err) {
      setError(err);
      console.error(`Gagal mengambil kategori pesan ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (kategoriData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = toBackend(kategoriData);
      const res = await apiService.post(API_ENDPOINT, payload);
      const created = fromBackend(res?.data?.data || {});
      setData((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      setError(err);
      console.error("Gagal membuat kategori pesan:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id, kategoriData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = toBackend(kategoriData);
      const res = await apiService.put(`${API_ENDPOINT}/${id}`, payload);
      const updated = fromBackend(res?.data?.data || {});
      setData((prev) => prev.map((item) => (item.id === id ? updated : item)));
      return updated;
    } catch (err) {
      setError(err);
      console.error(`Gagal memperbarui kategori pesan ${id}:`, err);
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
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err);
      console.error(`Gagal menghapus kategori pesan ${id}:`, err);
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
    create,
    update,
    remove,
  };
}
