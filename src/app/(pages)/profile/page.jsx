"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser, selectIsLoggedIn } from "@/store/slices/authSlice";
import { usersAPI } from "@/lib/api";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiUser, FiLock } from "react-icons/fi";

export default function ProfilePage() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState("profile");
  const [profileForm, setProfileForm] = useState({ username: "", phone: "" });
  const [passForm, setPassForm] = useState({ oldPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) setProfileForm({ username: user.username || "", phone: "" });
  }, [user]);

  if (!mounted) return null;

  if (!isLoggedIn) return (
    <div className="text-center py-20"><Link href="/auth/login" className="btn-primary">Login</Link></div>
  );

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await usersAPI.updateProfile(profileForm); toast.success("Profile updated!"); }
    catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setLoading(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await usersAPI.changePassword(passForm);
      toast.success("Password changed!");
      setPassForm({ oldPassword: "", newPassword: "" });
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="card p-6 mb-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold">
          {user?.email?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-lg">{user?.email}</p>
          <span className="badge bg-indigo-100 text-indigo-700">{user?.role}</span>
        </div>
      </div>

      <div className="flex border-b mb-6">
        {[{ id: "profile", label: "Profile", icon: <FiUser /> }, { id: "password", label: "Password", icon: <FiLock /> }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3 font-medium text-sm border-b-2 transition ${tab === t.id ? "border-primary text-primary" : "border-transparent text-gray-500"}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <form onSubmit={handleProfileUpdate} className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input className="input-field" value={profileForm.username} onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input className="input-field" placeholder="+20..." value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
        </form>
      )}

      {tab === "password" && (
        <form onSubmit={handlePasswordChange} className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input type="password" className="input-field" value={passForm.oldPassword} onChange={(e) => setPassForm({ ...passForm, oldPassword: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input type="password" className="input-field" value={passForm.newPassword} onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })} required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Changing..." : "Change Password"}</button>
        </form>
      )}
    </div>
  );
}
