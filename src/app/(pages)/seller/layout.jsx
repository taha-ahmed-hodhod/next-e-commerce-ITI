"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectRole } from "@/store/slices/authSlice";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { FiPackage, FiGrid } from "react-icons/fi";

const navItems = [
  { href: "/seller", label: "Dashboard", icon: <FiGrid /> },
  { href: "/seller/products", label: "My Products", icon: <FiPackage /> },
];

export default function SellerLayout({ children }) {
  const role = useSelector(selectRole);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && role && role !== "SELLER" && role !== "ADMIN") router.push("/");
  }, [role, router, mounted]);

  if (!mounted) return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-indigo-900" />
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-indigo-900 text-white flex flex-col">
        <div className="p-6 border-b border-indigo-700">
          <p className="text-xl font-bold text-indigo-200">Seller Hub</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm font-medium ${pathname === item.href ? "bg-primary text-white" : "text-indigo-200 hover:bg-indigo-800"}`}>
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50 p-8 overflow-auto">{children}</main>
    </div>
  );
}
