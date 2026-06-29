"use client";

import { useState, useMemo, useEffect } from "react";
import { mockOrders, Order } from "@/data/mockOrders";
import { useToastStore, toast } from "@/store/useToastStore";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { exportToCSV } from "@/lib/exportUtils";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

function CustomerAvatar({ src, name }: { src: string; name: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <Image
      src={imgSrc}
      alt={name}
      width={36}
      height={36}
      className="w-9 h-9 rounded-full object-cover border border-border"
      onError={() => {
        setImgSrc(`https://api.dicebear.com/7.x/initials/svg?seed=${name}`);
      }}
    />
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 6;

  const confirm = useToastStore((state) => state.confirm);
  
  // Modals state
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [editingOrderForStatus, setEditingOrderForStatus] = useState<Order | null>(null);
  
  const [newOrderForm, setNewOrderForm] = useState({
    name: "",
    phone: "",
    propertyType: "Residential",
    amount: 1500000,
    address: "",
    status: "Pending" as Order['status'],
  });

  // Simulate premium skeleton loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

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

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete Order",
      message: "Are you sure you want to delete this order? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (ok) {
      setOrders(orders.filter((o) => o.id !== id));
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
      toast.success("Order deleted successfully.");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    const ok = await confirm({
      title: "Delete Multiple Orders",
      message: `Are you sure you want to delete the ${selectedRows.length} selected orders?`,
      confirmText: `Delete ${selectedRows.length} Orders`,
      cancelText: "Cancel",
    });
    if (ok) {
      setOrders(orders.filter((o) => !selectedRows.includes(o.id)));
      setSelectedRows([]);
      toast.success("Selected orders deleted successfully.");
    }
  };

  const handleExport = () => {
    const headers = [
      { key: "id" as const, label: "Order ID" },
      { key: "name" as const, label: "Customer Name" },
      { key: "date" as const, label: "Date" },
      { key: "phone" as const, label: "Phone" },
      { key: "propertyType" as const, label: "Property Type" },
      { key: "amount" as const, label: "Amount" },
      { key: "properties" as const, label: "Properties" },
      { key: "status" as const, label: "Status" },
    ];
    const success = exportToCSV<Order>(filteredOrders, headers, "orders");
    if (success) {
      toast.success("CSV file downloaded successfully.");
    } else {
      toast.error("Failed to export data.");
    }
  };

  const handleViewDetails = (order: Order) => {
    confirm({
      title: `Order Details: ${order.id}`,
      message: `Customer: ${order.name}\nDate: ${order.date}\nContact: ${order.phone}\nProperty Type: ${order.propertyType}\nAmount: ${formatPrice(order.amount)}\nAddress: ${order.properties}\nStatus: ${order.status}`,
      confirmText: "Close",
      cancelText: "",
    });
  };

  const handleEditStatus = (order: Order) => {
    setEditingOrderForStatus(order);
  };

  const handleNewOrder = () => {
    setNewOrderForm({
      name: "",
      phone: "+231 00-0000000",
      propertyType: "Residential",
      amount: 1500000,
      address: "",
      status: "Pending",
    });
    setIsNewOrderOpen(true);
  };

  const submitNewOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderForm.name.trim()) {
      toast.error("Customer name is required.");
      return;
    }
    if (!newOrderForm.address.trim()) {
      toast.error("Address is required.");
      return;
    }

    const newOrder: Order = {
      id: `ORD-0${orders.length + 1}`,
      name: newOrderForm.name,
      avatar: `/assets/images/users/avatar-${(orders.length % 9) + 2}.jpg`,
      date: new Date().toLocaleDateString("en-GB"),
      phone: newOrderForm.phone,
      propertyType: newOrderForm.propertyType,
      amount: newOrderForm.amount,
      properties: newOrderForm.address,
      status: newOrderForm.status,
    };
    
    setOrders([newOrder, ...orders]);
    setIsNewOrderOpen(false);
    toast.success("New order created successfully.");
  };

  const submitStatusChange = (status: Order['status']) => {
    if (!editingOrderForStatus) return;
    setOrders(
      orders.map((o) =>
        o.id === editingOrderForStatus.id ? { ...o, status } : o
      )
    );
    setEditingOrderForStatus(null);
    toast.success(`Order status updated to ${status}.`);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <Breadcrumb />
          <h1 className="text-[20px] font-bold text-foreground">Orders</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Manage and track property orders and purchase requests
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
                className="bg-[#ff5b5b]/10 text-[#ff5b5b] hover:bg-[#ff5b5b] hover:text-white text-[13px] font-bold px-3 py-1.5 rounded-[5px] flex items-center gap-1.5 transition-all border border-[#ff5b5b]/20 cursor-pointer"
              >
                <i className="ri-trash-line text-[15px]" /> Delete Selected ({selectedRows.length})
              </button>
            )}
            <button
              onClick={handleExport}
              disabled={filteredOrders.length === 0}
              className="border border-border hover:bg-muted text-muted-foreground hover:text-foreground text-[13px] font-bold h-9 px-3 rounded-[5px] flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <i className="ri-download-2-line" /> Export
            </button>
            <button
              onClick={handleNewOrder}
              className="bg-[#0acf97] text-white text-[13px] font-bold px-3.5 py-1.5 rounded-[5px] flex items-center gap-1 hover:bg-[#09b986] transition-all cursor-pointer"
            >
              <i className="ri-add-line text-[15px]" /> New Order
            </button>
          </div>
        </div>
      </div>

      {/* ── Orders Table List ──────────────────────────────── */}
      {isLoading ? (
        <TableSkeleton rows={5} cols={9} />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="No Orders Found"
          description={
            searchTerm
              ? "There are no orders that match your search query. Try typing something else."
              : "No orders found in this status filter."
          }
          actionLabel={searchTerm ? "Clear Search" : "Create New Order"}
          onAction={() => {
            if (searchTerm) {
              setSearchTerm("");
            } else {
              handleNewOrder();
            }
          }}
        />
      ) : (
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
                {paginatedOrders.map((order) => {
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
                          <CustomerAvatar
                            src={order.avatar}
                            name={order.name}
                          />
                          <span className="font-semibold text-foreground">{order.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{order.date}</td>
                      <td className="px-5 py-3 text-muted-foreground font-medium">{order.phone}</td>
                      <td className="px-5 py-3 text-foreground font-semibold">
                        {order.propertyType}
                      </td>
                      <td className="px-5 py-3 text-foreground font-bold">
                        {formatPrice(order.amount)}
                      </td>
                      <td
                        className="px-5 py-3 text-muted-foreground max-w-[220px] truncate"
                        title={order.properties}
                      >
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
                            onClick={() => handleViewDetails(order)}
                            className="h-8 w-8 rounded bg-secondary hover:bg-secondary-foreground/10 text-secondary-foreground flex items-center justify-center transition-colors text-[16px] cursor-pointer"
                            title="View Details"
                          >
                            <i className="ri-eye-line text-[15px]" />
                          </button>
                          <button
                            onClick={() => handleEditStatus(order)}
                            className="h-8 w-8 rounded bg-soft-primary text-primary hover:bg-[#604ae3] hover:text-white flex items-center justify-center transition-all text-[16px] cursor-pointer"
                            title="Edit Status"
                          >
                            <i className="ri-edit-line text-[15px]" />
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
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

      {/* ── New Order Modal ────────────────────────────────────── */}
      {isNewOrderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-6">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsNewOrderOpen(false)} />
          
          {/* Modal Card */}
          <div className="relative w-full max-w-md bg-card border border-border rounded-lg shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 bg-muted/20 border-b border-border flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-foreground flex items-center gap-1.5">
                <ShoppingCart className="h-5 w-5 text-primary" /> Create New Order
              </h3>
              <button 
                type="button" 
                onClick={() => setIsNewOrderOpen(false)} 
                className="h-8 w-8 rounded-full bg-muted/40 hover:bg-muted text-muted-foreground flex items-center justify-center transition-all"
              >
                <i className="ri-close-line text-[18px]" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={submitNewOrder} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={newOrderForm.name}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, name: e.target.value })}
                  className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors font-medium"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Phone Contact
                  </label>
                  <input
                    type="text"
                    value={newOrderForm.phone}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, phone: e.target.value })}
                    className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors font-medium"
                    placeholder="+231 00-0000000"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Property Type
                  </label>
                  <select
                    value={newOrderForm.propertyType}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, propertyType: e.target.value })}
                    className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors font-medium cursor-pointer"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Amount ($) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newOrderForm.amount}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, amount: Number(e.target.value) })}
                    className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Initial Status
                  </label>
                  <select
                    value={newOrderForm.status}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, status: e.target.value as Order['status'] })}
                    className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors font-medium cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Property Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={newOrderForm.address}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, address: e.target.value })}
                  className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors font-medium resize-none"
                  placeholder="e.g. 123 Main St"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-border flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewOrderOpen(false)}
                  className="flex-1 border border-border text-muted-foreground hover:bg-muted font-bold py-2 rounded-[5px] text-[13.5px] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#0acf97] hover:bg-[#0acf97]/90 text-white font-bold py-2 rounded-[5px] text-[13.5px] transition-colors shadow-md"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Order Status Modal ──────────────────────────────── */}
      {editingOrderForStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setEditingOrderForStatus(null)} />
          
          {/* Modal Card */}
          <div className="relative w-full max-w-sm bg-card border border-border rounded-lg shadow-2xl p-6 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-[16px] font-bold text-foreground mb-4">Edit Order Status</h3>
            <p className="text-[13px] text-muted-foreground mb-4">
              Update the payment status for order <span className="font-bold text-foreground">{editingOrderForStatus.id}</span>:
            </p>
            
            <div className="flex flex-col gap-2">
              {(["Paid", "Pending", "Unpaid"] as Order['status'][]).map((st) => (
                <button
                  key={st}
                  onClick={() => submitStatusChange(st)}
                  className={`w-full py-2.5 rounded-lg text-[13.5px] font-bold border transition-all ${
                    editingOrderForStatus.status === st
                      ? st === "Paid"
                        ? "bg-success text-white border-success shadow-sm"
                        : st === "Pending"
                        ? "bg-warning text-white border-warning shadow-sm"
                        : "bg-danger text-white border-danger shadow-sm"
                      : "bg-card text-foreground border-border hover:bg-muted"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
            
            <div className="mt-5 pt-3 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={() => setEditingOrderForStatus(null)}
                className="text-[13px] font-bold text-muted-foreground hover:text-foreground px-4 py-2 hover:bg-muted rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
