"use client";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "@/store/slices/cartSlice";
import { selectIsLoggedIn } from "@/store/slices/authSlice";
import { cartAPI } from "@/lib/api";
import { FiShoppingCart, FiStar } from "react-icons/fi";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please login first");
      return;
    }
    try {
      await cartAPI.add(product._id, 1);
      const res = await cartAPI.get();
      dispatch(setCart(res.data.data.cart));
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
    >
      <Link href={`/products/${product._id}`}>
        <motion.div
          className="card hover:shadow-xl transition-all group flex flex-col h-full overflow-hidden bg-white"
          whileHover={{ y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {/* Image Container */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg h-48 mb-4 overflow-hidden flex items-center justify-center relative">
            {product.images?.[0] ? (
              <motion.img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <div className="text-gray-300 text-5xl">📦</div>
            )}
            {product.stock === 0 && (
              <motion.div
                className="absolute inset-0 bg-black/40 flex items-center justify-center"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <span className="badge bg-red-600 text-white">
                  Out of Stock
                </span>
              </motion.div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col p-0.5">
            <motion.p
              className="text-xs text-primary font-bold mb-1 uppercase tracking-wider"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {product.category?.name || "Uncategorized"}
            </motion.p>

            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm leading-snug">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 text-sm mb-3">
              <div className="flex items-center gap-0.5">
                <FiStar className="fill-yellow-400 text-yellow-400" size={14} />
                <span className="font-semibold text-gray-900">
                  {(product.ratingsAverage || 0).toFixed(1)}
                </span>
              </div>
              <span className="text-gray-500">
                ({product.ratingsCount || 0})
              </span>
            </div>

            {/* Price & Button */}
            <div className="flex items-center justify-between mt-auto gap-2">
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                  ${product.price}
                </span>
              </div>
              <motion.button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-primary py-2 px-3 text-sm font-medium flex items-center gap-1 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: product.stock === 0 ? 1 : 1.05 }}
                whileTap={{ scale: product.stock === 0 ? 1 : 0.95 }}
              >
                <FiShoppingCart size={14} /> Add
              </motion.button>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
