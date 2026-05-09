"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setOrders, setOrdersLoading, updateOrder,
  selectOrders, selectOrdersLoading,
} from "@/store/slices/dataSlices";
import { ordersAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { FiShoppingBag, FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";

const STATUSES = ["placed", "confirmed", "shipped", "delivered", "cancelled"];

const STATUS_STYLES = {
  placed: "bg-blue-900/30 text-blue-400 border border-blue-800",
  confirmed: "bg-cyan-900/30 text-cyan-400 border border-cyan-800",
  shipped: "bg-yellow-900/30 text-yellow-400 border border-yellow-800",
  delivered: "bg-green-900/30 text-green-400 border border-green-800",
  cancelled: "bg-red-900/30 text-red-400 border border-red-800",
};

export default function AdminOrdersPage() {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const loading = useSelector(selectOrdersLoading);

  useEffect(() => {
    dispatch(setOrdersLoading(true));
    ordersAPI.getAll()
      .then((r) => dispatch(setOrders(r.data.data.orders)))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => dispatch(setOrdersLoading(false)));
  }, [dispatch]);

  const handleStatusChange = async (id, orderStatus) => {
    try {
      const res = await ordersAPI.updateStatus(id, orderStatus);
      dispatch(updateOrder(res.data.data.order));
      toast.success("Status updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-primary font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
          <FiShoppingBag size={14} /> Management
        </p>
        <h1 className="text-4xl font-black text-white tracking-tight">Orders</h1>
        <p className="text-gray-400 mt-1">{orders.length} total orders</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 bg-surface rounded-2xl animate-pulse border border-white/5" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <FiShoppingBag size={48} className="mx-auto mb-4 text-gray-700" />
          <p className="text-lg font-bold text-white">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order._id}
              className="bg-surface border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                {/* Order ID */}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Order ID</p>
                  <p className="font-mono text-sm text-gray-300">{order._id}</p>
                </div>

                {/* Customer */}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Customer</p>
                  <p className="text-sm text-white font-semibold">{order.user?.username}</p>
                  <p className="text-xs text-gray-400">{order.user?.email}</p>
                </div>

                {/* Total */}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Total</p>
                  <p className="text-xl font-black text-primary">${order.finalPrice?.toFixed(2)}</p>
                </div>

                {/* Status */}
                <div className="flex items-center gap-3">
                  <span className={`badge text-xs ${STATUS_STYLES[order.orderStatus]}`}>
                    {order.orderStatus}
                  </span>
                  <div className="relative">
                    <select
                      className="input-field w-auto text-xs py-1.5 pr-8 appearance-none"
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                  </div>
                </div>
              </div>

              {/* Items */}
              {order.items?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                  {order.items.map((item) => (
                    <span
                      key={item._id}
                      className="inline-block bg-surface-light border border-white/5 text-gray-400 text-xs px-3 py-1 rounded-lg"
                    >
                      {item.product?.name} ×{item.quantity}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
