"use client";

import { useState, useMemo } from "react";
import { agents as initialAgents, Agent } from "@/data/mockAgents";
import Link from "next/link";

export default function AgentList() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Dropdown states
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Search filter
  const filteredAgents = useMemo(() => {
    return agents.filter((agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [agents, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);
  const paginatedAgents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAgents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAgents, currentPage]);

  // Checkbox handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allDisplayedIds = paginatedAgents.map((a) => a.id);
      setSelectedIds([...new Set([...selectedIds, ...allDisplayedIds])]);
    } else {
      const allDisplayedIds = paginatedAgents.map((a) => a.id);
      setSelectedIds(selectedIds.filter((id) => !allDisplayedIds.includes(id)));
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this agent?")) {
      setAgents(agents.filter((a) => a.id !== id));
      setSelectedIds(selectedIds.filter((item) => item !== id));
    }
  };

  const isAllSelectedOnPage = useMemo(() => {
    if (paginatedAgents.length === 0) return false;
    return paginatedAgents.every((a) => selectedIds.includes(a.id));
  }, [paginatedAgents, selectedIds]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-[20px] font-bold text-foreground">Agent List</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Real Estate Agent Management</p>
        </div>
        <ol className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <li>
            <a href="/" className="hover:text-primary transition-colors">Real Estate</a>
          </li>
          <li><i className="ri-arrow-right-s-line text-[12px]" /></li>
          <li className="text-primary font-medium">Agent List</li>
        </ol>
      </div>

      {/* ── Search & Actions Header Card ─────────────────────────── */}
      <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 flex-1">
            {/* Search Form */}
            <div className="relative min-w-[240px]">
              <input
                type="text"
                placeholder="Search Agent..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] pl-8 pr-3 py-1.5 outline-none focus:border-[#604ae3] transition-colors placeholder:text-muted-foreground/60"
              />
              <iconify-icon
                icon="solar:magnifer-broken"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/80 text-[16px]"
              />
            </div>
            <div>
              <h5 className="text-[13.5px] font-bold text-foreground mb-0">
                {filteredAgents.length} <span className="text-muted-foreground font-semibold">Agents Found</span>
              </h5>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="btn text-[13px] font-semibold text-muted-foreground border border-border bg-muted/20 hover:bg-muted/40 px-3.5 py-1.5 rounded-[5px] transition-all flex items-center gap-1">
              <i className="ri-settings-2-line" /> More Setting
            </button>
            <button type="button" className="btn text-[13px] font-semibold text-muted-foreground border border-border bg-muted/20 hover:bg-muted/40 px-3.5 py-1.5 rounded-[5px] transition-all flex items-center gap-1">
              <i className="ri-filter-line" /> Filters
            </button>
            <Link
              href="/agents/add"
              className="bg-[#604ae3] text-white text-[13px] font-bold px-3.5 py-1.5 rounded-[5px] flex items-center gap-1 hover:bg-[#503bc7] transition-all shadow-sm"
            >
              <i className="ri-add-line text-[15px]" /> New Agent
            </Link>
          </div>
        </div>
      </div>

      {/* ── Table Card ─────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-[8px] shadow-[0_0_35px_rgba(154,161,171,0.05)] overflow-hidden">
        {/* Table Title and Actions bar */}
        <div className="p-5 flex items-center justify-between border-b border-border">
          <div>
            <h4 className="text-[15.5px] font-bold text-foreground">All Agent List</h4>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="flex items-center gap-1 text-[13px] font-semibold text-muted-foreground border border-border bg-muted/20 hover:bg-muted/40 px-3 py-1.5 rounded-[5px] transition-all"
            >
              This Month <i className="ri-arrow-down-s-line text-[14px]" />
            </button>
            {isExportOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-card border border-border rounded-[5px] shadow-lg py-1 z-10 text-[12.5px] text-foreground">
                <a href="#!" className="block px-3 py-1.5 hover:bg-muted font-medium">Download</a>
                <a href="#!" className="block px-3 py-1.5 hover:bg-muted font-medium">Export</a>
                <a href="#!" className="block px-3 py-1.5 hover:bg-muted font-medium">Import</a>
              </div>
            )}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse align-middle">
            <thead className="bg-muted/20 text-[13px] text-muted-foreground font-semibold border-b border-border">
              <tr>
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelectedOnPage}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4 bg-muted/20 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 min-w-[220px]">Agent Photo & Name</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-[13.5px]">
              {paginatedAgents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-muted-foreground">
                    No agents match your query.
                  </td>
                </tr>
              ) : (
                paginatedAgents.map((agent) => {
                  const isSelected = selectedIds.includes(agent.id);
                  const active = agent.status === "Active";
                  const onLeave = agent.status === "On Leave";
                  return (
                    <tr
                      key={agent.id}
                      className={`hover:bg-muted/10 transition-colors ${
                        isSelected ? "bg-muted/10" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectOne(agent.id, e.target.checked)}
                          className="rounded border-border text-primary focus:ring-primary h-4 w-4 bg-muted/20 cursor-pointer"
                        />
                      </td>

                      {/* Photo & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={agent.avatar}
                            alt={agent.name}
                            className="h-[40px] w-[40px] rounded-full object-cover border border-muted/80 shadow-sm"
                          />
                          <Link
                            href={`/agents/${agent.id}`}
                            className="font-bold text-foreground hover:text-[#604ae3] transition-colors leading-tight block"
                          >
                            {agent.name}
                          </Link>
                        </div>
                      </td>

                      {/* Address */}
                      <td className="py-3.5 px-4 text-muted-foreground font-medium max-w-[200px] truncate" title={agent.address}>
                        {agent.address}
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-muted-foreground font-medium">
                        {agent.email}
                      </td>

                      {/* Contact Phone */}
                      <td className="py-3.5 px-4 text-muted-foreground font-medium">
                        {agent.phone}
                      </td>

                      {/* Experience */}
                      <td className="py-3.5 px-4 text-muted-foreground font-medium">
                        {agent.experience}
                      </td>

                      {/* Date (Join Date) */}
                      <td className="py-3.5 px-4 text-muted-foreground font-medium">
                        {new Date(agent.joinDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Status badge */}
                      <td className="py-3.5 px-4">
                        <span className={`text-[12px] font-bold px-2 py-0.5 rounded ${
                          active ? "bg-[#0acf97]/15 text-[#0acf97]" :
                          onLeave ? "bg-[#ffb12f]/15 text-[#ffb12f]" :
                          "bg-[#ff5b5b]/15 text-[#ff5b5b]"
                        }`}>
                          {agent.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/agents/${agent.id}`}
                            className="h-7 w-7 rounded bg-muted hover:bg-muted-foreground/10 text-foreground flex items-center justify-center transition-all"
                            title="View"
                          >
                            <iconify-icon icon="solar:eye-broken" className="text-[16px]" />
                          </Link>
                          <Link
                            href="/agents/add"
                            className="h-7 w-7 rounded bg-[#604ae3]/10 hover:bg-[#604ae3] text-[#604ae3] hover:text-white flex items-center justify-center transition-all"
                            title="Edit"
                          >
                            <iconify-icon icon="solar:pen-2-broken" className="text-[16px]" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(agent.id)}
                            className="h-7 w-7 rounded bg-[#ff5b5b]/10 hover:bg-[#ff5b5b] text-[#ff5b5b] hover:text-white flex items-center justify-center transition-all"
                            title="Delete"
                          >
                            <iconify-icon icon="solar:trash-bin-minimalistic-2-broken" className="text-[16px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Pagination */}
        {filteredAgents.length > 0 && (
          <div className="p-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[13px] text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="font-semibold text-foreground">
                {Math.min(currentPage * itemsPerPage, filteredAgents.length)}
              </span>{" "}
              of <span className="font-semibold text-foreground">{filteredAgents.length}</span> agents
            </p>
            <nav className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className={`text-[12.5px] border border-border px-3 py-1.5 rounded-[5px] font-medium transition-colors ${
                  currentPage === 1
                    ? "text-muted-foreground/40 cursor-not-allowed"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const active = currentPage === pageNum;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`text-[12.5px] px-3.5 py-1.5 rounded-[5px] font-bold border transition-all ${
                      active
                        ? "border-[#604ae3] bg-[#604ae3] text-white"
                        : "border-border text-muted-foreground hover:bg-muted font-medium"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className={`text-[12.5px] border border-border px-3 py-1.5 rounded-[5px] font-medium transition-colors ${
                  currentPage === totalPages
                    ? "text-muted-foreground/40 cursor-not-allowed"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
