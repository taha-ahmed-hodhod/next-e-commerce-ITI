"use client";
import { motion } from "framer-motion";

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <motion.div
        className="max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter">
            About <span className="text-primary drop-shadow-[0_0_15px_rgba(0,229,255,0.3)]">ShopHole</span>
          </h1>
          <p className="text-xl text-gray-400">
            We are redefining the e-commerce experience with an ultra-modern, seamless, and premium platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div variants={itemVariants} className="card">
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-400 leading-relaxed">
              Our mission is to empower buyers and sellers by providing a cutting-edge platform where technology meets commerce. We believe in creating a transparent, fast, and visually stunning environment for all your shopping needs.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="card">
            <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
            <p className="text-gray-400 leading-relaxed">
              To be the leading global marketplace that seamlessly connects people with the products they love, powered by state-of-the-art technology and an unyielding commitment to user experience and design excellence.
            </p>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="mt-12 card bg-primary/5 border-primary/20">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Why We Stand Out</h2>
          <ul className="space-y-4 text-gray-400 max-w-2xl mx-auto">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">✓</span>
              <span>Ultra-fast performance ensuring you never wait.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">✓</span>
              <span>Premium dark-theme design that reduces eye strain and looks incredible.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">✓</span>
              <span>Secure, encrypted transactions to protect your data.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">✓</span>
              <span>A robust seller dashboard that gives merchants full control.</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}
