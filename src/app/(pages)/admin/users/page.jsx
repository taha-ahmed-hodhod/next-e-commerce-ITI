"use client";
import { useEffect, useState } from "react";
import { usersAPI } from "@/lib/api";
import toast from "react-hot-toast";

const ROLE_COLORS = { ADMIN: "bg-red-100 text-red-700", SELLER: "bg-blue-100 text-blue-700", USER: "bg-gray-100 text-gray-600" };

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = () => {
    setLoading(true);
    usersAPI.getAll({ limit: 50 }).then((r) => setUsers(r.data.data.users)).catch(() => toast.error("Failed")).finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  const handleToggle = async (id) => {
    try { await usersAPI.toggleActive(id); toast.success("Updated"); loadUsers(); }
    catch { toast.error("Failed"); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      {loading ? <div className="text-gray-400">Loading...</div> : (
        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Username</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium">{u.username}</td>
                  <td className="px-5 py-3 text-gray-500">{u.email}</td>
                  <td className="px-5 py-3"><span className={`badge ${ROLE_COLORS[u.role]}`}>{u.role}</span></td>
                  <td className="px-5 py-3"><span className={`badge ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>{u.isActive ? "Active" : "Suspended"}</span></td>
                  <td className="px-5 py-3">
                    <button onClick={() => handleToggle(u._id)} className={`text-xs font-medium px-3 py-1 rounded-lg ${u.isActive ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                      {u.isActive ? "Suspend" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
