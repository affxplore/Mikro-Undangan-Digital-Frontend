import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import apiService from "../apiService";
import { fromBackend, toBackend } from "./ReceiverModel";

const API_ENDPOINT = "/receive_invs";

export default function useReceiveInvs() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const getList = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      if (!params.invitation_id) {
        throw new Error("Invitation ID is required to fetch guest list.");
      }

      const res = await apiService.get(API_ENDPOINT, { params });
      const list = res?.data?.data || [];

      setData(list.map(fromBackend));
      setPagination(res?.data?.pagination || {});
      return list.map(fromBackend);
    } catch (err) {
      setError(err);
      console.error("Gagal mengambil daftar tamu:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (guestData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = toBackend(guestData);
      const res = await apiService.post(API_ENDPOINT, payload);
      const created = fromBackend(res?.data?.data || {});

      setData((prev) => [...prev, created]);
      toast.success("Tamu berhasil ditambahkan!");
      return created;
    } catch (err) {
      setError(err);
      toast.error(err.response?.data?.meta?.message || "Gagal menambahkan tamu.");
      console.error("Gagal membuat penerima undangan:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getGuestByCode = useCallback(async (code) => {
    try {
      const res = await apiService.get(`${API_ENDPOINT}/public/by-code/${code}`);
      return res.data.data; // Mengembalikan data tamu { recipient: 'Nama' }
    } catch (err) {
      console.error("Gagal mengambil data tamu by code:", err);
      return null; // Kembalikan null jika gagal
    }
  }, []);

  const importFromExcel = useCallback(async (invitationId, formData) => {
    setLoading(true);
    setError(null);
    try {
      // Endpoint yang kita buat di backend
      const res = await apiService.post(`${API_ENDPOINT}/import/${invitationId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Penting untuk upload file
        },
      });
      toast.success(res.data.meta.message); // Tampilkan pesan sukses dari backend
      return res.data;
    } catch (err) {
      setError(err);
      const errorMessage = err.response?.data?.meta?.message || "Gagal mengimpor tamu.";
      toast.error(errorMessage);
      console.error("Gagal mengimpor tamu:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id, guestData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = toBackend(guestData);
      console.log('[useReceiveInvs] PUT payload', { id, payload });
      const res = await apiService.put(`${API_ENDPOINT}/${id}`, payload);
      console.log('[useReceiveInvs] PUT response', res?.data);

      const rawGuest = res?.data?.data ?? res?.data?.pagination ?? res?.data?.result ?? res?.data;
      console.log('[useReceiveInvs] Parsed guest data', rawGuest);
      const updated = fromBackend(rawGuest || {});

      setData((prev) => prev.map((item) => (item.id === id ? updated : item)));
      toast.success("Tamu berhasil diperbarui!");
      return updated;
    } catch (err) {
      setError(err);
      toast.error(err.response?.data?.meta?.message || "Gagal memperbarui tamu.");
      console.error('[useReceiveInvs] Failed to update guest', err);
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
      toast.success("Tamu berhasil dihapus!");
    } catch (err) {
      setError(err);
      toast.error(err.response?.data?.meta?.message || "Gagal menghapus tamu.");
      console.error("Gagal menghapus penerima undangan:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const accept = useCallback(async (code) => {
    if (!code) return;
    try {
      await apiService.patch(`${API_ENDPOINT}/public/accept/${code}`);
    } catch (err) {
      console.error("Gagal menandai undangan sebagai diterima:", err);
    }
  }, []);


  return {
    data,
    loading,
    error,
    pagination,
    getList,
    create,
    getGuestByCode,
    update,
    remove,
    importFromExcel,
    accept,
  };
}
