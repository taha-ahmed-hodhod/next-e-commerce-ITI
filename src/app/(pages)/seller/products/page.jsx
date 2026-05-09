"use client";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setProducts,
  setProductsLoading,
  removeProduct,
  selectProducts,
  selectProductsLoading,
} from "@/store/slices/dataSlices";
import { productsAPI, categoriesAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { FiTrash2, FiPlus, FiX, FiUpload, FiImage, FiPackage, FiDollarSign, FiTag } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function SellerProductsPage() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", price: "", stock: "", category: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(setProductsLoading(true));
    Promise.all([productsAPI.getAll({ limit: 50 }), categoriesAPI.getAll()])
      .then(([p, c]) => {
        dispatch(setProducts(p.data.data));
        setCategories(c.data.data.categories);
      })
      .catch(() => toast.error("Failed to load"))
      .finally(() => dispatch(setProductsLoading(false)));
  }, [dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", stock: "", category: "" });
    clearImage();
    setShowForm(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let images = [];

      // Convert image to base64 data URL in the browser — no cloud upload needed
      if (imageFile) {
        setUploading(true);
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
        images = [dataUrl];
        setUploading(false);
      }

      await productsAPI.add({ ...form, images });
      toast.success("Product added!");
      resetForm();
      const res = await productsAPI.getAll({ limit: 50 });
      dispatch(setProducts(res.data.data));
    } catch (err) {
      toast.error(err.message || err.response?.data?.message || "Failed");
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

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
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">My Products</h1>
          <p className="text-gray-400 mt-1">{products.length} product{products.length !== 1 ? "s" : ""} listed</p>
        </div>
        <motion.button
          onClick={() => setShowForm(!showForm)}
          className={showForm ? "btn-outline flex items-center gap-2" : "btn-primary flex items-center gap-2"}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {showForm ? <><FiX /> Cancel</> : <><FiPlus /> Add Product</>}
        </motion.button>
      </div>

      {/* Add Product Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={handleAdd}
            className="bg-surface border border-white/10 rounded-2xl p-8 mb-10 shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <FiPackage className="text-primary" /> New Product
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <span className="flex items-center gap-1"><FiTag size={13} /> Product Name</span>
                </label>
                <input
                  className="input-field"
                  placeholder="e.g. Premium Wireless Headphones"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  className="input-field"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <span className="flex items-center gap-1"><FiDollarSign size={13} /> Price (USD)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="input-field"
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  className="input-field"
                  placeholder="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <span className="flex items-center gap-1"><FiImage size={13} /> Product Image</span>
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="product-image-upload"
                  onChange={handleImageChange}
                />

                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-40 w-40 object-cover rounded-xl border border-white/10"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
                    >
                      <FiX size={12} />
                    </button>
                    <p className="text-xs text-gray-400 mt-2">{imageFile?.name}</p>
                  </div>
                ) : (
                  <label
                    htmlFor="product-image-upload"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <FiUpload size={28} className="text-gray-500 group-hover:text-primary transition-colors mb-2" />
                    <p className="text-gray-400 text-sm font-medium group-hover:text-primary transition-colors">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-gray-600 text-xs mt-1">PNG, JPG, WEBP up to 5MB</p>
                  </label>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  className="input-field resize-none"
                  rows={4}
                  placeholder="Describe your product..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 mt-6">
              <motion.button
                type="submit"
                className="btn-primary px-8 py-3 flex items-center gap-2"
                disabled={submitting}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {uploading ? "Uploading image..." : submitting ? "Adding..." : <><FiPlus /> Add Product</>}
              </motion.button>
              <button type="button" onClick={resetForm} className="btn-outline px-6 py-3">
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Products Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-16 bg-surface rounded-xl animate-pulse border border-white/5" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <FiPackage size={48} className="mx-auto mb-4 text-gray-700" />
          <p className="text-xl font-bold text-white mb-2">No products yet</p>
          <p>Click "Add Product" to list your first item.</p>
        </div>
      ) : (
        <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-surface-light">
                {["Product", "Category", "Price", "Stock", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left font-bold text-gray-400 uppercase tracking-wider text-xs">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((p) => (
                <motion.tr
                  key={p._id}
                  className="hover:bg-white/5 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
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
                        <div className="w-10 h-10 rounded-lg bg-surface-light flex items-center justify-center text-gray-600 border border-white/10">
                          <FiImage size={16} />
                        </div>
                      )}
                      <span className="font-semibold text-white">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{p.category?.name || "—"}</td>
                  <td className="px-6 py-4 font-bold text-primary">${p.price}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`badge ${
                        p.stock > 10
                          ? "bg-green-900/30 text-green-400 border border-green-800"
                          : p.stock > 0
                          ? "bg-yellow-900/30 text-yellow-400 border border-yellow-800"
                          : "bg-red-900/30 text-red-400 border border-red-800"
                      }`}
                    >
                      {p.stock} left
                    </span>
                  </td>
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
