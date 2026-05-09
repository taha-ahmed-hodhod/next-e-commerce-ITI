"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts, setProductsLoading, removeProduct, selectProducts, selectProductsLoading } from "@/store/slices/dataSlices";
import { selectUser } from "@/store/slices/authSlice";
import { productsAPI, categoriesAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { FiTrash2, FiPlus } from "react-icons/fi";

export default function SellerProductsPage() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "", category: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(setProductsLoading(true));
    Promise.all([productsAPI.getAll({ limit: 50 }), categoriesAPI.getAll()])
      .then(([p, c]) => { dispatch(setProducts(p.data.data)); setCategories(c.data.data.categories); })
      .catch(() => toast.error("Failed to load"))
      .finally(() => dispatch(setProductsLoading(false)));
  }, [dispatch]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await productsAPI.add(form);
      toast.success("Product added!");
      setShowForm(false);
      setForm({ name: "", description: "", price: "", stock: "", category: "" });
      const res = await productsAPI.getAll({ limit: 50 });
      dispatch(setProducts(res.data.data));
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;
    try { await productsAPI.delete(id); dispatch(removeProduct(id)); toast.success("Deleted"); }
    catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Products</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <FiPlus /> {showForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card p-6 mb-8 space-y-4">
          <h2 className="font-semibold text-lg">New Product</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input type="number" className="input-field" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input type="number" className="input-field" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea className="input-field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? "Adding..." : "Add Product"}</button>
        </form>
      )}

      {loading ? <div className="text-gray-400">Loading...</div> : (
        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>{["Product", "Category", "Price", "Stock", "Actions"].map((h) => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium">{p.name}</td>
                  <td className="px-5 py-3 text-gray-500">{p.category?.name}</td>
                  <td className="px-5 py-3 font-semibold">${p.price}</td>
                  <td className="px-5 py-3"><span className={`badge ${p.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>{p.stock}</span></td>
                  <td className="px-5 py-3"><button onClick={() => handleDelete(p._id)} className="text-red-400 hover:text-red-600"><FiTrash2 /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
