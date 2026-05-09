"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiInstagram, FiTwitter, FiGithub, FiMail, FiShoppingBag } from "react-icons/fi";

const footerLinks = {
  Shop: [
    { label: "All Products", href: "/products" },
    { label: "Featured", href: "/products?sort=rating" },
    { label: "New Arrivals", href: "/products?sort=newest" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "#" },
  ],
  Account: [
    { label: "Login", href: "/auth/login" },
    { label: "Register", href: "/auth/register" },
    { label: "My Orders", href: "/orders" },
    { label: "Profile", href: "/profile" },
  ],
};

const socials = [
  { icon: <FiInstagram size={18} />, href: "#", label: "Instagram" },
  { icon: <FiTwitter size={18} />, href: "#", label: "Twitter" },
  { icon: <FiGithub size={18} />, href: "#", label: "GitHub" },
  { icon: <FiMail size={18} />, href: "mailto:support@shophole.com", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-surface-dark mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <FiShoppingBag className="text-primary text-2xl drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
              <span className="text-2xl font-black bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                ShopHole
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              The ultra-modern marketplace reimagining how you shop. Premium products, seamless experience.
            </p>
            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm font-bold text-gray-300 mb-3">Stay in the loop</p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex gap-2"
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="input-field text-sm py-2 flex-1"
                />
                <button
                  type="submit"
                  className="btn-primary text-sm px-4 py-2 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-primary text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} <span className="text-primary font-semibold">ShopHole</span>. All rights reserved.
          </p>
          {/* Socials */}
          <div className="flex items-center gap-4">
            {socials.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="text-gray-500 hover:text-primary transition-colors"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {s.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
