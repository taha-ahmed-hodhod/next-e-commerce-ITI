"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrders, setOrdersLoading, updateOrder, selectOrders, selectOrdersLoading } from "@/store/slices/dataSlices";
import { ordersAPI } from "@/lib/api";
import toast from "react-hot-toast";

const STATUSES = ["placed", "confirmed", "shipped", "delivered", "cancelled"];
const STATUS_COLORS = { placed: "bg-blue-100 text-blue-700", confirmed: "bg-indigo-100 text-indigo-700", shipped: "bg-yellow-100 text-yellow-700", delivered: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700" };

export default function AdminOrdersPage() {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const loading = useSelector(selectOrdersLoading);

  useEffect(() => {
    dispatch(setOrdersLoading(true));
    ordersAPI.getAll().then((r) => dispatch(setOrders(r.data.data.orders))).catch(() => toast.error("Failed")).finally(() => dispatch(setOrdersLoading(false)));
  }, [dispatch]);

  const handleStatusChange = async (id, orderStatus) => {
    try {
      const res = await ordersAPI.updateStatus(id, orderStatus);
      dispatch(updateOrder(res.data.data.order));
      toast.success("Status updated");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      {loading ? <div className="text-gray-400">Loading...</div> : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                <div><p className="text-xs text-gray-400">Order ID</p><p className="font-mono text-sm">{order._id}</p></div>
                <div><p className="text-xs text-gray-400">Customer</p><p className="text-sm font-medium">{order.user?.username} — {order.user?.email}</p></div>
                <div><p className="text-xs text-gray-400">Total</p><p className="font-bold">${order.finalPrice?.toFixed(2)}</p></div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${STATUS_COLORS[order.orderStatus]}`}>{order.orderStatus}</span>
                  <select className="input-field w-auto text-sm py-1" value={order.orderStatus} onChange={(e) => handleStatusChange(order._id, e.target.value)}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {order.items?.map((item) => (
                  <span key={item._id} className="inline-block bg-gray-100 px-2 py-0.5 rounded mr-2 mb-1">{item.product?.name} ×{item.quantity}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
