"use client";

import { useState, useMemo } from "react";
import { customers as initialCustomers, Customer } from "@/data/mockCustomers";
import Link from "next/link";

export default function CustomerGrid() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Dropdown states for each customer card
  const [activeDropdownCard, setActiveDropdownCard] = useState<string | null>(null);

  // Search and filter logic
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedStatus === "All" || customer.status === selectedStatus;
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

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      setCustomers(customers.filter((c) => c.id !== id));
      setActiveDropdownCard(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-[20px] font-bold text-foreground">Customer Grid</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Real Estate Customers Directory View</p>
        </div>
        <ol className="flex items-center text-[13px] text-muted-foreground">
          <li>
            <a href="/" className="hover:text-primary transition-colors">Customers</a>
          </li>
          <li className="mx-1 text-muted-foreground/60">&rsaquo;</li>
          <li className="text-primary font-medium">Customer Grid</li>
        </ol>
      </div>

      {/* ── Search & Filter Panel ─────────────────────────────────── */}
      <div className="bg-card border border-border rounded-[8px] p-4 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-2xl">
            {/* Search Input */}
            <div className="position-relative flex-1">
              <input
                type="search"
                className="w-full bg-background border border-border rounded-[5px] pl-9 pr-4 py-1.5 text-[13px] focus:outline-none focus:border-primary transition-colors text-foreground placeholder-muted-foreground"
                placeholder="Search Customers..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[15px]" />
            </div>

            {/* Status Select Filter */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[13px] text-muted-foreground font-semibold">Status:</span>
              <div className="inline-flex rounded-[5px] bg-background border border-border p-0.5">
                {["All", "Available", "Unavailable"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setSelectedStatus(status);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1 rounded-[4px] text-[12px] font-bold transition-all ${
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

          <div className="flex gap-2">
            <Link
              href="/customers/list"
              className="border border-border hover:bg-muted text-muted-foreground hover:text-foreground h-9 w-9 rounded-[5px] flex items-center justify-center transition-colors text-[16px]"
              title="List View"
            >
              <i className="ri-list-check" />
            </Link>
            <Link
              href="/customers/add"
              className="bg-[#604ae3] text-white text-[13px] font-bold px-3.5 py-1.5 rounded-[5px] flex items-center gap-1 hover:bg-[#503bc7] transition-all"
            >
              <i className="ri-add-line text-[15px]" /> New Customer
            </Link>
          </div>
        </div>
      </div>

      {/* ── Customers Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginatedCustomers.length === 0 ? (
          <div className="col-span-full py-16 text-center text-muted-foreground">
            No customers found matching your query.
          </div>
        ) : (
          paginatedCustomers.map((customer) => {
            const isDropdownActive = activeDropdownCard === customer.id;
            return (
              <div
                key={customer.id}
                className="bg-card border border-border rounded-[8px] overflow-hidden shadow-[0_0_35px_rgba(154,161,171,0.05)] hover:shadow-md transition-all duration-300 relative flex flex-col justify-between"
              >
                {/* Top Banner (custom gradient) */}
                <div className="h-24 w-full bg-gradient-to-r from-[#604ae3]/10 to-[#604ae3]/25 position-relative">
                  {/* Pen overlay edit button */}
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      onClick={() => setActiveDropdownCard(isDropdownActive ? null : customer.id)}
                      className="h-8 w-8 rounded bg-background/80 dark:bg-[#1b2332]/80 hover:bg-background text-foreground flex items-center justify-center shadow-sm transition-colors text-[16px]"
                    >
                      <iconify-icon icon="solar:pen-new-square-broken" className="text-foreground text-[18px]" />
                    </button>
                    {isDropdownActive && (
                      <div className="absolute right-0 mt-1 w-32 bg-card border border-border rounded-[5px] shadow-lg py-1 z-20 text-[12px] text-foreground text-left">
                        <Link href={`/customers/${customer.id}`} className="block px-3 py-1.5 hover:bg-muted font-semibold">
                          View Details
                        </Link>
                        <Link href="/customers/add" className="block px-3 py-1.5 hover:bg-muted font-semibold">
                          Edit Profile
                        </Link>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="w-full text-left text-[#ff5b5b] block px-3 py-1.5 hover:bg-[#ff5b5b]/10 font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Overlapping Avatar */}
                <div className="absolute left-6 top-10">
                  <img
                    src={customer.avatar}
                    alt={customer.name}
                    className="w-[72px] h-[72px] border-[3px] border-card rounded-full object-cover shadow-sm bg-card"
                  />
                </div>

                {/* Card Main Body */}
                <div className="mt-10 pt-2 px-6 pb-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Title and Badge row */}
                    <div className="flex items-center justify-between mb-3.5 gap-2">
                      <Link
                        href={`/customers/${customer.id}`}
                        className="text-foreground hover:text-[#604ae3] font-bold text-[17px] leading-snug truncate transition-colors"
                      >
                        {customer.name}
                      </Link>
                      <span
                        className={`px-2 py-0.5 rounded-[4px] text-[11px] font-bold tracking-wide uppercase shrink-0 ${
                          customer.status === "Available"
                            ? "bg-success/15 text-success"
                            : "bg-danger/15 text-danger"
                        }`}
                      >
                        {customer.status}
                      </span>
                    </div>

                    {/* Contacts info list */}
                    <div className="space-y-1.5 text-[13.5px] text-muted-foreground pb-4 border-b border-border">
                      <p className="truncate">
                        <span className="text-foreground font-semibold">Email Address : </span>
                        {customer.email}
                      </p>
                      <p className="truncate">
                        <span className="text-foreground font-semibold">Contact Number : </span>
                        {customer.phone}
                      </p>
                      <p className="truncate">
                        <span className="text-foreground font-semibold">Address : </span>
                        {customer.location}
                      </p>
                    </div>

                    {/* Property counts grid row */}
                    <div className="grid grid-cols-3 gap-2 py-4 border-b border-border text-center">
                      <div>
                        <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                          View Property
                        </p>
                        <h5 className="text-[15px] font-bold text-foreground">
                          {customer.viewPropertiesCount}
                        </h5>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                          Own Property
                        </p>
                        <h5 className="text-[15px] font-bold text-foreground">
                          {customer.ownPropertiesCount}
                        </h5>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                          Invested
                        </p>
                        <h5 className="text-[15px] font-bold text-foreground">
                          ${customer.investOnProperty.toLocaleString()}
                        </h5>
                      </div>
                    </div>

                    {/* Social networks links */}
                    <div className="py-4">
                      <h6 className="text-[12.5px] font-bold text-foreground mb-2.5">Social Information :</h6>
                      <div className="flex gap-1.5">
                        {customer.socials.facebook && (
                          <a
                            href={customer.socials.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-8 w-8 rounded bg-soft-primary text-primary hover:bg-[#604ae3] hover:text-white flex items-center justify-center text-[16px] transition-all"
                          >
                            <i className="ri-facebook-fill" />
                          </a>
                        )}
                        {customer.socials.instagram && (
                          <a
                            href={customer.socials.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-8 w-8 rounded bg-soft-danger text-danger hover:bg-[#ff5b5b] hover:text-white flex items-center justify-center text-[16px] transition-all"
                          >
                            <i className="ri-instagram-line" />
                          </a>
                        )}
                        {customer.socials.twitter && (
                          <a
                            href={customer.socials.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-8 w-8 rounded bg-soft-info text-info hover:bg-[#39afd1] hover:text-white flex items-center justify-center text-[16px] transition-all"
                          >
                            <i className="ri-twitter-line" />
                          </a>
                        )}
                        {customer.socials.whatsapp && (
                          <a
                            href={customer.socials.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-8 w-8 rounded bg-soft-success text-success hover:bg-[#0acf97] hover:text-white flex items-center justify-center text-[16px] transition-all"
                          >
                            <i className="ri-whatsapp-line" />
                          </a>
                        )}
                        {customer.socials.email && (
                          <a
                            href={`mailto:${customer.socials.email}`}
                            className="h-8 w-8 rounded bg-soft-warning text-warning hover:bg-[#f1b53d] hover:text-white flex items-center justify-center text-[16px] transition-all"
                          >
                            <i className="ri-mail-line" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons footer */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-dashed border-border mt-2">
                    <a
                      href="#!"
                      className="bg-[#604ae3] text-white text-[12.5px] font-bold py-2 px-3 rounded-[5px] flex items-center justify-center gap-1.5 hover:bg-[#503bc7] active:scale-[0.98] transition-all text-center"
                    >
                      <iconify-icon icon="solar:chat-round-dots-broken" className="text-[17px] align-middle" />
                      Open Chat
                    </a>
                    <a
                      href={`tel:${customer.phone}`}
                      className="bg-secondary hover:bg-secondary-foreground/10 text-secondary-foreground text-[12.5px] font-bold py-2 px-3 rounded-[5px] flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all text-center border border-border"
                    >
                      <iconify-icon icon="solar:outgoing-call-rounded-broken" className="text-[17px] align-middle" />
                      Call Customer
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Pagination Footer ────────────────────────────────────────── */}
      {filteredCustomers.length > 0 && (
        <div className="bg-card border border-border rounded-[8px] p-4 shadow-[0_0_35px_rgba(154,161,171,0.05)] flex flex-col sm:flex-row items-center justify-between gap-4">
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
  );
}
