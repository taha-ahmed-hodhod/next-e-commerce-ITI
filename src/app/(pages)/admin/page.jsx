"use client";
import { useEffect, useState } from "react";
import { usersAPI, productsAPI, ordersAPI } from "@/lib/api";
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign } from "react-icons/fi";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    Promise.all([usersAPI.getAll({ limit: 1 }), productsAPI.getAll({ limit: 1 }), ordersAPI.getAll({ limit: 100 })])
      .then(([u, p, o]) => {
        const orders = o.data.data.orders || [];
        setStats({
          users: u.data.data.users?.length || 0,
          products: p.data.data.total || 0,
          orders: orders.length,
          revenue: orders.reduce((s, ord) => s + (ord.finalPrice || 0), 0),
        });
      }).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Users", value: stats.users, icon: <FiUsers size={24} />, color: "bg-blue-500" },
          { label: "Products", value: stats.products, icon: <FiPackage size={24} />, color: "bg-green-500" },
          { label: "Orders", value: stats.orders, icon: <FiShoppingBag size={24} />, color: "bg-yellow-500" },
          { label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: <FiDollarSign size={24} />, color: "bg-purple-500" },
        ].map((c) => (
          <div key={c.label} className="card p-6 flex items-center gap-4">
            <div className={`${c.color} text-white p-3 rounded-xl`}>{c.icon}</div>
            <div>
              <p className="text-gray-500 text-sm">{c.label}</p>
              <p className="text-2xl font-bold">{c.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
