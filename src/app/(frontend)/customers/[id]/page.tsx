"use client";

import { use } from "react";
import { customers } from "@/data/mockCustomers";
import { notFound } from "next/navigation";
import Link from "next/link";
import CustomerCarousel from "./CustomerCarousel";
import { WeeklyInquiryChart, OwnPropertyChart } from "./CustomerDetailCharts";
import { EntityNotesCard } from "@/components/ui/EntityNotesCard";
import { DocumentManager } from "@/components/ui/DocumentManager";

export default function CustomerDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  // Resolve customer by ID
  const customer = customers.find((c) => {
    const idLower = resolvedParams.id.toLowerCase();
    const cIdLower = c.id.toLowerCase();
    if (cIdLower === idLower) return true;
    const numericPart = cIdLower.replace("cust-", "").replace(/^0+/, "");
    if (numericPart === idLower.replace(/^0+/, "")) return true;
    return false;
  });

  if (!customer) {
    notFound();
  }

  // Predefined property images for the slider
  const sliderImages = [
    "/assets/images/properties/p-11.jpg",
    "/assets/images/properties/p-12.jpg",
    "/assets/images/properties/p-10.jpg",
    "/assets/images/properties/p-9.jpg"
  ];

  // Predefined Mock interested property card data
  const interestedPropertiesMock = [
    {
      title: "Dvilla Residences Batu",
      address: "4604 Philli Lane Kiowa",
      beds: 5,
      baths: 4,
      area: "1400ft",
      floors: 3,
      image: "/assets/images/properties/p-1.jpg"
    },
    {
      title: "Tungis Luxury",
      address: "900 Creside WI 54913",
      beds: 4,
      baths: 3,
      area: "1200ft",
      floors: 2,
      image: "/assets/images/properties/p-3.jpg"
    },
    {
      title: "Dvilla Deluxe",
      address: "301 Spruce Rd",
      beds: 7,
      baths: 6,
      area: "2000ft",
      floors: 1,
      image: "/assets/images/properties/p-6.jpg"
    }
  ];

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-[20px] font-bold text-foreground">Customer Overview</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Profile overview of {customer.name}</p>
        </div>
        <ol className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <li>
            <a href="/" className="hover:text-primary transition-colors">Customers</a>
          </li>
          <li><i className="ri-arrow-right-s-line text-[12px]" /></li>
          <li>
            <Link href="/customers/grid" className="hover:text-primary transition-colors">Directory</Link>
          </li>
          <li><i className="ri-arrow-right-s-line text-[12px]" /></li>
          <li className="text-primary font-medium">Customer Overview</li>
        </ol>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ── Left Column: Profile Card, Progress Metrics, Listings ── */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Property Image Slider */}
          <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
            <CustomerCarousel images={sliderImages} />

            {/* Profile Avatar and Name */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6 pb-4 border-b border-border">
              <img
                src={customer.avatar}
                alt={customer.name}
                className="w-20 h-20 rounded-full border-[3px] border-card img-thumbnail object-cover shadow-sm bg-card shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-[20px] font-bold text-foreground leading-snug">{customer.name}</h3>
                <a href="#!" className="text-[#604ae3] font-semibold text-[13.5px] hover:underline block mt-0.5">
                  {customer.name.toLowerCase().replace(/\s+/g, "")}.us
                </a>
              </div>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <a
                  href={`mailto:${customer.email}`}
                  className="bg-[#604ae3] text-white text-[12.5px] font-bold py-2 px-4.5 rounded-[5px] flex items-center gap-1.5 hover:bg-[#503bc7] active:scale-[0.98] transition-all shadow-sm"
                >
                  <iconify-icon icon="solar:chat-round-dots-broken" className="text-[17px] align-middle" />
                  Chat Us
                </a>
                <a
                  href={`tel:${customer.phone}`}
                  className="bg-card border border-border text-foreground text-[12.5px] font-bold py-2 px-4.5 rounded-[5px] flex items-center gap-1.5 hover:bg-muted active:scale-[0.98] transition-all"
                >
                  <iconify-icon icon="solar:outgoing-call-rounded-broken" className="text-[17px] align-middle" />
                  Phone
                </a>
                <button
                  className="h-9 w-9 rounded-[5px] border border-border hover:bg-muted text-[17px] flex items-center justify-center transition-colors"
                  title="Edit Customer"
                >
                  <i className="ri-edit-fill text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            </div>

            {/* Contact details rows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-5 border-b border-border text-[13.5px]">
              <div>
                <p className="text-muted-foreground font-semibold mb-1">Email Address :</p>
                <p className="font-bold text-foreground truncate">{customer.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground font-semibold mb-1">Phone Number :</p>
                <p className="font-bold text-foreground">{customer.phone}</p>
              </div>
              <div>
                <p className="text-muted-foreground font-semibold mb-1">Location :</p>
                <p className="font-bold text-foreground truncate" title={customer.location}>{customer.location}</p>
              </div>
              <div>
                <p className="text-muted-foreground font-semibold mb-1">Status :</p>
                <p>
                  <span
                    className={`px-2.5 py-0.5 rounded-[4px] text-[11px] font-bold uppercase tracking-wider ${
                      customer.status === "Available"
                        ? "bg-success/15 text-success"
                        : "bg-danger/15 text-danger"
                    }`}
                  >
                    {customer.status}
                  </span>
                </p>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-5 text-[13.5px]">
              <div className="md:col-span-4">
                <h4 className="font-bold text-foreground text-[14.5px] mb-2.5">Social Media :</h4>
                <div className="flex gap-1.5">
                  {customer.socials.facebook && (
                    <a
                      href={customer.socials.facebook}
                      className="h-8 w-8 rounded bg-soft-primary text-primary hover:bg-[#604ae3] hover:text-white flex items-center justify-center text-[16px] transition-all"
                    >
                      <i className="ri-facebook-fill" />
                    </a>
                  )}
                  {customer.socials.instagram && (
                    <a
                      href={customer.socials.instagram}
                      className="h-8 w-8 rounded bg-soft-danger text-danger hover:bg-[#ff5b5b] hover:text-white flex items-center justify-center text-[16px] transition-all"
                    >
                      <i className="ri-instagram-line" />
                    </a>
                  )}
                  {customer.socials.twitter && (
                    <a
                      href={customer.socials.twitter}
                      className="h-8 w-8 rounded bg-soft-info text-info hover:bg-[#39afd1] hover:text-white flex items-center justify-center text-[16px] transition-all"
                    >
                      <i className="ri-twitter-line" />
                    </a>
                  )}
                  {customer.socials.whatsapp && (
                    <a
                      href={customer.socials.whatsapp}
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
              <div className="md:col-span-8">
                <h4 className="font-bold text-foreground text-[14.5px] mb-2">Preferences :</h4>
                <p className="text-muted-foreground flex items-start gap-1.5 leading-snug">
                  <i className="ri-circle-fill text-success text-[10px] mt-1 shrink-0" />
                  <span>{customer.preferences.bedsBaths}</span>
                </p>
                <p className="text-muted-foreground flex items-start gap-1.5 mt-1.5 leading-snug">
                  <i className="ri-circle-fill text-success text-[10px] mt-1 shrink-0" />
                  <span>{customer.preferences.others}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Metric cards with progress bars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Active Property */}
            <div className="bg-card border border-border rounded-[8px] p-4.5 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
              <div className="flex gap-3 align-items-center">
                <div className="h-11 w-11 bg-success/10 rounded-lg flex items-center justify-center shrink-0">
                  <iconify-icon icon="solar:home-2-bold" className="text-success text-[24px]" />
                </div>
                <div>
                  <p className="text-foreground font-bold text-[14px] leading-snug">Active Property</p>
                  <p className="text-muted-foreground text-[12px] mt-0.5">{customer.activePropertiesCount} Property Active</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-5">
                <p className="text-[12.5px] text-muted-foreground font-semibold">View Property</p>
                <p className="text-[13px] font-bold text-foreground">{customer.viewPropertiesCount}</p>
              </div>
              <div className="w-full bg-muted dark:bg-[#252d3c] h-2.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-success h-full progress-bar-striped progress-bar-animated rounded-full"
                  style={{ width: "65%" }}
                />
              </div>
            </div>

            {/* Card 2: View Property */}
            <div className="bg-card border border-border rounded-[8px] p-4.5 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
              <div className="flex gap-3 align-items-center">
                <div className="h-11 w-11 bg-warning/10 rounded-lg flex items-center justify-center shrink-0">
                  <iconify-icon icon="solar:home-bold" className="text-warning text-[24px]" />
                </div>
                <div>
                  <p className="text-foreground font-bold text-[14px] leading-snug">View Property</p>
                  <p className="text-muted-foreground text-[12px] mt-0.5">{customer.viewPropertiesCount} Property View</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-5">
                <p className="text-[12.5px] text-muted-foreground font-semibold">Own Property</p>
                <p className="text-[13px] font-bold text-foreground">{customer.ownPropertiesCount}</p>
              </div>
              <div className="w-full bg-muted dark:bg-[#252d3c] h-2.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-warning h-full progress-bar-striped progress-bar-animated rounded-full"
                  style={{ width: "25%" }}
                />
              </div>
            </div>

            {/* Card 3: Own Property */}
            <div className="bg-card border border-border rounded-[8px] p-4.5 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
              <div className="flex gap-3 align-items-center">
                <div className="h-11 w-11 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <iconify-icon icon="solar:money-bag-bold" className="text-primary text-[24px]" />
                </div>
                <div>
                  <p className="text-foreground font-bold text-[14px] leading-snug">Own Property</p>
                  <p className="text-muted-foreground text-[12px] mt-0.5">{customer.ownPropertiesCount} Property Own</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-5">
                <p className="text-[12.5px] text-muted-foreground font-semibold">Invest On Property</p>
                <p className="text-[13px] font-bold text-foreground">${customer.investOnProperty.toLocaleString()}</p>
              </div>
              <div className="w-full bg-muted dark:bg-[#252d3c] h-2.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-primary h-full progress-bar-striped progress-bar-animated rounded-full"
                  style={{ width: "80%" }}
                />
              </div>
            </div>

          </div>

          {/* Interested properties title and list */}
          <div className="space-y-4">
            <h4 className="font-bold text-[15.5px] text-foreground">Interested Properties ({interestedPropertiesMock.length})</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {interestedPropertiesMock.map((prop, idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border rounded-[8px] overflow-hidden shadow-[0_0_35px_rgba(154,161,171,0.05)] hover:shadow-md transition-shadow duration-300 relative flex flex-col justify-between"
                >
                  <div className="relative">
                    <img
                      src={prop.image}
                      alt={prop.title}
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <button
                        className="h-8 w-8 rounded bg-warning text-white flex items-center justify-center shadow-sm text-[16px] active:scale-95 transition-all"
                        title="Bookmark"
                      >
                        <iconify-icon icon="solar:bookmark-broken" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start gap-2.5 mb-2.5">
                        <div className="h-8 w-8 rounded bg-[#604ae3]/10 text-[#604ae3] flex items-center justify-center shrink-0">
                          <iconify-icon icon="solar:home-bold-duotone" className="text-[18px]" />
                        </div>
                        <div className="min-w-0">
                          <a href="#!" className="font-bold text-[14px] text-foreground hover:text-[#604ae3] transition-colors truncate block">{prop.title}</a>
                          <p className="text-[11.5px] text-muted-foreground mt-0.5 truncate leading-snug" title={prop.address}>{prop.address}</p>
                        </div>
                      </div>

                      {/* Info badges specs */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        <span className="badge border border-border bg-muted/20 text-muted-foreground text-[11.5px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                          <iconify-icon icon="solar:bed-broken" className="text-[13px] align-middle" />
                          {prop.beds} Beds
                        </span>
                        <span className="badge border border-border bg-muted/20 text-muted-foreground text-[11.5px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                          <iconify-icon icon="solar:bath-broken" className="text-[13px] align-middle" />
                          {prop.baths} Bath
                        </span>
                        <span className="badge border border-border bg-muted/20 text-muted-foreground text-[11.5px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                          <iconify-icon icon="solar:scale-broken" className="text-[13px] align-middle" />
                          {prop.area}
                        </span>
                        <span className="badge border border-border bg-muted/20 text-muted-foreground text-[11.5px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                          <iconify-icon icon="solar:double-alt-arrow-up-broken" className="text-[13px] align-middle" />
                          {prop.floors} Floor
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Right Column: Charts, Credit Card, Transactions ── */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Weekly inquiry bar chart */}
          <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <h4 className="font-bold text-[14.5px] text-foreground">Weekly Inquiry</h4>
              <div className="dropdown">
                <button
                  onClick={() => alert("Interval select placeholder")}
                  className="btn btn-sm border border-border hover:bg-muted text-[11.5px] font-bold px-2.5 py-1 rounded"
                >
                  This Month <i className="ri-arrow-down-s-line" />
                </button>
              </div>
            </div>
            <div className="w-full">
              <WeeklyInquiryChart />
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-border mt-3 text-[13px]">
              <p className="text-muted-foreground font-medium">Jan-Dec 2023</p>
              <p className="text-foreground font-bold">First Week 37</p>
            </div>
          </div>

          {/* Credit Card and transaction list */}
          <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
            <h4 className="font-bold text-[14.5px] text-foreground border-b border-border pb-3 mb-4">Transactions</h4>
            
            {/* Debit Credit Card Graphic */}
            <div className="bg-gradient-to-br from-[#604ae3] via-[#7360e2] to-[#8d7df7] rounded-xl p-5 text-white relative shadow-sm overflow-hidden select-none">
              <div className="flex items-center justify-between">
                {/* Vector SIM Chip */}
                <svg width="34" height="26" viewBox="0 0 38 30" fill="none" className="opacity-90">
                  <rect width="38" height="30" rx="5" fill="#e2ba5e" />
                  <path d="M0 10H14V20H0V10Z" stroke="#252d3c" strokeWidth="1.2" />
                  <path d="M24 10H38V20H24V10Z" stroke="#252d3c" strokeWidth="1.2" />
                  <path d="M14 0V30" stroke="#252d3c" strokeWidth="1.2" />
                  <path d="M24 0V30" stroke="#252d3c" strokeWidth="1.2" />
                  <path d="M14 10H24V20H14V10Z" fill="#c39d3c" stroke="#252d3c" strokeWidth="1.2" />
                </svg>

                {/* Mastercard Logo SVG */}
                <svg width="36" height="22" viewBox="0 0 40 24" fill="none" className="opacity-90">
                  <circle cx="12" cy="12" r="12" fill="#EB001B" fillOpacity="0.9" />
                  <circle cx="28" cy="12" r="12" fill="#F9A000" fillOpacity="0.9" />
                </svg>
              </div>

              <div className="mt-8">
                <h4 className="text-[18px] md:text-[20px] font-bold tracking-widest flex gap-3 text-white">
                  <span className="text-white/60">••••</span>
                  <span className="text-white/60">••••</span>
                  <span className="text-white/60">••••</span>
                  <span>3467</span>
                </h4>
              </div>

              <div className="flex items-center justify-between mt-6">
                <div>
                  <p className="text-white/65 text-[10px] uppercase font-bold tracking-wider">Holder Name</p>
                  <h4 className="text-[13.5px] font-bold text-white mt-0.5">Ray C. Nichols</h4>
                </div>
                <div>
                  <p className="text-white/65 text-[10px] uppercase font-bold tracking-wider">Valid</p>
                  <h4 className="text-[13.5px] font-bold text-white mt-0.5">05/26</h4>
                </div>
                {/* Contactless payment SVG */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-75 text-white">
                  <path d="M5 18a10 10 0 0 1 0-12M9 15.5a6.5 6.5 0 0 1 0-7M13 13a3 3 0 0 1 0-2M17 12a0.5 0 0 1 0 0" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* List of short transactions */}
            <div className="mt-5 space-y-4">
              {customer.transactions.length === 0 ? (
                <p className="text-[13px] text-muted-foreground text-center py-4">No recent card payments.</p>
              ) : (
                customer.transactions.map((txn, index) => (
                  <div key={txn.id} className={`flex items-center gap-3 ${index < customer.transactions.length - 1 ? "border-b border-border pb-3" : ""}`}>
                    <div className="h-9 w-9 bg-primary/10 rounded flex items-center justify-center shrink-0">
                      <iconify-icon icon="solar:square-transfer-horizontal-bold" className="text-primary text-[20px]" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[13px] text-foreground leading-snug">{txn.name}</p>
                      <p className="text-[11.5px] text-muted-foreground truncate leading-snug mt-0.5">{txn.email}</p>
                    </div>
                    <div className="ms-auto text-right">
                      <p className="font-bold text-[13.5px] text-foreground flex items-center justify-end gap-0.5">
                        ${txn.amount.toLocaleString()}
                        <i className="ri-checkbox-circle-line text-success text-[14px]" />
                      </p>
                      <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">{txn.id}</p>
                    </div>
                  </div>
                ))
              )}
              {customer.transactions.length > 0 && (
                <div className="pt-2">
                  <a href="#!" className="text-[#604ae3] hover:underline font-bold text-[12.5px]">View More Payments</a>
                </div>
              )}
            </div>
          </div>

          {/* Own Property Portfolio breakdowns and Radial donut chart */}
          <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
            <h4 className="font-bold text-[14.5px] text-foreground border-b border-border pb-3 mb-4">Own Property Portfolio</h4>
            <div className="w-full">
              <OwnPropertyChart />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-5 pt-3 border-t border-border">
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-danger/10 text-danger rounded flex items-center justify-center shrink-0">
                  <i className="ri-arrow-up-line text-[16px] font-bold" />
                </div>
                <div>
                  <h4 className="font-bold text-[14px] text-foreground">${customer.investOnProperty.toLocaleString()}</h4>
                  <p className="text-[11px] text-muted-foreground font-semibold mt-0.5 leading-tight">Total Portfolio Investment</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-success/10 text-success rounded flex items-center justify-center shrink-0">
                  <i className="ri-arrow-down-line text-[16px] font-bold" />
                </div>
                <div>
                  <h4 className="font-bold text-[14px] text-foreground">$613,321</h4>
                  <p className="text-[11px] text-muted-foreground font-semibold mt-0.5 leading-tight">Estimated Portfolio Value</p>
                </div>
              </div>
            </div>
          </div>

          <EntityNotesCard entityId={customer.id} />
          <DocumentManager entityId={customer.id} />
        </div>

      </div>

      {/* ── Transaction History Table Bottom ─────────────────────── */}
      <div className="bg-card border border-border rounded-[8px] shadow-[0_0_35px_rgba(154,161,171,0.05)] overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h4 className="font-bold text-[15.5px] text-foreground">Transaction History</h4>
          <div className="dropdown">
            <button
              onClick={() => alert("Actions menu")}
              className="btn btn-sm border border-border hover:bg-muted text-muted-foreground hover:text-foreground rounded px-3.5 py-1.5 text-[12px] font-bold flex items-center gap-1.5"
            >
              This Month <i className="ri-arrow-down-s-line" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse align-middle text-nowrap">
            <thead className="bg-[#f8f9fa] dark:bg-[#1f293d] border-b border-border text-[12px] text-muted-foreground font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5 w-10">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-border text-[#604ae3] focus:ring-[#604ae3] h-4 w-4"
                    />
                  </div>
                </th>
                <th className="px-5 py-3.5">Order ID</th>
                <th className="px-5 py-3.5">Transaction Date</th>
                <th className="px-5 py-3.5">Property Type</th>
                <th className="px-5 py-3.5">Properties Address</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Agent Name</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-[13.5px] divide-y divide-border text-foreground">
              {customer.transactionHistory.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-muted-foreground">
                    No order transactions recorded for this customer yet.
                  </td>
                </tr>
              ) : (
                customer.transactionHistory.map((history) => (
                  <tr key={history.orderId} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-border text-[#604ae3] focus:ring-[#604ae3] h-4 w-4"
                        />
                      </div>
                    </td>
                    <td className="px-5 py-3 font-semibold text-foreground">{history.orderId}</td>
                    <td className="px-5 py-3 text-muted-foreground">{history.date}</td>
                    <td className="px-5 py-3 text-foreground font-semibold">{history.propertyType}</td>
                    <td className="px-5 py-3 text-muted-foreground max-w-[200px] truncate" title={history.address}>
                      {history.address}
                    </td>
                    <td className="px-5 py-3 font-bold text-foreground">
                      ${history.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-[4px] bg-success/15 text-success text-[11px] font-bold">
                        {history.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground font-medium">{history.agentName}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a href="#!" className="h-8 w-8 rounded bg-secondary hover:bg-secondary-foreground/10 text-secondary-foreground flex items-center justify-center transition-colors text-[16px]" title="View Invoice">
                          <iconify-icon icon="solar:eye-broken" />
                        </a>
                        <a href="#!" className="h-8 w-8 rounded bg-soft-primary text-primary hover:bg-[#604ae3] hover:text-white flex items-center justify-center transition-all text-[16px]" title="Edit Invoice">
                          <iconify-icon icon="solar:pen-2-broken" />
                        </a>
                        <button className="h-8 w-8 rounded bg-soft-danger text-danger hover:bg-[#ff5b5b] hover:text-white flex items-center justify-center transition-all text-[16px]" title="Archive">
                          <iconify-icon icon="solar:trash-bin-minimalistic-2-broken" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer controls pagination mock */}
        {customer.transactionHistory.length > 0 && (
          <div className="px-5 py-3.5 border-t border-border flex justify-end">
            <nav className="flex items-center gap-1">
              <button className="text-[12.5px] border border-border px-3 py-1.5 rounded-[5px] font-medium text-muted-foreground hover:bg-muted">Previous</button>
              <button className="h-8 w-8 rounded-[5px] text-[12.5px] font-bold bg-[#604ae3] text-white">1</button>
              <button className="text-[12.5px] border border-border px-3 py-1.5 rounded-[5px] font-medium text-muted-foreground hover:bg-muted">Next</button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
