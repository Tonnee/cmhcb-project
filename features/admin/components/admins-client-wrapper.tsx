"use client";

import * as React from "react";
import Link from "next/link";
import { 
  HiShieldCheck, 
  HiPlus, 
  HiMagnifyingGlass, 
  HiPencilSquare, 
  HiLockClosed, 
  HiLockOpen, 
  HiClock,
  HiXMark,
  
} from "react-icons/hi2";
import { 
  createAdminAccountAction, 
  updateAdminCredentialsAction, 
  toggleBlockAdminAction 
} from "@/app/(admin)/admin/admin-management";

interface AdminProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AdminsClientWrapperProps {
  initialAdmins: AdminProfile[];
  currentAdmin: { id: string; email: string; name: string; role: string };
}

export default function AdminsClientWrapper({
  initialAdmins,
  currentAdmin,
}: AdminsClientWrapperProps): React.JSX.Element {
  const [admins, setAdmins] = React.useState<AdminProfile[]>(initialAdmins);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Modals state
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [selectedAdmin, setSelectedAdmin] = React.useState<AdminProfile | null>(null);

  // Form states
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState<"admin" | "super_admin">("admin");

  // Status states
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");

  const isSuperAdmin = currentAdmin.role === "super_admin";

  // Filter admins based on search
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset notifications
  const clearNotifications = () => {
    setErrorMsg("");
    setSuccessMsg("");
  };

  // Open Edit Modal
  const openEditModal = (admin: AdminProfile) => {
    setSelectedAdmin(admin);
    setName(admin.name);
    setRole(admin.role as "admin" | "super_admin");
    setPassword("");
    clearNotifications();
    setShowEditModal(true);
  };

  // Open Create Modal
  const openCreateModal = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("admin");
    clearNotifications();
    setShowCreateModal(true);
  };

  // Handle Admin Creation
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg("All fields are required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await createAdminAccountAction(name, email, password, role);
      if (res.success && res.data) {
        // cast to standard type
        const newAdmin = {
          ...res.data,
          createdAt: new Date(res.data.createdAt),
          updatedAt: new Date(res.data.updatedAt)
        } as AdminProfile;
        
        setAdmins([...admins, newAdmin]);
        setSuccessMsg(`Successfully created administrator account for ${email}.`);
        setShowCreateModal(false);
      } else {
        setErrorMsg(res.error || "Failed to create administrator account.");
      }
    } catch (err: unknown) {
      setErrorMsg((err instanceof Error ? err.message : String(err)) || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Credentials Update
  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmin) return;
    if (!name) {
      setErrorMsg("Name is required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await updateAdminCredentialsAction(
        selectedAdmin.id,
        name,
        role,
        password || undefined
      );

      if (res.success && res.data) {
        const updated = admins.map((admin) =>
          admin.id === selectedAdmin.id
            ? ({
                ...res.data,
                createdAt: new Date(res.data.createdAt),
                updatedAt: new Date(res.data.updatedAt)
              } as AdminProfile)
            : admin
        );
        setAdmins(updated);
        setSuccessMsg(`Successfully updated credentials for ${selectedAdmin.email}.`);
        setShowEditModal(false);
      } else {
        setErrorMsg(res.error || "Failed to update credentials.");
      }
    } catch (err: unknown) {
      setErrorMsg((err instanceof Error ? err.message : String(err)) || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Block / Unblock Toggle
  const handleToggleBlock = async (admin: AdminProfile) => {
    if (admin.id === currentAdmin.id) {
      alert("You cannot block your own account.");
      return;
    }

    const confirmMsg = admin.isBlocked
      ? `Are you sure you want to restore access for ${admin.email}?`
      : `Are you sure you want to block access for ${admin.email}? Blocked admins are immediately logged out and denied dashboard access.`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await toggleBlockAdminAction(admin.id, !admin.isBlocked);
      if (res.success && res.data) {
        const updated = admins.map((a) =>
          a.id === admin.id
            ? ({
                ...res.data,
                createdAt: new Date(res.data.createdAt),
                updatedAt: new Date(res.data.updatedAt)
              } as AdminProfile)
            : a
        );
        setAdmins(updated);
        setSuccessMsg(`Successfully ${!admin.isBlocked ? "blocked" : "unblocked"} ${admin.email}.`);
        
        // Clear message after 3 seconds
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        alert(res.error || "Failed to update block status.");
      }
    } catch (err: unknown) {
      alert((err instanceof Error ? err.message : String(err)) || "An unexpected error occurred.");
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Directory Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-marcellus text-2xl md:text-3xl font-bold text-dark-green">
            Administrators Directory
          </h1>
          <p className="text-light-ash text-sm">
            View administrator listings, profiles, actions, and audit logs.
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-4 rounded-xl shadow-md transition-all duration-200 cursor-pointer text-sm"
          >
            <HiPlus className="w-5 h-5" />
            Add Administrator
          </button>
        )}
      </div>

      {/* Notifications Display */}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg("")} className="text-green-500 hover:text-green-700">
            <HiXMark className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Directory List Container */}
      <div className="bg-white border border-muted/50 rounded-2xl shadow-sm overflow-hidden">
        {/* Search bar inside header */}
        <div className="p-4 border-b border-muted/50 flex items-center bg-light/10">
          <div className="relative max-w-md w-full">
            <HiMagnifyingGlass className="w-5 h-5 text-light-ash/60 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search admins by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-muted bg-white focus:outline-none focus:border-primary rounded-xl text-sm"
            />
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-light/20 text-xs font-semibold text-light-ash uppercase tracking-wider border-b border-muted/50">
                <th className="px-6 py-4">Administrator</th>
                <th className="px-6 py-4">Access Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined On</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/30 text-sm">
              {filteredAdmins.length > 0 ? (
                filteredAdmins.map((admin) => {
                  const initial = admin.name.charAt(0).toUpperCase();
                  const isSelf = admin.id === currentAdmin.id;
                  
                  return (
                    <tr key={admin.id} className="hover:bg-light/10 transition-colors">
                      {/* Name / Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary-dark font-bold font-marcellus flex items-center justify-center shrink-0">
                            {initial}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-dark truncate">
                              {admin.name} {isSelf && <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full ml-1.5 font-medium">You</span>}
                            </span>
                            <span className="text-xs text-light-ash truncate">{admin.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Access Role Badge */}
                      <td className="px-6 py-4">
                        {admin.role === "super_admin" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full uppercase tracking-wide">
                            <HiShieldCheck className="w-3.5 h-3.5" />
                            Super Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-dark bg-primary/5 border border-primary/20 px-2.5 py-1 rounded-full uppercase tracking-wide">
                            Admin
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {admin.isBlocked ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Active
                          </span>
                        )}
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-4 text-xs text-light-ash">
                        {new Date(admin.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          {/* View Logs button */}
                          <Link
                            href={`/admin/admins/${admin.id}`}
                            title="View Activity Logs"
                            className="p-2 text-light-ash hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                          >
                            <HiClock className="w-5 h-5" />
                          </Link>

                          {/* Credentials Edit - Super Admin only */}
                          {isSuperAdmin && (
                            <button
                              onClick={() => openEditModal(admin)}
                              title="Edit Credentials"
                              className="p-2 text-light-ash hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all cursor-pointer"
                            >
                              <HiPencilSquare className="w-5 h-5" />
                            </button>
                          )}

                          {/* Block/Unblock toggle - Super Admin only, can't block self */}
                          {isSuperAdmin && !isSelf && (
                            <button
                              onClick={() => handleToggleBlock(admin)}
                              title={admin.isBlocked ? "Restore Access" : "Revoke Access (Block)"}
                              className={`p-2 rounded-lg transition-all cursor-pointer ${
                                admin.isBlocked
                                  ? "text-red-500 hover:text-red-700 hover:bg-red-50"
                                  : "text-light-ash hover:text-red-600 hover:bg-red-50"
                              }`}
                            >
                              {admin.isBlocked ? (
                                <HiLockOpen className="w-5 h-5" />
                              ) : (
                                <HiLockClosed className="w-5 h-5" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-light-ash font-medium">
                    No administrators found matching your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE ADMIN MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/50 backdrop-blur-xs px-4">
          <div className="bg-white rounded-2xl border border-muted/50 shadow-xl max-w-md w-full overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-muted">
              <h3 className="font-marcellus text-lg font-bold text-dark-green">
                Create Administrator Account
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg transition-colors cursor-pointer">
                <HiXMark className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="p-5 flex flex-col gap-4 overflow-y-auto">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-xl text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-dark">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nazme Ara"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary text-sm"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-dark">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. nazme@cmhcb.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary text-sm"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-dark">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary text-sm"
                />
              </div>

              {/* Role Selection */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-dark">Administrative Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as "admin" | "super_admin")}
                  className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary text-sm"
                >
                  <option value="admin">Admin (Can edit content records)</option>
                  <option value="super_admin">Super Admin (Can manage other admins & access controls)</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-muted">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-muted text-light-ash hover:bg-light text-xs font-semibold rounded-xl"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ADMIN CREDENTIALS MODAL */}
      {showEditModal && selectedAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/50 backdrop-blur-xs px-4">
          <div className="bg-white rounded-2xl border border-muted/50 shadow-xl max-w-md w-full overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-muted">
              <div>
                <h3 className="font-marcellus text-lg font-bold text-dark-green">
                  Modify Administrator Credentials
                </h3>
                <p className="text-xs text-light-ash mt-0.5">{selectedAdmin.email}</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg transition-colors cursor-pointer">
                <HiXMark className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateAdmin} className="p-5 flex flex-col gap-4 overflow-y-auto">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-xl text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-dark">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nazme Ara"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary text-sm"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-dark">
                  Reset Password <span className="text-light-ash/60 font-normal">(Optional)</span>
                </label>
                <input
                  type="password"
                  placeholder="Leave blank to keep current password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary text-sm"
                />
              </div>

              {/* Role Selection */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-dark">Administrative Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as "admin" | "super_admin")}
                  disabled={selectedAdmin.id === currentAdmin.id}
                  className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary text-sm disabled:bg-light/30 disabled:text-light-ash"
                >
                  <option value="admin">Admin (Can edit content records)</option>
                  <option value="super_admin">Super Admin (Can manage other admins & access controls)</option>
                </select>
                {selectedAdmin.id === currentAdmin.id && (
                  <span className="text-[10px] text-light-ash/80 italic mt-0.5">
                    You cannot change your own access role to avoid accidental lockouts.
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-muted">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-muted text-light-ash hover:bg-light text-xs font-semibold rounded-xl"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
