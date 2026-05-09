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
import { motion } from "framer-motion";

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
  return (
    <div>
      {/* Hero Section */}
      <motion.section
        className="bg-gradient-to-br from-primary via-indigo-500 to-indigo-600 text-white py-32 px-4 relative overflow-hidden"
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
            <span className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur text-sm font-medium mb-4">
              Welcome to ShopZone
            </span>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Shop Everything You{" "}
            <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
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
              className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition text-lg shadow-2xl"
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
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-indigo-100">{stat.label}</div>
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
          className="text-4xl font-bold text-center mb-4"
          variants={itemVariants}
        >
          Why Choose ShopZone?
        </motion.h2>
        <motion.p
          className="text-center text-gray-600 mb-16 max-w-2xl mx-auto"
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
                className="text-primary flex justify-center mb-4 text-5xl"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="bg-gradient-to-r from-primary to-indigo-600 py-20 px-4 text-center text-white relative overflow-hidden"
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
              "linear-gradient(45deg, white 25%, transparent 25%, transparent 75%, white 75%, white)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="max-w-3xl mx-auto relative z-10">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Ready to Start Selling?
          </motion.h2>
          <motion.p
            className="text-lg text-indigo-100 mb-8"
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
              className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition text-lg shadow-xl"
            >
              Become a Seller <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
