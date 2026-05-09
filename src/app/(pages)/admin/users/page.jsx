"use client";
import { useEffect, useState } from "react";
import { usersAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { FiUsers, FiCheckCircle, FiSlash } from "react-icons/fi";
import { motion } from "framer-motion";

const ROLE_STYLES = {
  ADMIN: "bg-red-900/30 text-red-400 border border-red-800",
  SELLER: "bg-cyan-900/30 text-cyan-400 border border-cyan-800",
  USER: "bg-gray-800 text-gray-400 border border-gray-700",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = () => {
    setLoading(true);
    usersAPI.getAll({ limit: 50 })
      .then((r) => setUsers(r.data.data.users))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  const handleToggle = async (id) => {
    try {
      await usersAPI.toggleActive(id);
      toast.success("User status updated");
      loadUsers();
    } catch {
      toast.error("Failed to update user");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-primary font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
          <FiUsers size={14} /> Management
        </p>
        <h1 className="text-4xl font-black text-white tracking-tight">Users</h1>
        <p className="text-gray-400 mt-1">{users.length} registered users</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-14 bg-surface rounded-xl animate-pulse border border-white/5" />
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-surface-light">
                {["Username", "Email", "Role", "Status", "Action"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left font-bold text-gray-400 uppercase tracking-wider text-xs">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u, i) => (
                <motion.tr
                  key={u._id}
                  className="hover:bg-white/5 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <td className="px-6 py-4 font-semibold text-white">{u.username}</td>
                  <td className="px-6 py-4 text-gray-400">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`badge text-xs ${ROLE_STYLES[u.role]}`}>{u.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge text-xs ${
                      u.isActive
                        ? "bg-green-900/30 text-green-400 border border-green-800"
                        : "bg-red-900/30 text-red-400 border border-red-800"
                    }`}>
                      {u.isActive ? "Active" : "Suspended"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <motion.button
                      onClick={() => handleToggle(u._id)}
                      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                        u.isActive
                          ? "bg-red-900/20 text-red-400 hover:bg-red-900/40 border border-red-900"
                          : "bg-green-900/20 text-green-400 hover:bg-green-900/40 border border-green-900"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {u.isActive ? <><FiSlash size={12} /> Suspend</> : <><FiCheckCircle size={12} /> Activate</>}
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
