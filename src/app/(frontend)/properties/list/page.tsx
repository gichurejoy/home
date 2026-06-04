"use client";

import { useState, useMemo } from "react";
import { properties as initialProperties, Property } from "@/data/mockProperties";
import Link from "next/link";

export default function PropertyList() {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Search filter
  const filteredProperties = useMemo(() => {
    return properties.filter((p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [properties, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProperties.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProperties, currentPage]);

  // Dropdown states
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Checkbox handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allDisplayedIds = paginatedProperties.map((p) => p.id);
      setSelectedIds([...new Set([...selectedIds, ...allDisplayedIds])]);
    } else {
      const allDisplayedIds = paginatedProperties.map((p) => p.id);
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

  // Delete handler
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this property?")) {
      setProperties(properties.filter((p) => p.id !== id));
      setSelectedIds(selectedIds.filter((item) => item !== id));
    }
  };

  const isAllSelectedOnPage = useMemo(() => {
    if (paginatedProperties.length === 0) return false;
    return paginatedProperties.every((p) => selectedIds.includes(p.id));
  }, [paginatedProperties, selectedIds]);

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-[20px] font-bold text-foreground">Listing List</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Real Estate Property Management</p>
        </div>
        <ol className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <li>
            <a href="/" className="hover:text-primary transition-colors">Real Estate</a>
          </li>
          <li><i className="ri-arrow-right-s-line text-[12px]" /></li>
          <li className="text-primary font-medium">Listing List</li>
        </ol>
      </div>

      {/* ── Metric Stat Cards (4 Columns) ─────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Card 1: Total Incomes */}
        <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-[13px] font-bold text-muted-foreground tracking-wide uppercase">Total Incomes</h4>
              <p className="text-[22px] font-bold text-foreground mt-1">$127,812.09</p>
            </div>
            <div className="h-12 w-12 rounded bg-[#604ae3]/10 flex items-center justify-center">
              <iconify-icon icon="solar:wallet-money-broken" className="text-[28px] text-[#604ae3]" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 text-[12.5px]">
            <p className="text-muted-foreground">
              <span className="text-[#0acf97] font-bold flex items-center gap-0.5 inline-flex align-bottom">
                <i className="ri-arrow-up-line text-[14px]" />34.4%
              </span>{" "}
              vs last month
            </p>
            <a href="#!" className="text-[#604ae3] font-semibold hover:underline">See Details &rarr;</a>
          </div>
        </div>

        {/* Card 2: Total Properties */}
        <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-[13px] font-bold text-muted-foreground tracking-wide uppercase">Total Properties</h4>
              <p className="text-[22px] font-bold text-foreground mt-1">15,780 Unit</p>
            </div>
            <div className="h-12 w-12 rounded bg-[#604ae3]/10 flex items-center justify-center">
              <iconify-icon icon="solar:home-broken" className="text-[28px] text-[#604ae3]" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 text-[12.5px]">
            <p className="text-muted-foreground">
              <span className="text-[#ff5b5b] font-bold flex items-center gap-0.5 inline-flex align-bottom">
                <i className="ri-arrow-down-line text-[14px]" />8.5%
              </span>{" "}
              vs last month
            </p>
            <a href="#!" className="text-[#604ae3] font-semibold hover:underline">See Details &rarr;</a>
          </div>
        </div>

        {/* Card 3: Unit Sold */}
        <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-[13px] font-bold text-muted-foreground tracking-wide uppercase">Unit Sold</h4>
              <p className="text-[22px] font-bold text-foreground mt-1">893 Unit</p>
            </div>
            <div className="h-12 w-12 rounded bg-[#604ae3]/10 flex items-center justify-center">
              <iconify-icon icon="solar:dollar-broken" className="text-[28px] text-[#604ae3]" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 text-[12.5px]">
            <p className="text-muted-foreground">
              <span className="text-[#0acf97] font-bold flex items-center gap-0.5 inline-flex align-bottom">
                <i className="ri-arrow-up-line text-[14px]" />17%
              </span>{" "}
              vs last month
            </p>
            <a href="#!" className="text-[#604ae3] font-semibold hover:underline">See Details &rarr;</a>
          </div>
        </div>

        {/* Card 4: Unit Rent */}
        <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-[13px] font-bold text-muted-foreground tracking-wide uppercase">Unit Rent</h4>
              <p className="text-[22px] font-bold text-foreground mt-1">459 Unit</p>
            </div>
            <div className="h-12 w-12 rounded bg-[#604ae3]/10 flex items-center justify-center">
              <iconify-icon icon="solar:key-minimalistic-square-broken" className="text-[28px] text-[#604ae3]" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 text-[12.5px]">
            <p className="text-muted-foreground">
              <span className="text-[#ff5b5b] font-bold flex items-center gap-0.5 inline-flex align-bottom">
                <i className="ri-arrow-down-line text-[14px]" />12%
              </span>{" "}
              vs last month
            </p>
            <a href="#!" className="text-[#604ae3] font-semibold hover:underline">See Details &rarr;</a>
          </div>
        </div>

      </div>

      {/* ── Table List Section ─────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-[8px] shadow-[0_0_35px_rgba(154,161,171,0.05)]">
        
        {/* Table Header Controls */}
        <div className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border">
          <div>
            <h4 className="text-[15.5px] font-bold text-foreground">All Properties List</h4>
            <p className="text-[12.5px] text-muted-foreground mt-0.5">Show {filteredProperties.length} Properties</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] pl-8 pr-3 py-1.5 outline-none focus:border-[#604ae3] transition-colors placeholder:text-muted-foreground/60"
              />
              <i className="ri-search-line absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/80 text-[14px]" />
            </div>

            {/* Dropdown Options */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground border border-border bg-muted/20 hover:bg-muted/40 px-3 py-1.5 rounded-[5px] transition-all"
              >
                This Month <i className="ri-arrow-down-s-line text-[14px]" />
              </button>
              {isExportOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-card border border-border rounded-[5px] shadow-lg py-1 z-15">
                  <a href="#!" className="block px-3 py-1.5 text-[12.5px] text-foreground hover:bg-muted">Download</a>
                  <a href="#!" className="block px-3 py-1.5 text-[12.5px] text-foreground hover:bg-muted">Export</a>
                  <a href="#!" className="block px-3 py-1.5 text-[12.5px] text-foreground hover:bg-muted">Import</a>
                </div>
              )}
            </div>

            {/* Add Property Button */}
            <Link
              href="/properties/add"
              className="bg-[#604ae3] text-white text-[13px] font-bold px-3.5 py-1.5 rounded-[5px] flex items-center gap-1 hover:bg-[#503bc7] transition-all"
            >
              <i className="ri-add-line text-[15px]" /> Add Property
            </Link>

          </div>
        </div>

        {/* Responsive Table */}
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
                <th className="py-3 px-4 min-w-[280px]">Properties Photo & Name</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Property Type</th>
                <th className="py-3 px-4">Rent/Sale</th>
                <th className="py-3 px-4">Bedrooms</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-[13.5px]">
              {paginatedProperties.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-muted-foreground">
                    No properties match your search term.
                  </td>
                </tr>
              ) : (
                paginatedProperties.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  const isRent = p.status === "For Rent";
                  const isSale = p.status === "For Sale";
                  const isSold = p.status === "Sold";
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-muted/10 transition-colors ${
                        isSelected ? "bg-muted/10" : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectOne(p.id, e.target.checked)}
                          className="rounded border-border text-primary focus:ring-primary h-4 w-4 bg-muted/20 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="h-[52px] w-[52px] min-w-[52px] object-cover rounded border-[3px] border-card shadow-sm"
                          />
                          <Link href={`/properties/${p.id}`} className="font-bold text-foreground hover:text-[#604ae3] transition-colors leading-tight">
                            {p.title}
                          </Link>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground font-medium">{p.area}ft</td>
                      <td className="py-3 px-4 text-muted-foreground font-medium">{p.type}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[12px] font-bold px-2 py-0.5 rounded ${
                          isRent ? "bg-[#0acf97]/15 text-[#0acf97]" :
                          isSale ? "bg-[#f9bc0b]/15 text-[#f9bc0b]" :
                          "bg-[#ff5b5b]/15 text-[#ff5b5b]"
                        }`}>
                          {isRent ? "Rent" : isSale ? "Sale" : "Sold"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground font-medium">
                        <span className="flex items-center gap-1">
                          <iconify-icon icon="solar:bed-broken" className="text-[16px] text-primary" /> {p.bedrooms}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground font-medium">{p.location.split(",").pop()?.trim()}</td>
                      <td className="py-3 px-4 font-bold text-foreground">
                        ${p.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/properties/${p.id}`} className="h-7 w-7 rounded bg-muted hover:bg-muted-foreground/10 text-foreground flex items-center justify-center transition-all" title="View">
                            <iconify-icon icon="solar:eye-broken" className="text-[16px]" />
                          </Link>
                          <Link href="/properties/add" className="h-7 w-7 rounded bg-[#604ae3]/10 hover:bg-[#604ae3] text-[#604ae3] hover:text-white flex items-center justify-center transition-all" title="Edit">
                            <iconify-icon icon="solar:pen-2-broken" className="text-[16px]" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id)}
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
        {filteredProperties.length > 0 && (
          <div className="p-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[13px] text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="font-semibold text-foreground">
                {Math.min(currentPage * itemsPerPage, filteredProperties.length)}
              </span>{" "}
              of <span className="font-semibold text-foreground">{filteredProperties.length}</span> properties
            </p>
            <nav className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
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
                    onClick={() => setCurrentPage(pageNum)}
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
                onClick={() => setCurrentPage(currentPage + 1)}
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
