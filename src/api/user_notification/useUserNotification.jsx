import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import apiService from "../apiService";
import { fromBackend } from "./userNotificationModel";

const API_URL = "/user-notifications";

export default function useUserNotification() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ambil semua notif user
  const getList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.get(API_URL);
      setData(res.data.data.map(fromBackend));
    } catch (err) {
      setError(err);
      toast.error("Gagal mengambil notifikasi");
    } finally {
      setLoading(false);
    }
  }, []);

  // Tandai notif sebagai dibaca
  const markAsRead = useCallback(async (id) => {
    try {
      await apiService.put(`${API_URL}/${id}`, { read: true });
      setData((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      toast.error("Gagal menandai notifikasi");
    }
  }, []);

  // Hapus notif
  const remove = useCallback(async (id) => {
    try {
      await apiService.delete(`${API_URL}/${id}`);
      setData((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notifikasi dihapus");
    } catch (err) {
      toast.error("Gagal menghapus notifikasi");
    }
  }, []);

  return { data, loading, error, getList, markAsRead, remove };
}
