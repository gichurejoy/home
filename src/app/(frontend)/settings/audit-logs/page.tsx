"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/store/useToastStore";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { exportToCSV } from "@/lib/exportUtils";
import { 
  ShieldAlert, 
  Search, 
  Download, 
  Calendar, 
  Layers, 
  Users, 
  Database,
  Lock,
  Clock,
  Trash2,
  Filter,
  CheckCircle2
} from "lucide-react";

export default function AuditLogsPage() {
  const {
    sessionRole,
    rolePermissions,
    auditLogs
  } = useAppStore();

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [componentFilter, setComponentFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Check RBAC permission for Audit Export
  const hasAuditExport = rolePermissions[sessionRole]?.includes("audit_export") ?? false;

  // Filter audit logs based on parameters
  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      // 1. Search Query Match
      const matchesSearch = searchQuery.trim() === "" || 
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ip.includes(searchQuery);

      // 2. Category Filter
      const matchesCategory = categoryFilter === "all" || log.category === categoryFilter;

      // 3. Component Filter
      const matchesComponent = componentFilter === "all" || log.component === componentFilter;

      // 4. Date Filters
      const logTime = new Date(log.timestamp.replace(' ', 'T')).getTime();
      const startMs = startDate ? new Date(startDate).getTime() : 0;
      // Add end date + 1 day to include actions on the end day fully
      const endMs = endDate ? new Date(endDate).getTime() + 86400000 : Infinity;
      const matchesDates = logTime >= startMs && logTime <= endMs;

      return matchesSearch && matchesCategory && matchesComponent && matchesDates;
    });
  }, [auditLogs, searchQuery, categoryFilter, componentFilter, startDate, endDate]);

  // Log Category Counts
  const stats = useMemo(() => {
    const securityCount = auditLogs.filter(l => l.category === "Security").length;
    const createCount = auditLogs.filter(l => l.category === "Create").length;
    const deleteCount = auditLogs.filter(l => l.category === "Delete").length;
    const uniqueOperators = new Set(auditLogs.map(l => l.userId)).size;

    return {
      total: auditLogs.length,
      security: securityCount,
      operations: createCount + deleteCount,
      operators: uniqueOperators
    };
  }, [auditLogs]);

  // Export to CSV Action
  const handleCSVExport = () => {
    if (!hasAuditExport) {
      toast.error(`Permission Denied: Your current role (${sessionRole}) cannot export compliance audit trails.`);
      return;
    }

    const fileName = "audit_compliance_ledger";
    const csvData = filteredLogs.map(log => ({
      id: log.id,
      userId: log.userId,
      userName: log.userName,
      category: log.category,
      component: log.component,
      action: log.action,
      timestamp: log.timestamp,
      ip: log.ip
    }));

    const headers = [
      { key: "id", label: "Log ID" },
      { key: "userId", label: "Operator ID" },
      { key: "userName", label: "Operator Name" },
      { key: "category", label: "Compliance Category" },
      { key: "component", label: "Component Impacted" },
      { key: "action", label: "Action Ledger" },
      { key: "timestamp", label: "Timestamp UTC" },
      { key: "ip", label: "IP Address" }
    ] as any;

    exportToCSV(csvData, headers, fileName);
    toast.success(`Exported ${filteredLogs.length} audit trail records to CSV.`);
  };

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumb />
          <h1 className="text-[20px] font-bold text-foreground flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            Compliance Activity Audit Ledger
          </h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Immutable system logs tracing data edits, role access revisions, and agent split setups.
          </p>
        </div>

        <button
          onClick={handleCSVExport}
          disabled={!hasAuditExport}
          className={`text-[13px] font-bold px-4 py-2 rounded-[5px] flex items-center gap-1.5 shadow-sm transition-all ${
            hasAuditExport
              ? "bg-primary hover:bg-primary/95 text-white cursor-pointer"
              : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
          }`}
          title={hasAuditExport ? "Export Audit CSV" : "Exporting requires Audit Export Permissions"}
        >
          <Download className="h-4 w-4" /> Export CSV Ledger
        </button>
      </div>

      {/* ── Metric Cards Overview ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4.5 shadow-sm flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider block">Total Logged Items</span>
            <h4 className="text-[18px] font-black text-foreground mt-0.5">{stats.total} Events</h4>
            <span className="text-[10px] text-muted-foreground">Comprehensive system log</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4.5 shadow-sm flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-full bg-danger/10 text-danger flex items-center justify-center shrink-0">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider block">Security Alterations</span>
            <h4 className="text-[18px] font-black text-foreground mt-0.5 text-danger">{stats.security} Alerts</h4>
            <span className="text-[10px] text-muted-foreground">Permission matrix & role updates</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4.5 shadow-sm flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider block">Modified Operations</span>
            <h4 className="text-[18px] font-black text-foreground mt-0.5">{stats.operations} Modifies</h4>
            <span className="text-[10px] text-muted-foreground">Additions and deletions</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4.5 shadow-sm flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-full bg-info/10 text-info flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider block">Active Operators</span>
            <h4 className="text-[18px] font-black text-foreground mt-0.5">{stats.operators} Users</h4>
            <span className="text-[10px] text-muted-foreground">Unique active user ids</span>
          </div>
        </div>
      </div>

      {/* ── Ledger Filtering Toolbar ───────────────────────────────── */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs by operator name, description content, IP address..."
            className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] pl-9 pr-4 py-2 outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Action / Category dropdown */}
        <div className="flex flex-wrap items-center gap-3 text-[12.5px] font-semibold">
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Filter Category:</span>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-border bg-card text-foreground rounded-[5px] px-2.5 py-1.5 outline-none focus:border-primary cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Create">Create (New Data)</option>
            <option value="Update">Update (Edits)</option>
            <option value="Delete">Delete (Removals)</option>
            <option value="Security">Security (Access control)</option>
          </select>

          {/* Component dropdown */}
          <select
            value={componentFilter}
            onChange={(e) => setComponentFilter(e.target.value)}
            className="border border-border bg-card text-foreground rounded-[5px] px-2.5 py-1.5 outline-none focus:border-primary cursor-pointer"
          >
            <option value="all">All Components</option>
            <option value="Listings">Listings</option>
            <option value="Security">Security / RBAC</option>
            <option value="Deals">Deals & Splits</option>
            <option value="Reviews">Reviews</option>
            <option value="Calendar">Calendar</option>
            <option value="System">System Settings</option>
          </select>

          {/* Date controls */}
          <div className="flex items-center gap-2 border border-border bg-card rounded-[5px] px-2.5 py-1 text-[12.5px]">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-foreground outline-none w-[110px] text-[12px]"
              title="Start Date filter"
            />
            <span className="text-muted-foreground/50">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-foreground outline-none w-[110px] text-[12px]"
              title="End Date filter"
            />
          </div>
        </div>
      </div>

      {/* ── Chronological Log Ledger Feed ──────────────────────────── */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12.5px]">
            <thead>
              <tr className="border-b border-border bg-muted/10 font-bold text-muted-foreground text-[10.5px] uppercase">
                <th className="py-3 px-5 w-[110px]">Log ID</th>
                <th className="py-3 px-4 w-[180px]">Timestamp</th>
                <th className="py-3 px-4 w-[160px]">Compliance Operator</th>
                <th className="py-3 px-4 w-[110px] text-center">Category</th>
                <th className="py-3 px-4 w-[110px]">Component</th>
                <th className="py-3 px-4">Action Summary</th>
                <th className="py-3 px-5 text-right w-[130px]">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLogs.map(log => {
                // Style variables for category badge
                let badgeColor = "";
                if (log.category === "Security") badgeColor = "text-danger bg-soft-danger border-danger/20";
                else if (log.category === "Create") badgeColor = "text-success bg-soft-success border-success/20";
                else if (log.category === "Update") badgeColor = "text-info bg-soft-info border-info/20";
                else badgeColor = "text-warning bg-soft-warning border-warning/20";

                return (
                  <tr key={log.id} className="hover:bg-muted/10 transition-colors">
                    {/* Log ID */}
                    <td className="py-3 px-5 font-mono text-[11px] font-bold text-muted-foreground">
                      {log.id}
                    </td>

                    {/* Timestamp */}
                    <td className="py-3 px-4 text-muted-foreground font-semibold flex items-center gap-1.5 mt-1 border-0">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                      {log.timestamp}
                    </td>

                    {/* Operator */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <img 
                          src={log.userAvatar} 
                          className="h-6 w-6 rounded-full object-cover border border-border" 
                          alt="" 
                        />
                        <span className="font-bold text-foreground truncate max-w-[130px]" title={log.userName}>
                          {log.userName}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-center">
                      <span className={`text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${badgeColor}`}>
                        {log.category}
                      </span>
                    </td>

                    {/* Component */}
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-bold text-foreground">
                        {log.component}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-foreground font-semibold leading-relaxed">
                      {log.action}
                    </td>

                    {/* IP */}
                    <td className="py-3 px-5 text-right font-mono text-[11.5px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Lock className="h-3 w-3 text-muted-foreground/40" />
                        {log.ip}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground font-semibold italic bg-muted/5">
                    No compliance events matches active filtration queries.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer pagination simulator */}
        <div className="p-4 border-t border-border flex items-center justify-between text-[12px] text-muted-foreground bg-muted/5">
          <span>Showing {filteredLogs.length} of {auditLogs.length} audit entries</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1.5 border border-border bg-card rounded-[5px] hover:bg-muted/40 transition-colors font-bold disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-2.5 py-1.5 border border-border bg-card rounded-[5px] hover:bg-muted/40 transition-colors font-bold disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
