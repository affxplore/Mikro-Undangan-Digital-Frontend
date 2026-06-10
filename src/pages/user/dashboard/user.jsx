import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { Plus, Bell } from "lucide-react";
import { motion } from "framer-motion";

// hooks
import { useDashboard } from "../../../api/dashboard/useDashboard";
import useUserNotification from "../../../api/user_notification/useUserNotification";

// utils
import { formatTimeAgo } from "../../../utils/Time";

// components
import NotificationItem from "../../../components/notification/NotificationItem";

export default function DashboardUser() {
  const navigate = useNavigate();
  const { userStats, fetchUserStats } = useDashboard();
  const {
    data: notifications,
    getList: getNotifications,
    remove: removeNotification,
  } = useUserNotification();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newInviteTitle, setNewInviteTitle] = useState("");
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);

  useEffect(() => {
    fetchUserStats();
    getNotifications();
  }, [fetchUserStats, getNotifications]);

  // ambil data dari userStats
  const invitationsActive = userStats?.activeInvitations ?? 0;
  const visitorCount = userStats?.totalVisitors ?? 0;
  const rsvpAccepted = userStats?.totalRSVP ?? 0;

  const chartData =
    userStats?.visitsAndRSVP?.map((item) => ({
      date: item.day,
      visits: item.visitors,
      rsvp: item.rsvp,
    })) ?? [];

  const activities =
    userStats?.recentActivities?.map((a) => ({
      id: a.id,
      text: `Undangan '${a.title}' dibuat`,
      time: new Date(a.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    })) ?? [];

  // derived totals
  const totals = useMemo(() => {
    const totalVisits = chartData.reduce((s, d) => s + d.visits, 0);
    const totalRsvps = chartData.reduce((s, d) => s + d.rsvp, 0);
    return { totalVisits, totalRsvps };
  }, [chartData]);

  // warna type notif
  const typeColors = {
    info: "bg-blue-500",
    promo: "bg-green-500",
    update: "bg-purple-500",
    maintenance: "bg-orange-500",
  };

  // toggle notif
  function toggleNotif() {
    setIsNotifOpen((prev) => !prev);
  }

  // tutup popup notif kalau klik luar
  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest(".notif-container")) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  function handleCreateInvite(e) {
    e.preventDefault();
    if (!newInviteTitle.trim()) return;
    setNewInviteTitle("");
    setShowCreateModal(false);
    // TODO: sambungin ke API create undangan
  }

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 text-slate-800">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Halo, Selamat Datang!
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Ringkasan aktivitas dan performa undangan kamu.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative notif-container">
            <button
              onClick={toggleNotif}
              className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition"
              aria-label="Notifikasi"
            >
              <Bell />
              <span className="text-sm font-medium">Notifikasi</span>
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {notifications.length}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg p-3 z-20">
                <h4 className="font-medium mb-2">Pemberitahuan</h4>
                <div className="space-y-2 max-h-44 overflow-auto">
                  {notifications.map((n) => (
                    <NotificationItem
                      key={n.id}
                      notif={n}
                      typeColors={typeColors}
                      onClick={setSelectedNotif}
                    />
                  ))}
                  {notifications.length === 0 && (
                    <div className="text-sm text-slate-500">
                      Tidak ada notifikasi.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* left column: stats & chart */}
        <section className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div className="p-4 rounded-2xl bg-blue-50 border shadow-sm">
              <div className="text-sm text-slate-500">Jumlah undangan aktif</div>
              <div className="mt-2 text-2xl font-bold text-slate-900">
                {invitationsActive}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                termasuk template tersimpan
              </div>
            </motion.div>
            <motion.div className="p-4 rounded-2xl bg-blue-50 border shadow-sm">
              <div className="text-sm text-slate-500">Jumlah kunjungan</div>
              <div className="mt-2 text-2xl font-bold text-slate-900">
                {visitorCount.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                total pengunjung keseluruhan
              </div>
            </motion.div>
            <motion.div className="p-4 rounded-2xl bg-blue-50 border shadow-sm">
              <div className="text-sm text-slate-500">Jumlah RSVP diterima</div>
              <div className="mt-2 text-2xl font-bold text-slate-900">
                {rsvpAccepted.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                hadir + konfirmasi
              </div>
            </motion.div>
          </div>

          {/* Chart */}
          <div className="bg-white border rounded-2xl shadow-sm p-4">
            <h3 className="text-lg font-medium mb-3">Kunjungan & RSVP</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="visits" barSize={16} />
                  <Line
                    type="monotone"
                    dataKey="rsvp"
                    stroke="#1E40AF"
                    strokeWidth={3}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 text-sm text-slate-500 flex gap-6">
              <div>
                Total kunjungan:{" "}
                <span className="font-semibold text-slate-800 ml-1">
                  {totals.totalVisits}
                </span>
              </div>
              <div>
                Total RSVP:{" "}
                <span className="font-semibold text-slate-800 ml-1">
                  {totals.totalRsvps}
                </span>
              </div>
            </div>
          </div>

          {/* Recent activities */}
          <div className="bg-white border rounded-2xl shadow-sm p-4">
            <h3 className="text-lg font-medium mb-3">Aktivitas Terbaru</h3>
            <ul className="space-y-3">
              {activities.map((a) => (
                <li key={a.id}>
                  <div className="text-sm font-medium">{a.text}</div>
                  <div className="text-xs text-slate-400">{a.time}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* right column: notifications, quick actions, small stats */}
        <aside className="space-y-6">
          <div className="p-4 rounded-2xl bg-blue-50 border shadow-sm">
            <h4 className="text-sm font-medium">Quick Action</h4>
            <div className="mt-3 grid gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // Mencegah event "naik" ke elemen induk
                  console.log("Tombol diklik, mencoba navigasi..."); 
                  navigate("/dashboard/templates");
                }}
                className="w-full py-2 px-3 rounded-lg bg-blue-600 text-white flex items-center justify-center gap-2 transition-all hover:bg-blue-700 active:scale-95 cursor-pointer shadow-sm"
              >
                <Plus size={18} />
                <span className="font-medium">Buat Undangan</span>
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="p-4 rounded-2xl border bg-white shadow-sm">
            <h4 className="text-sm font-medium mb-2">Pemberitahuan & Promo</h4>
            <div className="space-y-2">
              {notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  notif={n}
                  typeColors={typeColors}
                  onClick={setSelectedNotif}
                />
              ))}
              {notifications.length === 0 && (
                <div className="text-sm text-slate-500">
                  Tidak ada notifikasi.
                </div>
              )}
            </div>
          </div>

          {/* Rasio singkat */}
          <div className="p-4 rounded-2xl border bg-white shadow-sm">
            <h4 className="text-sm font-medium mb-2">Statistik Singkat</h4>
            <div className="text-sm text-slate-600">Rasio RSVP / Kunjungan</div>
            <div className="mt-3 text-2xl font-bold">
              {Math.round((rsvpAccepted / Math.max(visitorCount, 1)) * 100)}%
            </div>
            <div className="mt-2 text-xs text-slate-400">
              berdasarkan angka saat ini
            </div>
          </div>
        </aside>
      </main>

      {/* Modal Detail Notif */}
      {selectedNotif && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">
              {selectedNotif.title}
            </h3>
            <p className="text-sm text-slate-700 mb-4">
              {selectedNotif.content}
            </p>
            <div className="text-xs text-slate-400 mb-4">
              {formatTimeAgo(selectedNotif.createdAt)}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedNotif(null)}
                className="px-3 py-1 text-sm bg-slate-200 rounded hover:bg-slate-300"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  removeNotification(selectedNotif.id);
                  setSelectedNotif(null);
                }}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

