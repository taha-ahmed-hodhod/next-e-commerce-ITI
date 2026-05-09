"use client";
import Link from "next/link";
import {
  FiArrowRight,
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiStar,
  FiUsers,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { productsAPI } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productsAPI.getAll({ limit: 4 });
        setFeaturedProducts(res.data.data.products);
      } catch (err) {
        console.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <motion.section
        className="bg-surface-dark text-white py-32 px-4 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/4 translate-y-1/4"
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <span className="inline-block px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-bold tracking-widest mb-4">
              WELCOME TO Shop Hole
            </span>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-black mb-6 leading-tight tracking-tighter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Shop Everything You{" "}
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,229,255,0.3)]">
              Love
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Discover thousands of premium products from trusted sellers. Fast
            delivery, secure payments, and exceptional customer service.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-primary text-black font-bold px-8 py-4 rounded-xl hover:bg-primary-dark transition text-lg shadow-[0_0_20px_rgba(0,229,255,0.4)]"
            >
              <FiShoppingBag /> Shop Now <FiArrowRight />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { icon: <FiUsers />, label: "50K+ Users", value: "50K+" },
              {
                icon: <FiShoppingBag />,
                label: "10K+ Products",
                value: "10K+",
              },
              { icon: <FiStar />, label: "4.8/5 Rating", value: "4.8★" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-3xl mb-2 text-primary drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]">{stat.icon}</div>
                <div className="text-2xl font-black">{stat.value}</div>
                <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20 px-4 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h2
          className="text-4xl font-black text-center mb-4 tracking-tight"
          variants={itemVariants}
        >
          Why Choose Shop Hole?
        </motion.h2>
        <motion.p
          className="text-center text-gray-400 mb-16 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          We've built our platform to make shopping easier, faster, and more
          enjoyable.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FiShoppingBag size={40} />,
              title: "Wide Selection",
              desc: "Browse from thousands of products across all categories and price points",
            },
            {
              icon: <FiTruck size={40} />,
              title: "Fast Delivery",
              desc: "Quick and reliable shipping to get your orders to you on time",
            },
            {
              icon: <FiShield size={40} />,
              title: "Secure Payments",
              desc: "Multiple payment methods with 100% secure transactions",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="card p-8 text-center group hover:shadow-xl transition-all"
              whileHover={{ y: -10 }}
            >
              <motion.div
                className="text-primary flex justify-center mb-4 text-5xl drop-shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Featured Products Section */}
      <motion.section
        className="py-20 px-4 bg-[#0a0a0a] border-y border-white/5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <motion.h2 className="text-4xl font-black text-white mb-4 tracking-tight" variants={itemVariants}>
                Featured Products
              </motion.h2>
              <motion.p className="text-gray-400 max-w-2xl" variants={itemVariants}>
                Discover our hand-picked selection of premium items.
              </motion.p>
            </div>
            <motion.div variants={itemVariants}>
              <Link href="/products" className="hidden sm:flex items-center gap-2 text-primary font-bold hover:text-primary-dark transition-colors drop-shadow-[0_0_5px_rgba(0,229,255,0.3)]">
                View All <FiArrowRight />
              </Link>
            </motion.div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-80 bg-surface rounded-2xl animate-pulse border border-white/5"></div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12 bg-surface/50 rounded-2xl border border-white/5">
              No products found. Start selling today!
            </div>
          )}
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/products" className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary-dark drop-shadow-[0_0_5px_rgba(0,229,255,0.3)]">
              View All Products <FiArrowRight />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="bg-surface-dark py-20 px-4 text-center text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 10, repeat: Infinity }}
          style={{
            backgroundImage:
              "linear-gradient(45deg, #00E5FF 25%, transparent 25%, transparent 75%, #00E5FF 75%, #00E5FF)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="max-w-3xl mx-auto relative z-10">
          <motion.h2
            className="text-4xl md:text-6xl font-black mb-4 tracking-tighter"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Ready to Start Selling?
          </motion.h2>
          <motion.p
            className="text-lg text-gray-400 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Join thousands of successful sellers and reach millions of customers
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-primary text-black font-bold px-8 py-4 rounded-xl hover:bg-primary-dark transition text-lg shadow-[0_0_20px_rgba(0,229,255,0.4)]"
            >
              Become a Seller <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
