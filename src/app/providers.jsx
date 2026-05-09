"use client";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Toaster position="top-right" />
    </Provider>
  );
}
