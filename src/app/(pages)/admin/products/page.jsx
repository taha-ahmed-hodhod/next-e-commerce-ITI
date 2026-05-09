"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts, setProductsLoading, removeProduct, selectProducts, selectProductsLoading } from "@/store/slices/dataSlices";
import { productsAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";

export default function AdminProductsPage() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);

  useEffect(() => {
    dispatch(setProductsLoading(true));
    productsAPI.getAll({ limit: 50 }).then((r) => dispatch(setProducts(r.data.data))).catch(() => toast.error("Failed")).finally(() => dispatch(setProductsLoading(false)));
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try { await productsAPI.delete(id); dispatch(removeProduct(id)); toast.success("Deleted"); }
    catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      {loading ? <div className="text-gray-400">Loading...</div> : (
        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                {["Product", "Category", "Price", "Stock", "Seller", "Actions"].map((h) => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium max-w-xs truncate">{p.name}</td>
                  <td className="px-5 py-3 text-gray-500">{p.category?.name}</td>
                  <td className="px-5 py-3 font-semibold">${p.price}</td>
                  <td className="px-5 py-3"><span className={`badge ${p.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>{p.stock}</span></td>
                  <td className="px-5 py-3 text-gray-500">{p.seller?.username}</td>
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
