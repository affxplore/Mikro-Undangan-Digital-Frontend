import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  BarChart, Bar,
  PieChart, Pie, Cell, Legend
} from "recharts";

// Dummy Data
const userActivity = [
  { id: 1, user: "Hadi", role: "User", action: "Login", time: "2025-08-19 08:00" },
  { id: 2, user: "Yanto", role: "Admin", action: "Add New Template", time: "2025-08-19 09:15" },
  { id: 3, user: "Yanti", role: "User", action: "Logout", time: "2025-08-19 10:30" },
];

const errorLogs = [
  { id: 1, message: "404 Page Not Found", time: "2025-08-19 08:10" },
  { id: 2, message: "500 Internal Server Error", time: "2025-08-19 09:20" },
];

const trafficStats = [
  { period: "2025-08-13", visits: 120, revenue: 250.000 },
  { period: "2025-08-14", visits: 150, revenue: 300.000 },
  { period: "2025-08-15", visits: 170, revenue: 350.000 },
  { period: "2025-08-16", visits: 200, revenue: 400.000 },
];

const packages = [
  { name: "Basic", users: 45 },
  { name: "Premium", users: 30 },
  { name: "VIP", users: 25 },
];

const invitations = [
  { id: 1, title: "Christmas Eve", views: 1200, shares: 100 },
  { id: 2, title: "New Year Party", views: 900, shares: 50 },
];

const userStatus = [
  { name: "Aktif", value: 80 },
  { name: "Nonaktif", value: 20 },
];


const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Helper Table
const Table = ({ columns, data }) => (
  <table className="min-w-full border-collapse border">
    <thead>
      <tr>
        {columns.map((col) => (
          <th key={col} className="border p-2 text-left bg-gray-100">{col}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, i) => (
        <tr key={i}>
          {columns.map((col) => (
            <td key={col} className="border p-2">{row[col.toLowerCase()]}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default function WebsiteReport() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Laporan Website</h1>
      <p className="text-gray-600">Halaman untuk memberikan insight untuk pengembangan bisnis.</p>

      {/* Aktivitas Pengguna */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Aktivitas Pengguna</h2>
        <Table columns={["User", "Role", "Action", "Time"]} data={userActivity} />
      </section>

      {/* Error Log */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Error Log</h2>
        <Table columns={["Message", "Time"]} data={errorLogs} />
      </section>

      {/* Statistik */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Statistik</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trafik & Revenue */}
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">Trafik & Pendapatan Harian</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trafficStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visits" stroke="#0088FE" />
                <Line type="monotone" dataKey="revenue" stroke="#FFBB28" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Paket Paling Diminati */}
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">Paket yang Paling Diminati</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={packages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* User Aktif vs Nonaktif */}
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">User Aktif vs Nonaktif</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={userStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {userStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
      </section>

      {/* Daftar Undangan Populer */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Daftar Undangan Populer</h2>
        <Table columns={["Title", "Views", "Shares"]} data={invitations} />
      </section>
    </div>
  );
}
