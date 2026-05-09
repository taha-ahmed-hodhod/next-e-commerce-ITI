"use client";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/slices/authSlice";
import Link from "next/link";
import { FiPackage, FiPlusCircle } from "react-icons/fi";

export default function SellerDashboard() {
  const user = useSelector(selectUser);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Welcome, {user?.email}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link href="/seller/products" className="card p-8 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-indigo-500 text-white p-3 rounded-xl"><FiPackage size={24} /></div>
          <div>
            <p className="font-semibold text-lg">My Products</p>
            <p className="text-gray-500 text-sm">View and manage your products</p>
          </div>
        </Link>
        <Link href="/seller/products" className="card p-8 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-green-500 text-white p-3 rounded-xl"><FiPlusCircle size={24} /></div>
          <div>
            <p className="font-semibold text-lg">Add Product</p>
            <p className="text-gray-500 text-sm">List a new product for sale</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
