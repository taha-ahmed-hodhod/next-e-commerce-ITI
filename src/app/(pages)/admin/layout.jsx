"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectRole } from "@/store/slices/authSlice";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { FiUsers, FiPackage, FiShoppingBag, FiGrid, FiMenu, FiShield } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: <FiGrid size={18} /> },
  { href: "/admin/users", label: "Users", icon: <FiUsers size={18} /> },
  { href: "/admin/products", label: "Products", icon: <FiPackage size={18} /> },
  { href: "/admin/orders", label: "Orders", icon: <FiShoppingBag size={18} /> },
];

export default function AdminLayout({ children }) {
  const role = useSelector(selectRole);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (mounted && role && role !== "ADMIN") router.push("/");
  }, [role, router, mounted]);

  if (!mounted) return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <aside className="w-64 bg-surface border-r border-white/5 hidden md:block" />
      <main className="flex-1 bg-surface-dark p-8" />
    </div>
  );

  const Sidebar = () => (
    <aside className="w-64 bg-surface border-r border-white/5 flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <FiShield className="text-primary drop-shadow-[0_0_6px_rgba(0,229,255,0.5)]" size={20} />
          <span className="font-black text-white tracking-tight">Admin Panel</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(0,229,255,0.08)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className={active ? "text-primary" : "text-gray-500"}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-white/5">
        <p className="text-xs text-gray-600">ShopHole Admin Center</p>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-surface-dark">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              className="fixed left-0 top-0 h-full z-50 md:hidden"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-surface">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white">
            <FiMenu size={22} />
          </button>
          <span className="font-bold text-white">Admin Panel</span>
        </div>
        <main className="flex-1 p-6 md:p-10 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
