/* eslint-disable no-unused-vars */
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaLayerGroup,
  FaCrown,
  FaCog,
  FaCreditCard,
  FaBoxOpen,
  FaTags,
  FaFilter,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const tiles = [
  {
    key: "kategori",
    title: "Kategori",
    description: "Pengelompokan item/layanan.",
    icon: FaLayerGroup,
    href: "kategori",
    tags: ["inventori", "menu"],
  },
  {
    key: "konten-sistem",
    title: "Konten Sistem",
    description: "Kelola konten dan konfigurasi sistem.",
    icon: FaCog,
    href: "systemcontent",
    tags: ["sistem", "konten"],
  },
  {
    key: "metode-pembayaran",
    title: "Metode Pembayaran",
    description: "Atur cara pembayaran yang tersedia.",
    icon: FaCreditCard,
    href: "payment",
    tags: ["pembayaran", "finance"],
  },
  {
    key: "subscription",
    title: "Subscription",
    description: "Free / Pro, siklus & billing.",
    icon: FaCrown,
    href: "subscription",
    tags: ["free", "pro"],
  },
  {
    key: "harga",
    title: "Paket dan Harga",
    description: "Atur harga, promo, dan voucher diskon.",
    icon: FaTags,
    href: "packagecost",
    tags: ["harga", "promo", "voucher"],
  },
  {
    key: "role",
    title: "Role",
    description: "Atur role & limit akses sistem.",
    icon: FaUsers,
    href: "role",
    tags: ["role", "akses"],
  },
  {
    key: "staff",
    title: "Staff",
    description: "Kelola staff & tetapkan role mereka.",
    icon: FaBoxOpen,
    href: "staff",
    tags: ["staff", "user", "role"],
  },
   {
    key: "systemmessage",
    title: "System Message",
    description: "Kelola pesan sistem untuk pengguna.",
    icon: FaBoxOpen,
    href: "systemmessage",
    tags: ["maintenance", "notification"],
  },
];


export default function DataMasterPage() {
  const [q, setQ] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const navigate = useNavigate();
  const open = (href) => () => {
    navigate(href);
  };

  const allTags = useMemo(() => {
    const s = new Set(["all"]);
    tiles.forEach((t) => t.tags?.forEach((x) => s.add(x)));
    return Array.from(s);
  }, []);

  const filtered = useMemo(() => {
    return tiles.filter((t) => {
      const matchesText =
        !q ||
        t.title.toLowerCase().includes(q.toLowerCase()) ||
        t.description.toLowerCase().includes(q.toLowerCase());
      const matchesTag = activeTag === "all" || t.tags?.includes(activeTag);
      return matchesText && matchesTag;
    });
  }, [q, activeTag]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-slate-50 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Data Master</h1>
        <p className="text-sm text-gray-500">Akses cepat ke modul utama.</p>
      </header>

      <div className="mb-4 flex gap-2">
        <input
          className="border rounded-lg px-3 py-2 w-full"
          placeholder="Cari modul..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {/* <button
          className="border rounded-lg px-3 py-2 flex items-center gap-1"
          onClick={() => setActiveTag("all")}
        >
          <FaFilter /> Filter
        </button> */}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t, idx) => {
          const Icon = t.icon;
          return (
            <motion.div
              key={t.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              onClick={open(t.href)}
              className="cursor-pointer border rounded-xl p-4 hover:shadow-lg bg-white"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-green-50 rounded-lg">
                  <Icon className="text-green-600" />
                </div>
                <div>
                  <h2 className="font-semibold">{t.title}</h2>
                  <p className="text-sm text-gray-500">{t.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {t.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs border rounded-full bg-gray-50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
