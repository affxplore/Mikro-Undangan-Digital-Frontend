import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import apiService from "../apiService";
import { fromBackend, toBackend } from "./TemplatePesanModel";

const API_ENDPOINT = "/template_pesans";

export default function useTemplatePesan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const getList = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        search: params.search,
        kategori_pesan_id:
          params.kategori_pesan_id ?? params.categoryId ?? undefined,
      };

      const res = await apiService.get(API_ENDPOINT, { params: queryParams });
      const list = res?.data?.data || [];
      const paginationData = res?.data?.pagination || {};
      const mapped = list.map(fromBackend);

      setData(mapped);
      setPagination(paginationData);
      return mapped;
    } catch (err) {
      setError(err);
      console.error("Gagal mengambil template pesan:", err);
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
      console.error(`Gagal mengambil template pesan ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (templateData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = toBackend(templateData);
      const res = await apiService.post(API_ENDPOINT, payload);
      const created = fromBackend(res?.data?.data || {});

      setData((prev) => [created, ...prev]);
      toast.success("Template pesan berhasil dibuat.");
      return created;
    } catch (err) {
      setError(err);
      toast.error(err.response?.data?.meta?.message || "Gagal membuat template pesan.");
      console.error("Gagal membuat template pesan:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id, templateData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = toBackend(templateData);
      const res = await apiService.put(`${API_ENDPOINT}/${id}`, payload);
      const updated = fromBackend(res?.data?.data || {});

      setData((prev) => prev.map((item) => (item.id === id ? updated : item)));
      toast.success("Template pesan berhasil diperbarui.");
      return updated;
    } catch (err) {
      setError(err);
      toast.error(err.response?.data?.meta?.message || "Gagal memperbarui template pesan.");
      console.error(`Gagal memperbarui template pesan ${id}:`, err);
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
      toast.success("Template pesan berhasil dihapus.");
    } catch (err) {
      setError(err);
      toast.error(err.response?.data?.meta?.message || "Gagal menghapus template pesan.");
      console.error(`Gagal menghapus template pesan ${id}:`, err);
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
