// src/api/prices/usePrices.jsx

import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import apiService from "../apiService";
import { toBackend } from "./PriceModel";

const API_URL = "/prices";

export default function usePrices() {
  const [loading, setLoading] = useState(false);

  const create = useCallback(async (priceData) => {
    setLoading(true);
    try {
      const payload = toBackend(priceData);
      const res = await apiService.post(API_URL, payload);
      toast.success("Harga baru berhasil ditambahkan!");
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.meta?.message || "Gagal menambah harga.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id) => {
    setLoading(true);
    try {
      await apiService.delete(`${API_URL}/${id}`);
      toast.success("Harga berhasil dihapus!");
    } catch (err) {
      toast.error(err.response?.data?.meta?.message || "Gagal menghapus harga.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, create, remove };
}