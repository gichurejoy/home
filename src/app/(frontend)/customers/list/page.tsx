"use client";

import { useState, useMemo, useEffect } from "react";
import { customers as initialCustomers, Customer } from "@/data/mockCustomers";
import { useToastStore, toast } from "@/store/useToastStore";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { exportToCSV } from "@/lib/exportUtils";
import Link from "next/link";
import { Users } from "lucide-react";

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 6;

  const confirm = useToastStore((state) => state.confirm);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Search and filter logic
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.propertyType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.interestedProperties.some((prop) =>
          prop.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus =
        selectedStatus === "All" || customer.listStatus === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Row selection
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(paginatedCustomers.map((c) => c.id));
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

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete Customer",
      message: "Are you sure you want to delete this customer? All associated history will be hidden.",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (ok) {
      setCustomers(customers.filter((c) => c.id !== id));
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
      toast.success("Customer removed successfully.");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    const ok = await confirm({
      title: "Delete Multiple Customers",
      message: `Are you sure you want to delete the ${selectedRows.length} selected customers?`,
      confirmText: `Delete ${selectedRows.length} Customers`,
      cancelText: "Cancel",
    });
    if (ok) {
      setCustomers(customers.filter((c) => !selectedRows.includes(c.id)));
      setSelectedRows([]);
      toast.success("Selected customers deleted successfully.");
    }
  };

  const handleExport = () => {
    const headers = [
      { key: "id" as const, label: "Customer ID" },
      { key: "name" as const, label: "Name" },
      { key: "email" as const, label: "Email" },
      { key: "phone" as const, label: "Phone" },
      { key: "propertyType" as const, label: "Property Type" },
      { key: "listStatus" as const, label: "Status" },
      { key: "ownPropertiesCount" as const, label: "Properties Owned" },
      { key: "investOnProperty" as const, label: "Total Invested" },
    ];
    const success = exportToCSV(filteredCustomers, headers, "customers");
    if (success) {
      toast.success("Customers list exported to CSV successfully.");
    } else {
      toast.error("Failed to export customer records.");
    }
  };

  const handleMoreSettings = () => {
    toast.info("More customer settings panel is in development.");
  };

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <Breadcrumb />
          <h1 className="text-[20px] font-bold text-foreground">Customer List</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Manage and organize your real estate customers
          </p>
        </div>
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
                placeholder="Search Customer..."
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
                {filteredCustomers.length}{" "}
                <span className="text-muted-foreground font-normal">Customers</span>
              </h5>
            </div>

            {/* Status Quick Filter Tab */}
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[13px] text-muted-foreground font-semibold mr-1">Filter:</span>
              <div className="inline-flex rounded-[5px] bg-background border border-border p-0.5">
                {["All", "Interested", "Under Review", "Follow-up"].map((status) => (
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
                className="bg-[#ff5b5b]/10 text-[#ff5b5b] hover:bg-[#ff5b5b] hover:text-white text-[13px] font-bold px-3 py-1.5 rounded-[5px] flex items-center gap-1.5 transition-all border border-[#ff5b5b]/20 cursor-pointer"
              >
                <i className="ri-trash-line text-[15px]" /> Delete Selected ({selectedRows.length})
              </button>
            )}
            <Link
              href="/customers/grid"
              className="border border-border hover:bg-muted text-muted-foreground hover:text-foreground h-9 w-9 rounded-[5px] flex items-center justify-center transition-colors text-[16px]"
              title="Grid View"
            >
              <i className="ri-grid-fill" />
            </Link>
            <button
              onClick={handleMoreSettings}
              className="border border-border hover:bg-muted text-muted-foreground hover:text-foreground text-[13px] font-bold h-9 px-3 rounded-[5px] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <i className="ri-settings-2-line" /> More Settings
            </button>
            <Link
              href="/customers/add"
              className="bg-[#0acf97] text-white text-[13px] font-bold px-3.5 py-1.5 rounded-[5px] flex items-center gap-1 hover:bg-[#09b986] transition-all"
            >
              <i className="ri-add-line text-[15px]" /> New Customer
            </Link>
          </div>
        </div>
      </div>

      {/* ── All Customers List Card ──────────────────────────────── */}
      {isLoading ? (
        <TableSkeleton rows={5} cols={9} />
      ) : filteredCustomers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Customers Found"
          description={
            searchTerm
              ? "There are no customers that match your criteria. Try another search term."
              : "No customers listed in this category."
          }
          actionLabel={searchTerm ? "Clear Filters" : "Add Customer"}
          onAction={() => {
            if (searchTerm) {
              setSearchTerm("");
            } else {
              window.location.href = "/customers/add";
            }
          }}
        />
      ) : (
        <div className="bg-card border border-border rounded-[8px] shadow-[0_0_35px_rgba(154,161,171,0.05)] overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h4 className="font-bold text-[15.5px] text-foreground">All Customer List</h4>
            <div>
              <button
                onClick={handleExport}
                className="border border-border hover:bg-muted text-muted-foreground hover:text-foreground rounded px-3 py-1.5 text-[12px] font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <i className="ri-download-2-line" /> Export CSV
              </button>
            </div>
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
                          paginatedCustomers.length > 0 &&
                          paginatedCustomers.every((c) => selectedRows.includes(c.id))
                        }
                      />
                    </div>
                  </th>
                  <th className="px-5 py-3.5">Customer Photo & Name</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Contact</th>
                  <th className="px-5 py-3.5">Property Type</th>
                  <th className="px-5 py-3.5">Interested Properties</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Last Contacted</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-[13.5px] divide-y divide-border text-foreground">
                {paginatedCustomers.map((customer) => {
                  const isChecked = selectedRows.includes(customer.id);
                  return (
                    <tr
                      key={customer.id}
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
                            onChange={(e) => handleSelectRow(customer.id, e.target.checked)}
                          />
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={customer.avatar}
                            alt={customer.name}
                            className="w-9 h-9 rounded-full object-cover border border-border"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${customer.name}`;
                            }}
                          />
                          <Link
                            href={`/customers/${customer.id}`}
                            className="font-semibold text-foreground hover:text-[#604ae3] transition-colors"
                          >
                            {customer.name}
                          </Link>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{customer.email}</td>
                      <td className="px-5 py-3 text-muted-foreground font-medium">
                        {customer.phone}
                      </td>
                      <td className="px-5 py-3 text-foreground font-semibold">
                        {customer.propertyType}
                      </td>
                      <td
                        className="px-5 py-3 text-muted-foreground max-w-[200px] truncate"
                        title={customer.interestedProperties.join(", ")}
                      >
                        {customer.interestedProperties.join(", ")}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-[4px] text-[11px] font-bold uppercase tracking-wider ${
                            customer.listStatus === "Interested"
                              ? "bg-warning/15 text-warning"
                              : customer.listStatus === "Under Review"
                              ? "bg-info/15 text-info"
                              : "bg-[#604ae3]/15 text-[#604ae3]"
                          }`}
                        >
                          {customer.listStatus}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        25/03/2023 {/* Static contacted date */}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/customers/${customer.id}`}
                            className="h-8 w-8 rounded bg-secondary hover:bg-secondary-foreground/10 text-secondary-foreground flex items-center justify-center transition-colors text-[16px]"
                            title="View Overview"
                          >
                            <i className="ri-eye-line text-[15px]" />
                          </Link>
                          <Link
                            href="/customers/add"
                            className="h-8 w-8 rounded bg-soft-primary text-primary hover:bg-[#604ae3] hover:text-white flex items-center justify-center transition-all text-[16px]"
                            title="Edit"
                          >
                            <i className="ri-edit-line text-[15px]" />
                          </Link>
                          <button
                            onClick={() => handleDelete(customer.id)}
                            className="h-8 w-8 rounded bg-soft-danger text-danger hover:bg-[#ff5b5b] hover:text-white flex items-center justify-center transition-all text-[16px] cursor-pointer"
                            title="Delete"
                          >
                            <i className="ri-delete-bin-line text-[15px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Table Pagination Footer ─────────────────────────────── */}
          {filteredCustomers.length > 0 && (
            <div className="px-5 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[13px] text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span className="font-semibold text-foreground">
                  {Math.min(currentPage * itemsPerPage, filteredCustomers.length)}
                </span>{" "}
                of <span className="font-semibold text-foreground">{filteredCustomers.length}</span> Customers
              </p>
              <nav className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`text-[12.5px] border border-border px-3 py-1.5 rounded-[5px] font-medium transition-colors ${
                    currentPage === 1
                      ? "text-muted-foreground/40 cursor-not-allowed"
                      : "text-muted-foreground hover:bg-muted cursor-pointer"
                  }`}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePageChange(idx + 1)}
                    className={`h-8 w-8 rounded-[5px] text-[12.5px] font-bold transition-all cursor-pointer ${
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
                      : "text-muted-foreground hover:bg-muted cursor-pointer"
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
