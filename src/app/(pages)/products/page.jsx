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
import { FiSearch, FiFilter } from "react-icons/fi";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

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
    const fetch = async () => {
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
    fetch();
  }, [filters, dispatch]);

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          Shop All Products
        </h1>
        <p className="text-gray-600">
          Discover our complete collection of {total} amazing products
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="card mb-8 p-6 bg-gradient-to-br from-white to-gray-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <motion.button
          onClick={() => setFilterOpen(!filterOpen)}
          className="flex items-center gap-2 md:hidden font-semibold text-gray-700 mb-4 w-full"
          whileHover={{ scale: 1.02 }}
        >
          <FiFilter /> Filters
        </motion.button>

        <motion.div
          className="space-y-4"
          initial={false}
          animate={{ height: filterOpen ? "auto" : 0 }}
          transition={{ duration: 0.3 }}
          style={{ overflow: "hidden" }}
        >
          {/* Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              dispatch(setFilters({ search: localSearch }));
            }}
            className="flex gap-3"
          >
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="input-field pl-10 bg-white"
                placeholder="Search products..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
            <motion.button
              type="submit"
              className="btn-primary px-6 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Search
            </motion.button>
          </form>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <motion.select
              className="input-field bg-white"
              value={filters.category}
              onChange={(e) =>
                dispatch(setFilters({ category: e.target.value }))
              }
              whileHover={{ scale: 1.02 }}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </motion.select>

            <motion.select
              className="input-field bg-white"
              value={filters.sort}
              onChange={(e) => dispatch(setFilters({ sort: e.target.value }))}
              whileHover={{ scale: 1.02 }}
            >
              <option value="">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </motion.select>

            <motion.input
              type="number"
              className="input-field bg-white"
              placeholder="Min $"
              value={filters.minPrice}
              onChange={(e) =>
                dispatch(setFilters({ minPrice: e.target.value }))
              }
              whileHover={{ scale: 1.02 }}
            />

            <motion.input
              type="number"
              className="input-field bg-white"
              placeholder="Max $"
              value={filters.maxPrice}
              onChange={(e) =>
                dispatch(setFilters({ maxPrice: e.target.value }))
              }
              whileHover={{ scale: 1.02 }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Results Count */}
      <motion.p
        className="text-gray-600 font-medium mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Showing{" "}
        <span className="text-primary font-bold">{products.length}</span> of{" "}
        <span className="text-primary font-bold">{total}</span> products
      </motion.p>

      {/* Products Grid */}
      {loading ? (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="card h-72 animate-pulse bg-gradient-to-br from-gray-200 to-gray-300"
              variants={itemVariants}
            />
          ))}
        </motion.div>
      ) : products.length === 0 ? (
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-6xl mb-4 animate-bounce">🔍</div>
          <p className="text-xl font-medium text-gray-600">No products found</p>
          <p className="text-gray-500 mt-2">Try adjusting your filters</p>
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
          className="flex flex-wrap justify-center gap-2 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {[...Array(totalPages)].map((_, i) => (
            <motion.button
              key={i}
              onClick={() => dispatch(setPage(i + 1))}
              className={`w-10 h-10 rounded-lg font-bold transition-all ${filters.page === i + 1 ? "bg-gradient-to-r from-primary to-indigo-600 text-white shadow-lg" : "bg-white border-2 border-gray-200 text-gray-600 hover:border-primary"}`}
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
