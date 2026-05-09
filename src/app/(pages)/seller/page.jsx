"use client";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/slices/authSlice";
import Link from "next/link";
import { FiPackage, FiPlusCircle, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

const cards = [
  {
    href: "/seller/products",
    title: "My Products",
    desc: "View and manage your listings",
    icon: <FiPackage size={28} />,
    gradient: "from-primary/20 to-cyan-900/30",
    iconColor: "text-primary",
    glow: "shadow-[0_0_20px_rgba(0,229,255,0.1)]",
  },
  {
    href: "/seller/products",
    title: "Add Product",
    desc: "List a new product for sale",
    icon: <FiPlusCircle size={28} />,
    gradient: "from-purple-500/20 to-purple-900/30",
    iconColor: "text-purple-400",
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.1)]",
  },
];

export default function SellerDashboard() {
  const user = useSelector(selectUser);

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm text-primary font-bold tracking-widest uppercase mb-2">Seller Dashboard</p>
        <h1 className="text-4xl font-black text-white tracking-tight">
          Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}!
        </h1>
        <p className="text-gray-400 mt-2">Manage your store from one place.</p>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Link
              href={card.href}
              className={`flex items-center gap-5 p-7 rounded-2xl bg-gradient-to-br ${card.gradient} border border-white/10 ${card.glow} hover:border-white/20 transition-all group`}
            >
              <div className={`${card.iconColor} p-3 rounded-xl bg-black/30 group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
              <div className="flex-1">
                <p className="font-bold text-white text-lg">{card.title}</p>
                <p className="text-gray-400 text-sm">{card.desc}</p>
              </div>
              <FiArrowRight className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" size={20} />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
