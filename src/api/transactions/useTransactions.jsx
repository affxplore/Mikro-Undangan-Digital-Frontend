// src/api/transactions/useTransaction.jsx
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import apiService from "../apiService";

const API_URL = "/transactions"; // Sesuaikan dengan endpoint transaksi Anda

export default function useTransaction() {
  const [loading, setLoading] = useState(false);

  const createSubscriptionPayment = useCallback(async (priceId) => {
    setLoading(true);
    try {
      const payload = { price_id: priceId };
      // Panggil endpoint yang sudah kita rencanakan sebelumnya
      const res = await apiService.post(`${API_URL}/create-payment-link`, payload);
      toast.success("Mengarahkan ke halaman pembayaran...");
      return res.data.data; // Mengembalikan objek { token: "..." }
    } catch (err) {
      toast.error(err.response?.data?.meta?.message || "Gagal membuat transaksi.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, createSubscriptionPayment };
}