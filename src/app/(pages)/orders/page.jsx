"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrders, setOrdersLoading, cancelOrderState, selectOrders, selectOrdersLoading } from "@/store/slices/dataSlices";
import { ordersAPI } from "@/lib/api";
import { selectIsLoggedIn } from "@/store/slices/authSlice";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiPackage } from "react-icons/fi";

const STATUS_COLORS = {
  placed: "bg-blue-100 text-blue-700", confirmed: "bg-indigo-100 text-indigo-700",
  shipped: "bg-yellow-100 text-yellow-700", delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const loading = useSelector(selectOrdersLoading);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!isLoggedIn || !mounted) return;
    dispatch(setOrdersLoading(true));
    ordersAPI.getMyOrders()
      .then((r) => dispatch(setOrders(r.data.data.orders)))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => dispatch(setOrdersLoading(false)));
  }, [isLoggedIn, mounted, dispatch]);

  const handleCancel = async (id) => {
    try {
      await ordersAPI.cancel(id);
      dispatch(cancelOrderState(id));
      toast.success("Order cancelled");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  if (!mounted) return null;

  if (!isLoggedIn) return (
    <div className="text-center py-20"><Link href="/auth/login" className="btn-primary">Login to view orders</Link></div>
  );

  if (loading) return <div className="text-center py-20 text-gray-400">Loading orders...</div>;

  if (orders.length === 0) return (
    <div className="text-center py-20">
      <FiPackage className="mx-auto text-gray-300 mb-4" size={64} />
      <p className="text-xl text-gray-500 mb-4">No orders yet</p>
      <Link href="/products" className="btn-primary">Start Shopping</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-mono text-sm font-medium">{order._id}</p>
              </div>
              <span className={`badge ${STATUS_COLORS[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>{order.orderStatus}</span>
            </div>
            <div className="space-y-2 mb-4">
              {order.items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm text-gray-600">
                  <span>{item.product?.name} × {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">Total: <span className="font-bold text-gray-900">${order.finalPrice?.toFixed(2)}</span></p>
              {["placed", "confirmed"].includes(order.orderStatus) && (
                <button onClick={() => handleCancel(order._id)} className="btn-danger text-sm py-1.5 px-4">Cancel Order</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
