"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectRole } from "@/store/slices/authSlice";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { FiUsers, FiPackage, FiShoppingBag, FiGrid } from "react-icons/fi";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: <FiGrid /> },
  { href: "/admin/users", label: "Users", icon: <FiUsers /> },
  { href: "/admin/products", label: "Products", icon: <FiPackage /> },
  { href: "/admin/orders", label: "Orders", icon: <FiShoppingBag /> },
];

export default function AdminLayout({ children }) {
  const role = useSelector(selectRole);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && role && role !== "ADMIN") router.push("/");
  }, [role, router, mounted]);

  if (!mounted) return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900" />
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <p className="text-xl font-bold text-primary">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm font-medium ${pathname === item.href ? "bg-primary text-white" : "text-gray-300 hover:bg-gray-800"}`}>
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50 p-8 overflow-auto">{children}</main>
    </div>
  );
}
