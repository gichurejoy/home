"use client";

import { useState, useMemo } from "react";
import { mockTransactions, Transaction } from "@/data/mockTransactions";
import Link from "next/link";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDetailsTx, setActiveDetailsTx] = useState<Transaction | null>(null);
  const itemsPerPage = 6;

  // Search and filter logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "All" || tx.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchTerm, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Row selection
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(paginatedTransactions.map((tx) => tx.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, id]);
    } else {
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this transaction record?")) {
      setTransactions(transactions.filter((tx) => tx.id !== id));
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;
    if (confirm(`Are you sure you want to delete the ${selectedRows.length} selected transaction records?`)) {
      setTransactions(transactions.filter((tx) => !selectedRows.includes(tx.id)));
      setSelectedRows([]);
    }
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-[20px] font-bold text-foreground">Transactions</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Track financial operations, commissions, and payout records</p>
        </div>
        <ol className="flex items-center text-[13px] text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">Dashboard</Link>
          </li>
          <li className="mx-1 text-muted-foreground/60">&rsaquo;</li>
          <li className="text-primary font-medium">Transactions</li>
        </ol>
      </div>

      {/* ── Search and Metric Actions Row ─────────────────────────── */}
      <div className="bg-card border border-border rounded-[8px] p-4 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <input
                type="search"
                className="w-full bg-background border border-border rounded-[5px] pl-9 pr-4 py-1.5 text-[13px] focus:outline-none focus:border-primary transition-colors text-foreground placeholder-muted-foreground"
                placeholder="Search Transactions..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[15px]" />
            </div>

            {/* Total Count Display */}
            <div className="flex items-center shrink-0">
              <h5 className="text-[14px] text-foreground font-semibold">
                {filteredTransactions.length}{" "}
                <span className="text-muted-foreground font-normal">Transactions</span>
              </h5>
            </div>

            {/* Status Quick Filter Tab */}
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[13px] text-muted-foreground font-semibold mr-1">Filter:</span>
              <div className="inline-flex rounded-[5px] bg-background border border-border p-0.5">
                {["All", "Completed", "Pending", "Canceled"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setSelectedStatus(status);
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-[4px] text-[11.5px] font-bold transition-all ${
                      selectedStatus === status
                        ? "bg-[#604ae3] text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedRows.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="bg-[#ff5b5b]/10 text-[#ff5b5b] hover:bg-[#ff5b5b] hover:text-white text-[13px] font-bold px-3 py-1.5 rounded-[5px] flex items-center gap-1.5 transition-all border border-[#ff5b5b]/20"
              >
                <i className="ri-trash-line text-[15px]" /> Delete Selected ({selectedRows.length})
              </button>
            )}
            <button
              onClick={() => {
                alert("Financial reports generation dashboard placeholder.");
              }}
              className="border border-border hover:bg-muted text-muted-foreground hover:text-foreground text-[13px] font-bold h-9 px-3 rounded-[5px] flex items-center gap-1 transition-colors"
            >
              <i className="ri-settings-3-line" /> Options
            </button>
          </div>
        </div>
      </div>

      {/* ── Transactions Table List ──────────────────────────────── */}
      <div className="bg-card border border-border rounded-[8px] shadow-[0_0_35px_rgba(154,161,171,0.05)] overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h4 className="font-bold text-[15.5px] text-foreground">All Transactions List</h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse align-middle text-nowrap">
            <thead className="bg-[#f8f9fa] dark:bg-[#1f293d] border-b border-border text-[12.5px] text-muted-foreground font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5 w-10">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-border text-[#604ae3] focus:ring-[#604ae3] h-4 w-4"
                      onChange={handleSelectAll}
                      checked={
                        paginatedTransactions.length > 0 &&
                        paginatedTransactions.every((tx) => selectedRows.includes(tx.id))
                      }
                    />
                  </div>
                </th>
                <th className="px-5 py-3.5">Transactions ID</th>
                <th className="px-5 py-3.5">Customer Photo & Name</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Payment Method</th>
                <th className="px-5 py-3.5">Agent Name</th>
                <th className="px-5 py-3.5">Invested Property</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-[13.5px] divide-y divide-border text-foreground">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center text-muted-foreground">
                    No transactions found matching the search criteria.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx) => {
                  const isChecked = selectedRows.includes(tx.id);
                  return (
                    <tr
                      key={tx.id}
                      className={`hover:bg-muted/30 transition-colors ${
                        isChecked ? "bg-primary/5 hover:bg-primary/5" : ""
                      }`}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-border text-[#604ae3] focus:ring-[#604ae3] h-4 w-4"
                            checked={isChecked}
                            onChange={(e) => handleSelectRow(tx.id, e.target.checked)}
                          />
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => setActiveDetailsTx(tx)}
                          className="text-[#604ae3] font-semibold hover:underline bg-transparent border-0 cursor-pointer"
                        >
                          {tx.id}
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={tx.customerAvatar}
                            alt={tx.customerName}
                            className="w-9 h-9 rounded-full object-cover border border-border"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${tx.customerName}`;
                            }}
                          />
                          <span className="font-semibold text-foreground">{tx.customerName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {tx.date}
                      </td>
                      <td className="px-5 py-3 text-foreground font-bold">
                        {formatPrice(tx.amount)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-9 rounded bg-[#f4f6fb] dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold border border-border overflow-hidden">
                            {tx.cardBrand || tx.paymentType}
                          </div>
                          <div className="leading-tight">
                            <p className="text-[12.5px] font-medium text-foreground mb-0">{tx.cardNumber || "Account Transfer"}</p>
                            <p className="text-[10px] text-muted-foreground mb-0">{tx.paymentType} Payment</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">
                        {tx.agentName}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground max-w-[200px] truncate" title={tx.propertyAddress}>
                        {tx.propertyAddress}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-[4px] text-[11px] font-bold uppercase tracking-wider ${
                            tx.status === "Completed"
                              ? "bg-success/15 text-success"
                              : tx.status === "Pending"
                              ? "bg-warning/15 text-warning"
                              : "bg-danger/15 text-danger"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setActiveDetailsTx(tx)}
                            className="h-8 w-8 rounded bg-secondary hover:bg-secondary-foreground/10 text-secondary-foreground flex items-center justify-center transition-colors text-[16px]"
                            title="View Overview"
                          >
                            <i className="ri-eye-line text-[15px]" />
                          </button>
                          <button
                            onClick={() => {
                              const newStatus = prompt("Change status (Completed/Pending/Canceled):", tx.status);
                              if (newStatus === "Completed" || newStatus === "Pending" || newStatus === "Canceled") {
                                setTransactions(transactions.map(t => t.id === tx.id ? { ...t, status: newStatus } : t));
                              }
                            }}
                            className="h-8 w-8 rounded bg-soft-primary text-primary hover:bg-[#604ae3] hover:text-white flex items-center justify-center transition-all text-[16px]"
                            title="Edit Status"
                          >
                            <i className="ri-edit-line text-[15px]" />
                          </button>
                          <button
                            onClick={() => handleDelete(tx.id)}
                            className="h-8 w-8 rounded bg-soft-danger text-danger hover:bg-[#ff5b5b] hover:text-white flex items-center justify-center transition-all text-[16px]"
                            title="Delete"
                          >
                            <i className="ri-delete-bin-line text-[15px]" />
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

        {/* ── Table Pagination Footer ─────────────────────────────── */}
        {filteredTransactions.length > 0 && (
          <div className="px-5 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[13px] text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="font-semibold text-foreground">
                {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}
              </span>{" "}
              of <span className="font-semibold text-foreground">{filteredTransactions.length}</span> Transactions
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
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`h-8 w-8 rounded-[5px] text-[12.5px] font-bold transition-all ${
                    currentPage === idx + 1
                      ? "bg-[#604ae3] text-white"
                      : "text-muted-foreground border border-border hover:bg-muted"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
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

      {/* ── Transaction Details Modal ────────────────────────────── */}
      {activeDetailsTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-[8px] shadow-lg max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-[#ebe9fc]/20 dark:bg-slate-800/50">
              <div>
                <h3 className="text-[16px] font-bold text-foreground">Transaction Details</h3>
                <p className="text-[11.5px] text-primary font-semibold mt-0.5">{activeDetailsTx.id}</p>
              </div>
              <button
                onClick={() => setActiveDetailsTx(null)}
                className="h-8 w-8 rounded hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
              >
                <i className="ri-close-line text-[20px]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-[13.5px]">
              {/* Customer Row */}
              <div className="flex items-center gap-3 bg-muted/30 p-2.5 rounded-[6px] border border-border">
                <img
                  src={activeDetailsTx.customerAvatar}
                  alt={activeDetailsTx.customerName}
                  className="w-10 h-10 rounded-full object-cover border border-border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${activeDetailsTx.customerName}`;
                  }}
                />
                <div>
                  <h4 className="font-bold text-foreground mb-0.5">{activeDetailsTx.customerName}</h4>
                  <p className="text-[11px] text-muted-foreground mb-0">Buyer Account</p>
                </div>
                <div className="ml-auto">
                  <span
                    className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider ${
                      activeDetailsTx.status === "Completed"
                        ? "bg-success/15 text-success"
                        : activeDetailsTx.status === "Pending"
                        ? "bg-warning/15 text-warning"
                        : "bg-danger/15 text-danger"
                    }`}
                  >
                    {activeDetailsTx.status}
                  </span>
                </div>
              </div>

              {/* Data list */}
              <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 pt-2">
                <div>
                  <span className="text-[11px] text-muted-foreground font-medium block">AMOUNT</span>
                  <span className="text-[15px] font-bold text-foreground">{formatPrice(activeDetailsTx.amount)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground font-medium block">TRANSACTION DATE</span>
                  <span className="font-semibold text-foreground">{activeDetailsTx.date}</span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground font-medium block">PAYMENT METHOD</span>
                  <span className="font-medium text-foreground">{activeDetailsTx.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground font-medium block">ASSIGNED AGENT</span>
                  <span className="font-medium text-foreground">{activeDetailsTx.agentName}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[11px] text-muted-foreground font-medium block">INVESTED PROPERTY ADDRESS</span>
                  <span className="font-medium text-foreground leading-snug">{activeDetailsTx.propertyAddress}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-muted/10">
              <button
                onClick={() => {
                  window.print();
                }}
                className="border border-border hover:bg-muted text-muted-foreground hover:text-foreground text-[12.5px] font-bold px-4 py-2 rounded-[5px] transition-colors flex items-center gap-1.5"
              >
                <i className="ri-printer-line" /> Print Invoice
              </button>
              <button
                onClick={() => setActiveDetailsTx(null)}
                className="bg-primary hover:bg-[#4d36cd] text-white text-[12.5px] font-bold px-4 py-2 rounded-[5px] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
