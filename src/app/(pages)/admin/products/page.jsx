"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setProducts, setProductsLoading, removeProduct,
  selectProducts, selectProductsLoading,
} from "@/store/slices/dataSlices";
import { productsAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { FiTrash2, FiPackage, FiImage } from "react-icons/fi";
import { motion } from "framer-motion";

export default function AdminProductsPage() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);

  useEffect(() => {
    dispatch(setProductsLoading(true));
    productsAPI.getAll({ limit: 50 })
      .then((r) => dispatch(setProducts(r.data.data)))
      .catch(() => toast.error("Failed to load products"))
      .finally(() => dispatch(setProductsLoading(false)));
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await productsAPI.delete(id);
      dispatch(removeProduct(id));
      toast.success("Product deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-primary font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
          <FiPackage size={14} /> Management
        </p>
        <h1 className="text-4xl font-black text-white tracking-tight">Products</h1>
        <p className="text-gray-400 mt-1">{products.length} products on platform</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-14 bg-surface rounded-xl animate-pulse border border-white/5" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <FiPackage size={48} className="mx-auto mb-4 text-gray-700" />
          <p className="text-lg font-bold text-white">No products found</p>
        </div>
      ) : (
        <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-surface-light">
                {["Product", "Category", "Price", "Stock", "Seller", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left font-bold text-gray-400 uppercase tracking-wider text-xs">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((p, i) => (
                <motion.tr
                  key={p._id}
                  className="hover:bg-white/5 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover border border-white/10"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-surface-light border border-white/10 flex items-center justify-center text-gray-600">
                          <FiImage size={14} />
                        </div>
                      )}
                      <span className="font-semibold text-white max-w-[180px] truncate">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{p.category?.name || "—"}</td>
                  <td className="px-6 py-4 font-bold text-primary">${p.price}</td>
                  <td className="px-6 py-4">
                    <span className={`badge text-xs ${
                      p.stock > 10
                        ? "bg-green-900/30 text-green-400 border border-green-800"
                        : p.stock > 0
                        ? "bg-yellow-900/30 text-yellow-400 border border-yellow-800"
                        : "bg-red-900/30 text-red-400 border border-red-800"
                    }`}>
                      {p.stock} left
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{p.seller?.username || "—"}</td>
                  <td className="px-6 py-4">
                    <motion.button
                      onClick={() => handleDelete(p._id)}
                      className="text-gray-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-900/20"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiTrash2 size={16} />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
