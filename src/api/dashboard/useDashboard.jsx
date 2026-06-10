import { useState, useCallback } from "react";
import { getAdminDashboardStats, getUserDashboardStats } from "./dashboardApi";

export function useDashboard() {
  const [adminStats, setAdminStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdminStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAdminDashboardStats();
      const raw = data.data;

      setAdminStats({
        totalUsers: Number(raw.totalUsers) || 0,
        activeUsers: Number(raw.activeUsers) || 0,
        totalInvitations: Number(raw.totalInvitations) || 0,
        activeInvitations: Number(raw.activeInvitations) || 0,
        totalVisits: Number(raw.totalVisits) || 0,
        totalTransactions: Number(raw.totalTransactions) || 0,
        totalRevenue: Number(raw.totalRevenue) || 0,
        totalTemplates: Number(raw.totalTemplates) || 0,

        // Normalisasi array
        newUsersPerMonth: (raw.newUsersPerMonth || []).map((item) => ({
          month: new Date(item.month).toLocaleString("id-ID", {
            month: "short",
            year: "numeric",
          }),
          total: Number(item.total),
        })),

        transactionsPerMonth: (raw.transactionsPerMonth || []).map((item) => ({
          month: new Date(item.month).toLocaleString("id-ID", {
            month: "short",
            year: "numeric",
          }),
          total: Number(item.total),
        })),

        paketPopuler: (raw.paketPopuler || []).map((item) => ({
          subscription_name: item.subscription_name,
          total: Number(item.total),
        })),
      });
    } catch (err) {
      setError(err.response?.data?.message || "Gagal ambil data admin stats");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getUserDashboardStats();
      setUserStats(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal ambil data user stats");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    adminStats,
    userStats,
    loading,
    error,
    fetchAdminStats,
    fetchUserStats,
  };
}
