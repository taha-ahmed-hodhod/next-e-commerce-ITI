"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  selectIsLoggedIn,
  logout,
  initAuth,
} from "@/store/slices/authSlice";
import { selectCartItemCount, setCart } from "@/store/slices/cartSlice";
import { cartAPI } from "@/lib/api";
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);
  const itemCount = useSelector(selectCartItemCount);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    dispatch(initAuth());
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      cartAPI
        .get()
        .then((res) => dispatch(setCart(res.data.data.cart)))
        .catch(() => {});
    }
  }, [isLoggedIn, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
    router.push("/");
  };

  const closeMenu = () => setMenuOpen(false);

  if (!mounted) {
    return (
      <motion.nav
        className={`bg-white border-b sticky top-0 z-50 transition-all ${scrolled ? "shadow-lg" : "shadow-sm"}`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent"
          >
            ShopZone
          </Link>
        </div>
      </motion.nav>
    );
  }

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05 } }),
  };

  return (
    <motion.nav
      className={`bg-white border-b sticky top-0 z-50 transition-all ${scrolled ? "shadow-lg" : "shadow-sm border-gray-200"}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent hover:scale-105 transition-transform"
        >
          ShopZone
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/products"
            className="text-gray-600 hover:text-primary font-medium transition-all hover:scale-105"
          >
            Products
          </Link>
          {isLoggedIn && user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="text-gray-600 hover:text-primary font-medium transition-all hover:scale-105"
            >
              Admin
            </Link>
          )}
          {isLoggedIn && user?.role === "SELLER" && (
            <Link
              href="/seller"
              className="text-gray-600 hover:text-primary font-medium transition-all hover:scale-105"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/cart"
                  className="relative text-gray-600 hover:text-primary text-xl transition-colors"
                >
                  <FiShoppingCart size={22} />
                  {itemCount > 0 && (
                    <motion.span
                      className="absolute -top-2 -right-2 bg-gradient-to-r from-primary to-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/profile"
                  className="text-gray-600 hover:text-primary text-xl transition-colors"
                >
                  <FiUser size={22} />
                </Link>
              </motion.div>

              <Link
                href="/orders"
                className="text-gray-600 hover:text-primary font-medium transition-all hover:scale-105"
              >
                Orders
              </Link>

              <motion.button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500 text-xl transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiLogOut size={20} />
              </motion.button>
            </>
          ) : (
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/auth/login"
                  className="btn-outline text-sm py-1.5 px-4 rounded-lg font-medium"
                >
                  Login
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/auth/register"
                  className="btn-primary text-sm py-1.5 px-4 rounded-lg font-medium"
                >
                  Register
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-3"
        initial={false}
        animate={{ height: menuOpen ? "auto" : 0, opacity: menuOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ overflow: "hidden" }}
      >
        <Link
          href="/products"
          onClick={closeMenu}
          className="py-2 text-gray-700 hover:text-primary font-medium transition-colors"
        >
          Products
        </Link>
        {isLoggedIn && user?.role === "ADMIN" && (
          <Link
            href="/admin"
            onClick={closeMenu}
            className="py-2 text-gray-700 hover:text-primary font-medium transition-colors"
          >
            Admin
          </Link>
        )}
        {isLoggedIn && user?.role === "SELLER" && (
          <Link
            href="/seller"
            onClick={closeMenu}
            className="py-2 text-gray-700 hover:text-primary font-medium transition-colors"
          >
            Dashboard
          </Link>
        )}
        <hr className="my-2" />
        {isLoggedIn ? (
          <>
            <Link
              href="/cart"
              onClick={closeMenu}
              className="py-2 text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Cart ({itemCount})
            </Link>
            <Link
              href="/profile"
              onClick={closeMenu}
              className="py-2 text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Profile
            </Link>
            <Link
              href="/orders"
              onClick={closeMenu}
              className="py-2 text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Orders
            </Link>
            <button
              onClick={() => {
                handleLogout();
                closeMenu();
              }}
              className="text-left py-2 text-red-500 font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/auth/login"
              onClick={closeMenu}
              className="py-2 text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              onClick={closeMenu}
              className="py-2 btn-primary text-center rounded-lg font-medium text-white"
            >
              Register
            </Link>
          </>
        )}
      </motion.div>
    </motion.nav>
  );
}
