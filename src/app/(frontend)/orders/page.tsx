"use client";

import { useState, useMemo } from "react";
import { mockOrders, Order } from "@/data/mockOrders";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Search and filter logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.includes(searchTerm) ||
        order.propertyType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.properties.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "All" || order.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Row selection
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(paginatedOrders.map((o) => o.id));
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
    if (confirm("Are you sure you want to delete this order?")) {
      setOrders(orders.filter((o) => o.id !== id));
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;
    if (confirm(`Are you sure you want to delete the ${selectedRows.length} selected orders?`)) {
      setOrders(orders.filter((o) => !selectedRows.includes(o.id)));
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
          <h1 className="text-[20px] font-bold text-foreground">Orders</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Manage and track property orders and purchase requests</p>
        </div>
        <ol className="flex items-center text-[13px] text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">Dashboard</Link>
          </li>
          <li className="mx-1 text-muted-foreground/60">&rsaquo;</li>
          <li className="text-primary font-medium">Orders</li>
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
                placeholder="Search Orders..."
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
                {filteredOrders.length}{" "}
                <span className="text-muted-foreground font-normal">Orders</span>
              </h5>
            </div>

            {/* Status Quick Filter Tab */}
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[13px] text-muted-foreground font-semibold mr-1">Filter:</span>
              <div className="inline-flex rounded-[5px] bg-background border border-border p-0.5">
                {["All", "Paid", "Pending", "Unpaid"].map((status) => (
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
                alert("This features lets you export all orders as excel sheet or pdf documents.");
              }}
              className="border border-border hover:bg-muted text-muted-foreground hover:text-foreground text-[13px] font-bold h-9 px-3 rounded-[5px] flex items-center gap-1 transition-colors"
            >
              <i className="ri-download-2-line" /> Export
            </button>
            <button
              onClick={() => {
                const name = prompt("Enter customer name for new order:");
                if (!name) return;
                const propType = prompt("Enter property type (Residential/Commercial/Apartment/Industrial):", "Residential");
                if (!propType) return;
                const amount = prompt("Enter order amount ($):", "1500000");
                if (!amount) return;
                const props = prompt("Enter property address(es):", "123 Main St");
                if (!props) return;

                const newOrder: Order = {
                  id: `ORD-0${orders.length + 1}`,
                  name,
                  avatar: `/assets/images/users/avatar-${(orders.length % 9) + 2}.jpg`,
                  date: new Date().toLocaleDateString("en-GB"),
                  phone: "+231 00-0000000",
                  propertyType: propType,
                  amount: parseFloat(amount),
                  properties: props,
                  status: "Pending"
                };
                setOrders([newOrder, ...orders]);
              }}
              className="bg-[#0acf97] text-white text-[13px] font-bold px-3.5 py-1.5 rounded-[5px] flex items-center gap-1 hover:bg-[#09b986] transition-all"
            >
              <i className="ri-add-line text-[15px]" /> New Order
            </button>
          </div>
        </div>
      </div>

      {/* ── Orders Table List ──────────────────────────────── */}
      <div className="bg-card border border-border rounded-[8px] shadow-[0_0_35px_rgba(154,161,171,0.05)] overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h4 className="font-bold text-[15.5px] text-foreground">All Order List</h4>
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
                        paginatedOrders.length > 0 &&
                        paginatedOrders.every((o) => selectedRows.includes(o.id))
                      }
                    />
                  </div>
                </th>
                <th className="px-5 py-3.5">Customer Photo & Name</th>
                <th className="px-5 py-3.5">Purchase Date</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5">Property Type</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Purchase Properties</th>
                <th className="px-5 py-3.5">Amount Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-[13.5px] divide-y divide-border text-foreground">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-muted-foreground">
                    No orders found matching the search criteria.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const isChecked = selectedRows.includes(order.id);
                  return (
                    <tr
                      key={order.id}
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
                            onChange={(e) => handleSelectRow(order.id, e.target.checked)}
                          />
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={order.avatar}
                            alt={order.name}
                            className="w-9 h-9 rounded-full object-cover border border-border"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${order.name}`;
                            }}
                          />
                          <span className="font-semibold text-foreground">{order.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {order.date}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground font-medium">
                        {order.phone}
                      </td>
                      <td className="px-5 py-3 text-foreground font-semibold">
                        {order.propertyType}
                      </td>
                      <td className="px-5 py-3 text-foreground font-bold">
                        {formatPrice(order.amount)}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground max-w-[220px] truncate" title={order.properties}>
                        {order.properties}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-[4px] text-[11px] font-bold uppercase tracking-wider ${
                            order.status === "Paid"
                              ? "bg-success/15 text-success"
                              : order.status === "Pending"
                              ? "bg-warning/15 text-warning"
                              : "bg-danger/15 text-danger"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              alert(`Order details:\nID: ${order.id}\nCustomer: ${order.name}\nAmount: ${formatPrice(order.amount)}\nProperties: ${order.properties}\nStatus: ${order.status}`);
                            }}
                            className="h-8 w-8 rounded bg-secondary hover:bg-secondary-foreground/10 text-secondary-foreground flex items-center justify-center transition-colors text-[16px]"
                            title="View Details"
                          >
                            <i className="ri-eye-line text-[15px]" />
                          </button>
                          <button
                            onClick={() => {
                              const newStatus = prompt("Change status (Paid/Pending/Unpaid):", order.status);
                              if (newStatus === "Paid" || newStatus === "Pending" || newStatus === "Unpaid") {
                                setOrders(orders.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
                              }
                            }}
                            className="h-8 w-8 rounded bg-soft-primary text-primary hover:bg-[#604ae3] hover:text-white flex items-center justify-center transition-all text-[16px]"
                            title="Edit Status"
                          >
                            <i className="ri-edit-line text-[15px]" />
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
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
        {filteredOrders.length > 0 && (
          <div className="px-5 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[13px] text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="font-semibold text-foreground">
                {Math.min(currentPage * itemsPerPage, filteredOrders.length)}
              </span>{" "}
              of <span className="font-semibold text-foreground">{filteredOrders.length}</span> Orders
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
    </div>
  );
}
