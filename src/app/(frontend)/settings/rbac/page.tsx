"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/store/useToastStore";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Plus, Trash2, Key, Users, CheckSquare, ShieldCheck } from "lucide-react";

export default function RBACPage() {
  const {
    sessionRole,
    usersList,
    addUser,
    deleteUser,
    rolePermissions,
    togglePermission,
  } = useAppStore();

  // Modal State for Invite User
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<'Super Admin' | 'Broker' | 'Agent' | 'Viewer'>("Agent");

  // Determine if session role has permission to manage users
  const hasUserManagePermission = rolePermissions[sessionRole]?.includes("user_manage") ?? false;
  const hasSecurityPermission = rolePermissions[sessionRole]?.includes("commissions_admin") ?? false; // security split admin

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasUserManagePermission) {
      toast.error(`Permission Denied: Your current role (${sessionRole}) cannot invite users.`);
      return;
    }
    if (!newUserName || !newUserEmail) {
      toast.error("Please fill in all details.");
      return;
    }

    addUser({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
    });

    toast.success(`User ${newUserName} invited as ${newUserRole}!`);
    setIsInviteOpen(false);
    setNewUserName("");
    setNewUserEmail("");
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (!hasUserManagePermission) {
      toast.error(`Permission Denied: Your current role (${sessionRole}) cannot delete users.`);
      return;
    }
    const user = usersList.find((u) => u.id === id);
    if (user && user.role === "Super Admin" && usersList.filter((u) => u.role === "Super Admin").length <= 1) {
      toast.error("Cannot delete the last Super Admin!");
      return;
    }

    deleteUser(id);
    toast.success(`User account for ${name} removed.`);
  };

  const permissionsList = [
    { key: "listings_edit", label: "Create & Edit Listings", desc: "Allow creating new property listings and editing existing ones." },
    { key: "commissions_admin", label: "Configure Commission Plans", desc: "Access and edit base split templates and broker caps." },
    { key: "review_moderation", label: "Moderate Reviews", desc: "Approve, reject, or respond to customer testimonials." },
    { key: "transaction_log", label: "View Transaction Ledger", desc: "Access the financial ledger list and deals pipeline volume." },
    { key: "audit_export", label: "Export Audit compliance trail", desc: "Generate and download CSV logs of compliance logs." },
    { key: "user_manage", label: "User Management (RBAC)", desc: "Invite new users, delete accounts, and edit role permissions." },
  ];

  const roles: ('Super Admin' | 'Broker' | 'Agent' | 'Viewer')[] = ["Super Admin", "Broker", "Agent", "Viewer"];

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumb />
          <h1 className="text-[20px] font-bold text-foreground">User Roles & Permissions (RBAC)</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Manage user access rights and customize security matrices</p>
        </div>
        <button
          onClick={() => {
            if (!hasUserManagePermission) {
              toast.error(`Permission Denied: Your current role (${sessionRole}) cannot invite users.`);
              return;
            }
            setIsInviteOpen(true);
          }}
          disabled={!hasUserManagePermission}
          className={`text-[13px] font-bold px-4 py-2 rounded-[5px] flex items-center gap-1.5 shadow-sm transition-all ${
            hasUserManagePermission
              ? "bg-primary hover:bg-primary/95 text-white cursor-pointer"
              : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
          }`}
        >
          <Plus className="h-4 w-4" /> Invite User
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Active User Directory (col-xl-5) */}
        <div className="xl:col-span-5 col-span-12 space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
            <h3 className="text-[15px] font-bold text-foreground flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-primary" /> Active User Directory
            </h3>

            <div className="divide-y divide-border">
              {usersList.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={user.avatar} className="h-9.5 w-9.5 rounded-full object-cover border border-border" alt="" />
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-foreground leading-snug truncate">
                        {user.name}
                      </p>
                      <p className="text-[11.5px] text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[10px] font-extrabold px-2 py-0.6 rounded-full border ${
                      user.role === 'Super Admin' 
                        ? 'text-primary bg-primary/10 border-primary/20'
                        : user.role === 'Broker'
                        ? 'text-info bg-soft-info border-info/20'
                        : user.role === 'Agent'
                        ? 'text-success bg-soft-success border-success/20'
                        : 'text-muted-foreground bg-muted border-border/40'
                    }`}>
                      {user.role}
                    </span>

                    <button
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      disabled={!hasUserManagePermission}
                      className={`h-7 w-7 rounded-full flex items-center justify-center transition-colors ${
                        hasUserManagePermission
                          ? "text-danger hover:bg-danger/10 cursor-pointer"
                          : "text-muted-foreground/40 cursor-not-allowed"
                      }`}
                      title={hasUserManagePermission ? "Delete user profile" : "Permission Denied"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Roles Permissions Matrix (col-xl-7) */}
        <div className="xl:col-span-7 col-span-12 space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)] overflow-hidden">
            <h3 className="text-[15px] font-bold text-foreground flex items-center gap-2 mb-2">
              <Key className="h-4 w-4 text-primary" /> Roles & Permissions Matrix
            </h3>
            <p className="text-[12.5px] text-muted-foreground mb-4">
              Configure access rights. Checkboxes toggle permission grants for each role instantly.
            </p>

            <div className="overflow-x-auto -mx-5 px-5">
              <table className="w-full text-left border-collapse text-[12.5px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2.5 font-bold text-muted-foreground uppercase text-[10.5px] min-w-[200px]">Permission</th>
                    {roles.map(role => (
                      <th key={role} className="py-2.5 px-3 font-bold text-foreground text-center min-w-[90px]">{role}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {permissionsList.map((perm) => (
                    <tr key={perm.key} className="hover:bg-muted/10 transition-colors">
                      <td className="py-3 pr-4">
                        <span className="font-bold text-foreground block">{perm.label}</span>
                        <span className="text-[11px] text-muted-foreground mt-0.5 block max-w-sm">{perm.desc}</span>
                      </td>
                      {roles.map(role => {
                        const isChecked = rolePermissions[role]?.includes(perm.key) ?? false;
                        const isSuperAdminDefault = role === "Super Admin"; // Let's keep Super Admin fully powered for security defaults

                        return (
                          <td key={role} className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              disabled={isSuperAdminDefault || !hasSecurityPermission}
                              onChange={() => {
                                if (!hasSecurityPermission) {
                                  toast.error("Permission Denied: Only users with Split/Commissions Admin permissions can modify RBAC rules.");
                                  return;
                                }
                                togglePermission(role, perm.key);
                                toast.success(`Updated permission '${perm.label}' for role: ${role}`);
                              }}
                              className={`rounded border-border text-primary h-4 w-4 bg-muted/10 ${
                                isSuperAdminDefault 
                                  ? "cursor-not-allowed opacity-60 text-primary/70"
                                  : hasSecurityPermission 
                                  ? "cursor-pointer focus:ring-primary"
                                  : "cursor-not-allowed opacity-50"
                              }`}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ── Invite User Modal ─────────────────────────────────────── */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/10">
              <h3 className="text-[16px] font-bold text-foreground flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" /> Invite Team Member
              </h3>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="text-muted-foreground hover:text-foreground h-7 w-7 rounded-full hover:bg-muted flex items-center justify-center transition-colors text-[18px]"
              >
                <i className="ri-close-line" />
              </button>
            </div>

            <form onSubmit={handleInviteUser}>
              <div className="p-5 space-y-4 text-[13px]">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="john.doe@agency.com"
                    className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Role selection */}
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
                    Assign Security Role *
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors"
                  >
                    <option value="Viewer">Viewer (Read-only)</option>
                    <option value="Agent">Agent (Regular sales access)</option>
                    <option value="Broker">Broker (Manage splits/deals)</option>
                    <option value="Super Admin">Super Admin (Full permission)</option>
                  </select>
                </div>
              </div>

              <div className="px-5 py-4 bg-muted/30 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="text-[12.5px] font-bold text-muted-foreground border border-border bg-card hover:bg-muted px-4 py-2 rounded-[5px] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/95 text-white text-[12.5px] font-bold px-4 py-2 rounded-[5px] shadow-sm transition-all"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
