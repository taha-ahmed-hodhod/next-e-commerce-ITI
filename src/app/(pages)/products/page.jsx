"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setProducts,
  setProductsLoading,
  setFilters,
  setPage,
  selectProducts,
  selectProductsLoading,
  selectFilters,
  selectProductsTotal,
} from "@/store/slices/dataSlices";
import { productsAPI, categoriesAPI } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import { FiSearch, FiFilter, FiX, FiChevronDown } from "react-icons/fi";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProductsPage() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const filters = useSelector(selectFilters);
  const total = useSelector(selectProductsTotal);
  const [categories, setCategories] = useState([]);
  const [localSearch, setLocalSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(true);

  useEffect(() => {
    categoriesAPI
      .getAll()
      .then((r) => setCategories(r.data.data.categories))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(setProductsLoading(true));
      try {
        const res = await productsAPI.getAll(filters);
        dispatch(setProducts(res.data.data));
      } catch {
        toast.error("Failed to load products");
      } finally {
        dispatch(setProductsLoading(false));
      }
    };
    fetchProducts();
  }, [filters, dispatch]);

  const totalPages = Math.ceil(total / 10);

  const clearFilters = () => {
    setLocalSearch("");
    dispatch(setFilters({ search: "", category: "", sort: "", minPrice: "", maxPrice: "", page: 1 }));
  };

  const hasActiveFilters = filters.search || filters.category || filters.sort || filters.minPrice || filters.maxPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <h1 className="text-5xl md:text-6xl font-black text-white mb-3 tracking-tighter">
          All <span className="text-primary drop-shadow-[0_0_15px_rgba(0,229,255,0.3)]">Products</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Discover our complete collection of{" "}
          <span className="text-primary font-bold">{total}</span> amazing products
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.form
        onSubmit={(e) => {
          e.preventDefault();
          dispatch(setFilters({ search: localSearch }));
        }}
        className="flex gap-3 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex-1 relative group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
          <input
            className="input-field pl-11 pr-10 h-12 text-base"
            placeholder="Search products..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => { setLocalSearch(""); dispatch(setFilters({ search: "" })); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
            >
              <FiX size={16} />
            </button>
          )}
        </div>
        <motion.button
          type="submit"
          className="btn-primary px-8 h-12 font-bold flex items-center gap-2"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <FiSearch size={16} /> Search
        </motion.button>
      </motion.form>

      {/* Filter Panel */}
      <motion.div
        className="bg-surface/60 backdrop-blur-md border border-white/5 rounded-2xl mb-8 overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {/* Filter Header */}
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2 text-gray-300 font-semibold">
            <FiFilter size={16} className="text-primary" />
            Filters
            {hasActiveFilters && (
              <span className="bg-primary text-black text-xs font-black px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </div>
          <motion.div animate={{ rotate: filterOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <FiChevronDown className="text-gray-400" />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {filterOpen && (
            <motion.div
              key="filters"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="border-t border-white/5 px-6 py-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Category */}
                <div className="relative">
                  <select
                    className="input-field appearance-none pr-8"
                    value={filters.category}
                    onChange={(e) => dispatch(setFilters({ category: e.target.value }))}
                  >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                </div>

                {/* Sort */}
                <div className="relative">
                  <select
                    className="input-field appearance-none pr-8"
                    value={filters.sort}
                    onChange={(e) => dispatch(setFilters({ sort: e.target.value }))}
                  >
                    <option value="">Newest First</option>
                    <option value="price_asc">Price: Low → High</option>
                    <option value="price_desc">Price: High → Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                </div>

                {/* Min Price */}
                <input
                  type="number"
                  className="input-field"
                  placeholder="Min Price ($)"
                  value={filters.minPrice}
                  onChange={(e) => dispatch(setFilters({ minPrice: e.target.value }))}
                />

                {/* Max Price */}
                <input
                  type="number"
                  className="input-field"
                  placeholder="Max Price ($)"
                  value={filters.maxPrice}
                  onChange={(e) => dispatch(setFilters({ maxPrice: e.target.value }))}
                />
              </div>

              {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors"
                  >
                    <FiX size={14} /> Clear all filters
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results Count */}
      <motion.p
        className="text-gray-400 font-medium mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Showing{" "}
        <span className="text-primary font-black">{products.length}</span>{" "}
        of{" "}
        <span className="text-primary font-black">{total}</span> products
      </motion.p>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-80 rounded-2xl bg-surface animate-pulse border border-white/5"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <motion.div
          className="text-center py-24"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-7xl mb-6">🔍</div>
          <p className="text-2xl font-bold text-white mb-2">No products found</p>
          <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
          <button onClick={clearFilters} className="btn-primary px-8 py-3">
            Clear Filters
          </button>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {products.map((p) => (
            <motion.div key={p._id} variants={itemVariants}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          className="flex flex-wrap justify-center gap-2 mt-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {[...Array(totalPages)].map((_, i) => (
            <motion.button
              key={i}
              onClick={() => dispatch(setPage(i + 1))}
              className={`w-11 h-11 rounded-xl font-bold transition-all text-sm ${
                filters.page === i + 1
                  ? "bg-primary text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                  : "bg-surface border border-white/10 text-gray-400 hover:border-primary hover:text-primary"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {i + 1}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
