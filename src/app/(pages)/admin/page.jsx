"use client";
import { useEffect, useState } from "react";
import { usersAPI, productsAPI, ordersAPI } from "@/lib/api";
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign, FiTrendingUp } from "react-icons/fi";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      usersAPI.getAll({ limit: 1 }),
      productsAPI.getAll({ limit: 1 }),
      ordersAPI.getAll({ limit: 100 }),
    ])
      .then(([u, p, o]) => {
        const orders = o.data.data.orders || [];
        setStats({
          users: u.data.data.users?.length || 0,
          products: p.data.data.total || 0,
          orders: orders.length,
          revenue: orders.reduce((s, ord) => s + (ord.finalPrice || 0), 0),
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: "Total Users",
      value: stats.users,
      icon: <FiUsers size={22} />,
      gradient: "from-cyan-500/20 to-cyan-900/10",
      iconBg: "bg-cyan-500/10 text-primary",
      glow: "shadow-[0_0_20px_rgba(0,229,255,0.06)]",
    },
    {
      label: "Total Products",
      value: stats.products,
      icon: <FiPackage size={22} />,
      gradient: "from-purple-500/20 to-purple-900/10",
      iconBg: "bg-purple-500/10 text-purple-400",
      glow: "shadow-[0_0_20px_rgba(168,85,247,0.06)]",
    },
    {
      label: "Total Orders",
      value: stats.orders,
      icon: <FiShoppingBag size={22} />,
      gradient: "from-yellow-500/20 to-yellow-900/10",
      iconBg: "bg-yellow-500/10 text-yellow-400",
      glow: "shadow-[0_0_20px_rgba(234,179,8,0.06)]",
    },
    {
      label: "Total Revenue",
      value: `$${stats.revenue.toFixed(2)}`,
      icon: <FiDollarSign size={22} />,
      gradient: "from-green-500/20 to-green-900/10",
      iconBg: "bg-green-500/10 text-green-400",
      glow: "shadow-[0_0_20px_rgba(34,197,94,0.06)]",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm text-primary font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
          <FiTrendingUp size={14} /> Overview
        </p>
        <h1 className="text-4xl font-black text-white tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-400 mt-2">Monitor your platform&apos;s performance in real time.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            className={`rounded-2xl bg-gradient-to-br ${card.gradient} border border-white/10 p-6 ${card.glow} hover:border-white/20 hover:-translate-y-1 transition-all`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className={`inline-flex p-3 rounded-xl ${card.iconBg} mb-4`}>
              {card.icon}
            </div>
            <p className="text-gray-400 text-sm font-medium mb-1">{card.label}</p>
            {loading ? (
              <div className="h-8 w-20 bg-white/5 rounded-lg animate-pulse" />
            ) : (
              <p className="text-3xl font-black text-white">{card.value}</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
