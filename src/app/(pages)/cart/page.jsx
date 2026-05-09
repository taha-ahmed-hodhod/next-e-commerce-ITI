"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCart, setLoading, optimisticUpdate, optimisticRemove, clearCartState, selectCart, selectCartLoading } from "@/store/slices/cartSlice";
import { cartAPI, ordersAPI } from "@/lib/api";
import { selectIsLoggedIn } from "@/store/slices/authSlice";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CartPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const cart = useSelector(selectCart);
  const loading = useSelector(selectCartLoading);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({ street: "", city: "", country: "", zipCode: "", paymentMethod: "cash_on_delivery" });
  const [placing, setPlacing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!isLoggedIn || !mounted) return;
    dispatch(setLoading(true));
    cartAPI.get()
      .then((res) => dispatch(setCart(res.data.data.cart)))
      .catch(() => {})
      .finally(() => dispatch(setLoading(false)));
  }, [isLoggedIn, mounted, dispatch]);

  const handleUpdate = async (productId, quantity) => {
    dispatch(optimisticUpdate({ productId, quantity }));
    try { await cartAPI.update(productId, quantity); }
    catch { toast.error("Failed"); cartAPI.get().then((r) => dispatch(setCart(r.data.data.cart))); }
  };

  const handleRemove = async (productId) => {
    dispatch(optimisticRemove(productId));
    try { await cartAPI.remove(productId); }
    catch { toast.error("Failed"); cartAPI.get().then((r) => dispatch(setCart(r.data.data.cart))); }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);
    try {
      await ordersAPI.place({
        shippingAddress: { street: orderForm.street, city: orderForm.city, country: orderForm.country, zipCode: orderForm.zipCode },
        paymentMethod: orderForm.paymentMethod,
      });
      dispatch(clearCartState());
      toast.success("Order placed!");
      router.push("/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally { setPlacing(false); }
  };

  if (!mounted) return null;

  if (!isLoggedIn) return (
    <div className="text-center py-20">
      <p className="text-gray-500 mb-4">Please login to view your cart</p>
      <Link href="/auth/login" className="btn-primary">Login</Link>
    </div>
  );

  if (loading) return <div className="text-center py-20 text-gray-400">Loading cart...</div>;

  if (!cart || cart.items?.length === 0) return (
    <div className="text-center py-20">
      <FiShoppingBag className="mx-auto text-gray-300 mb-4" size={64} />
      <p className="text-xl text-gray-500 mb-4">Your cart is empty</p>
      <Link href="/products" className="btn-primary">Browse Products</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item._id} className="card flex gap-4 items-center">
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.product?.images?.[0] ? (
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                ) : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{item.product?.name}</p>
                <p className="text-primary font-bold">${item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleUpdate(item.product._id, item.quantity - 1)} className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-100"><FiMinus size={14} /></button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button onClick={() => handleUpdate(item.product._id, item.quantity + 1)} className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-100"><FiPlus size={14} /></button>
              </div>
              <p className="font-bold w-20 text-right">${(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => handleRemove(item.product._id)} className="text-red-400 hover:text-red-600 ml-2"><FiTrash2 /></button>
            </div>
          ))}
        </div>

        <div className="card p-6 h-fit sticky top-24">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex justify-between"><span>Subtotal</span><span>${cart.totalPrice?.toFixed(2)}</span></div>
            <div className="border-t pt-2 flex justify-between font-bold text-gray-900 text-base">
              <span>Total</span><span>${(cart.totalPrice - (cart.discount || 0)).toFixed(2)}</span>
            </div>
          </div>
          <button onClick={() => setCheckoutOpen(true)} className="btn-primary w-full py-3">Checkout</button>
        </div>
      </div>

      {checkoutOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8">
            <h2 className="text-xl font-bold mb-6">Complete Your Order</h2>
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <input className="input-field" placeholder="Street address" value={orderForm.street} onChange={(e) => setOrderForm({ ...orderForm, street: e.target.value })} required />
              <div className="grid grid-cols-2 gap-3">
                <input className="input-field" placeholder="City" value={orderForm.city} onChange={(e) => setOrderForm({ ...orderForm, city: e.target.value })} required />
                <input className="input-field" placeholder="Country" value={orderForm.country} onChange={(e) => setOrderForm({ ...orderForm, country: e.target.value })} required />
              </div>
              <input className="input-field" placeholder="Zip Code (optional)" value={orderForm.zipCode} onChange={(e) => setOrderForm({ ...orderForm, zipCode: e.target.value })} />
              <select className="input-field" value={orderForm.paymentMethod} onChange={(e) => setOrderForm({ ...orderForm, paymentMethod: e.target.value })}>
                <option value="cash_on_delivery">Cash on Delivery</option>
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="wallet">Wallet</option>
              </select>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setCheckoutOpen(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1" disabled={placing}>{placing ? "Placing..." : "Place Order"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
