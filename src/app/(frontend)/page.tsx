import { Metadata } from "next";
import { SalesAnalyticChart } from "@/components/charts/RevenueChart";
import { MiniSparkChart } from "@/components/charts/MiniSparkChart";
import { RadialChart } from "@/components/charts/RadialChart";
import { WeeklySalesChart } from "@/components/charts/WeeklySalesChart";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Analytics | Lahomes - Real Estate Management Admin",
  description: "Analytics dashboard for Lahomes real estate admin panel.",
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const statCards = [
  {
    id: "stat-properties",
    label: "No. of Properties",
    value: "2,854",
    trend: "+7.34%",
    trendUp: true,
    icon: "ri-building-2-line",
    iconBg: "bg-soft-primary",
    iconColor: "text-primary",
    sparkColor: "#604ae3",
    sparkData: [40, 50, 65, 40, 40, 65, 40],
    tooltipLabel: "New Properties",
  },
  {
    id: "stat-agents",
    label: "Regi. Agents",
    value: "705",
    trend: "+76.89%",
    trendUp: true,
    icon: "ri-group-2-line",
    iconBg: "bg-soft-info",
    iconColor: "text-info",
    sparkColor: "#39afd1",
    sparkData: [40, 50, 65, 40, 40, 65, 40],
    tooltipLabel: "New Agents",
  },
  {
    id: "stat-customers",
    label: "Customers",
    value: "9,431",
    trend: "+45.00%",
    trendUp: false,
    icon: "ri-shield-user-line",
    iconBg: "bg-soft-primary",
    iconColor: "text-primary",
    sparkColor: "#604ae3",
    sparkData: [40, 65, 50, 65, 40, 50, 40],
    tooltipLabel: "New Customers",
  },
  {
    id: "stat-revenue",
    label: "Revenue",
    value: "$78.3M",
    trend: "+8.76%",
    trendUp: true,
    icon: "ri-suitcase-2-line",
    iconBg: "bg-soft-info",
    iconColor: "text-info",
    sparkColor: "#39afd1",
    sparkData: [40, 50, 65, 40, 40, 65, 40],
    tooltipLabel: "Revenue",
  },
];

const salesLocations = [
  { name: "Canada", pct: 71.1, badgeColor: "bg-[#604ae3]" },
  { name: "USA", pct: 67.0, badgeColor: "bg-[#0acf97]" },
  { name: "Brazil", pct: 53.9, badgeColor: "bg-[#604ae3]" },
  { name: "Russia", pct: 49.2, badgeColor: "bg-[#0acf97]" },
  { name: "China", pct: 38.8, badgeColor: "bg-[#604ae3]" },
];

// World map dot positions (approximate % of SVG viewBox 0 0 800 500)
const mapDots = [
  { name: "Canada", x: 175, y: 130 },
  { name: "United States", x: 175, y: 195 },
  { name: "Brazil", x: 255, y: 305 },
  { name: "Russia", x: 545, y: 120 },
  { name: "China", x: 610, y: 185 },
];

const recentProperties = [
  {
    id: 1,
    name: "Broadview Apartments",
    type: "Apartment",
    agent: "Brooklyn Simmons",
    agentInitial: "B",
    agentColor: "#604ae3",
    location: "12, Kolkata (WB)",
    status: "Available",
    statusColor: "text-success bg-soft-success",
    price: "$7,235",
  },
  {
    id: 2,
    name: "Skyview Residency",
    type: "House",
    agent: "Marvin McKinney",
    agentInitial: "M",
    agentColor: "#0acf97",
    location: "35, Mumbai (MH)",
    status: "Pending",
    statusColor: "text-warning bg-soft-warning",
    price: "$12,540",
  },
  {
    id: 3,
    name: "Greenleaf Villas",
    type: "Villa",
    agent: "Jerome Bell",
    agentInitial: "J",
    agentColor: "#f1b53d",
    location: "8, Delhi (DL)",
    status: "Sold",
    statusColor: "text-danger bg-soft-danger",
    price: "$45,000",
  },
  {
    id: 4,
    name: "Harbor Point Suites",
    type: "Suite",
    agent: "Savannah Nguyen",
    agentInitial: "S",
    agentColor: "#39afd1",
    location: "21, Chennai (TN)",
    status: "Available",
    statusColor: "text-success bg-soft-success",
    price: "$8,900",
  },
  {
    id: 5,
    name: "Pinewood Estates",
    type: "Land",
    agent: "Wade Warren",
    agentInitial: "W",
    agentColor: "#ff5b5b",
    location: "4, Pune (MH)",
    status: "Pending",
    statusColor: "text-warning bg-soft-warning",
    price: "$3,200",
  },
];

const latestReviews = [
  {
    id: 1,
    name: "Josephine Thompson",
    initial: "J",
    color: "#604ae3",
    rating: 5,
    comment:
      "Absolutely wonderful experience! The property was exactly as described and the agent was professional and helpful.",
    property: "Broadview Apartments",
    date: "May 20, 2026",
  },
  {
    id: 2,
    name: "Robert Chen",
    initial: "R",
    color: "#0acf97",
    rating: 4,
    comment:
      "Great location and very clean. The process was smooth. Would definitely recommend to anyone looking.",
    property: "Skyview Residency",
    date: "May 18, 2026",
  },
  {
    id: 3,
    name: "Maria Santos",
    initial: "M",
    color: "#f1b53d",
    rating: 5,
    comment:
      "Outstanding service from start to finish. The Lahomes team made the whole experience stress-free.",
    property: "Greenleaf Villas",
    date: "May 15, 2026",
  },
];

import { WorldMap } from "@/components/charts/WorldMap";

// ─── Component ────────────────────────────────────────────────────────────────

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-6">

      {/* ── Breadcrumb ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-[20px] font-bold text-foreground">Analytics</h1>
        <ol className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <li>
            <a href="/" className="hover:text-primary transition-colors">Dashboard</a>
          </li>
          <li><i className="ri-arrow-right-s-line text-[12px]" /></li>
          <li className="text-primary font-medium">Analytics</li>
        </ol>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div
            key={card.id}
            id={card.id}
            className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.15)]"
          >
            {/* Top: icon + mini chart side by side */}
            <div className="flex items-start justify-between">
              {/* Left: icon */}
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-[6px] ${card.iconBg} flex-shrink-0`}
              >
                <i className={`${card.icon} text-[22px] ${card.iconColor}`} />
              </div>
              {/* Right: mini spark chart */}
              <div className="w-[130px] flex-shrink-0 -mt-1">
                <MiniSparkChart
                  data={card.sparkData}
                  color={card.sparkColor}
                  height={72}
                  tooltipLabel={card.tooltipLabel}
                />
              </div>
            </div>

            {/* Bottom: label + value + trend */}
            <div className="mt-3">
              <p className="text-[13px] text-muted-foreground font-medium mb-1">{card.label}</p>
              <div className="flex items-center gap-2">
                <span className="text-[22px] font-bold text-foreground leading-none">{card.value}</span>
                <span
                  className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                    card.trendUp
                      ? "text-success bg-soft-success"
                      : "text-danger bg-soft-danger"
                  }`}
                >
                  {card.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Sales Analytic + Balance/Targets ─────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Sales Analytic (2/3) */}
        <div className="xl:col-span-2 bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.15)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="text-[16px] font-bold text-foreground">Sales Analytic</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[13px]">
                <div className="h-5 w-5 bg-foreground rounded flex items-center justify-center">
                  <span className="text-background text-[10px] font-bold">$</span>
                </div>
                <span className="text-muted-foreground font-medium">
                  Earnings : <span className="text-primary font-bold">$85,934</span>
                </span>
              </div>
              <button
                id="sales-period-btn"
                className="flex items-center gap-1 text-[12px] font-medium text-muted-foreground border border-border bg-muted/30 hover:bg-muted px-3 py-1.5 rounded-[5px] transition-all"
              >
                This Month <i className="ri-arrow-down-s-line text-[13px]" />
              </button>
            </div>
          </div>
          <SalesAnalyticChart />
          {/* Footer */}
          <div className="grid grid-cols-3 mt-5 pt-4 border-t border-border">
            <div className="text-center border-r border-border">
              <p className="text-[12px] text-muted-foreground mb-1">Income</p>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-[17px] font-bold text-foreground">23,675.00</span>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-success bg-soft-success px-1.5 py-0.5 rounded">
                  <i className="ri-arrow-up-line text-[9px]" />0.08%
                </span>
              </div>
            </div>
            <div className="text-center border-r border-border">
              <p className="text-[12px] text-muted-foreground mb-1">Expenses</p>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-[17px] font-bold text-foreground">11,562.00</span>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-danger bg-soft-danger px-1.5 py-0.5 rounded">
                  <i className="ri-arrow-down-line text-[9px]" />5.38%
                </span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-[12px] text-muted-foreground mb-1">Balance</p>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-[17px] font-bold text-foreground">67,365.00</span>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-success bg-soft-success px-1.5 py-0.5 rounded">
                  <i className="ri-arrow-up-line text-[9px]" />2.89%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Balance + Targets */}
        <div className="flex flex-col gap-6">
          {/* My Balance */}
          <div
            id="balance-card"
            className="relative rounded-[8px] p-6 text-white overflow-hidden shadow-[0_0_35px_rgba(154,161,171,0.15)]"
            style={{ background: "linear-gradient(135deg, #604ae3 0%, #4535c1 100%)", minHeight: "220px" }}
          >
            <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-white/5" />
            <div className="absolute top-10 -right-3 h-20 w-20 rounded-full bg-white/5" />
            <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-white/5" />
            <div className="relative z-10">
              <h3 className="text-[28px] font-bold">$117,000.43</h3>
              <p className="text-white/70 text-[13px] mb-5">My Balance</p>
              <div className="flex gap-6 mb-5">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="h-5 w-5 bg-white/20 rounded-[4px] flex items-center justify-center">
                      <i className="ri-arrow-down-line text-[11px]" />
                    </div>
                    <span className="text-[13px] font-semibold">$13,321.12</span>
                  </div>
                  <p className="text-white/60 text-[11px] ml-6">Income</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="h-5 w-5 bg-white/20 rounded-[4px] flex items-center justify-center">
                      <i className="ri-arrow-up-line text-[11px]" />
                    </div>
                    <span className="text-[13px] font-semibold">$7,566.11</span>
                  </div>
                  <p className="text-white/60 text-[11px] ml-6">Expanse</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button id="balance-send-btn" className="bg-[#f1b53d] hover:bg-[#e0a631] text-white text-[13px] font-semibold px-6 py-2 rounded-[6px] transition-colors">
                  Send
                </button>
                <button id="balance-receive-btn" className="bg-white/20 hover:bg-white/30 text-white text-[13px] font-semibold px-6 py-2 rounded-[6px] transition-colors">
                  Receive
                </button>
              </div>
            </div>
            <div className="absolute bottom-3 right-4 opacity-20 pointer-events-none">
              <i className="ri-money-dollar-circle-fill text-[80px]" />
            </div>
          </div>

          {/* Targets */}
          <div id="targets-card" className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.15)]">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <p className="text-[14px] font-bold text-foreground mb-3">Property</p>
                <div className="h-10 w-10 bg-soft-primary rounded-[8px] flex items-center justify-center mx-auto mb-2">
                  <i className="ri-building-2-line text-[20px] text-primary" />
                </div>
                <h4 className="text-[20px] font-bold text-foreground">15,780</h4>
                <p className="text-[11px] text-muted-foreground mb-3">60% Target</p>
                <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                  <div className="h-full rounded-full bg-[#604ae3]" style={{ width: "60%" }} />
                </div>
              </div>
              <div className="text-center">
                <p className="text-[14px] font-bold text-foreground mb-3">Revenue</p>
                <div className="h-10 w-10 bg-soft-success rounded-[8px] flex items-center justify-center mx-auto mb-2">
                  <i className="ri-briefcase-line text-[20px] text-success" />
                </div>
                <h4 className="text-[20px] font-bold text-foreground">$78.3M</h4>
                <p className="text-[11px] text-muted-foreground mb-3">80% Target</p>
                <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                  <div className="h-full rounded-full bg-[#0acf97]" style={{ width: "80%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Social Source + Most Sales Location + Weekly Sales ─────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        {/* Social Source */}
        <div id="social-source-card" className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.15)] flex flex-col">
          <div className="flex items-center justify-between mb-0.5">
            <div>
              <h4 className="text-[15px] font-bold text-foreground">Social Source</h4>
              <p className="text-[12px] text-muted-foreground">Total Traffic In This Week</p>
            </div>
            <button className="flex items-center gap-1 text-[12px] font-medium text-muted-foreground border border-border bg-muted/30 px-2.5 py-1.5 rounded-[5px]">
              This Month <i className="ri-arrow-down-s-line text-[13px]" />
            </button>
          </div>

          {/* Radial chart */}
          <div className="flex-1 -my-2">
            <RadialChart value={70} color="#604ae3" height={210} />
          </div>

          {/* Footer */}
          <div className="border-t border-border pt-4 mt-1">
            <div className="flex items-center gap-2 text-[13px] text-muted-foreground mb-3">
              <i className="ri-group-line text-[16px] text-[#604ae3]" />
              <span>Buyers : <span className="text-[#604ae3] font-bold">70</span></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-muted-foreground">See More Statistic</span>
              <button
                id="social-see-details-btn"
                className="bg-[#313a46] hover:bg-[#252d36] dark:bg-white/20 dark:hover:bg-white/30 text-white text-[12px] font-semibold px-4 py-1.5 rounded-[5px] transition-colors"
              >
                See Details
              </button>
            </div>
          </div>
        </div>

        {/* Most Sales Location */}
        <div id="most-sales-location-card" className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.15)]">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[15px] font-bold text-foreground">Most Sales Location</h4>
            <button className="flex items-center gap-1 text-[12px] font-medium text-muted-foreground border border-border bg-muted/30 px-2.5 py-1.5 rounded-[5px]">
              Asia <i className="ri-arrow-down-s-line text-[13px]" />
            </button>
          </div>

          {/* World Map */}
          <WorldMap />

          {/* Country bars */}
          <div className="mt-4">
            {/* Labels row */}
            <div className="flex justify-between mb-2">
              {salesLocations.map((loc) => (
                <span key={loc.name} className="text-[12px] text-muted-foreground font-medium text-center flex-1">
                  {loc.name}
                </span>
              ))}
            </div>
            {/* Percentage badge row */}
            <div className="flex gap-2">
              {salesLocations.map((loc) => (
                <div key={loc.name} className="flex-1 flex justify-center">
                  <span
                    className={`${loc.badgeColor} text-white text-[11px] font-semibold px-3 py-1 rounded-[4px] inline-block`}
                  >
                    {loc.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Sales */}
        <div id="weekly-sales-card" className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.15)] flex flex-col">
          <h4 className="text-[15px] font-bold text-foreground mb-3">Weekly Sales</h4>

          {/* Property Image */}
          <div className="relative rounded-[6px] overflow-hidden mb-3 flex-shrink-0" style={{ height: "160px" }}>
            <Image
              src="/villa-pool.png"
              alt="Featured property"
              fill
              className="object-cover"
              priority
            />
            {/* Carousel nav arrows */}
            <button className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors">
              <i className="ri-arrow-left-s-line text-[16px]" />
            </button>
            <button className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors">
              <i className="ri-arrow-right-s-line text-[16px]" />
            </button>
          </div>

          {/* Bar chart */}
          <div className="-mx-2 flex-shrink-0">
            <WeeklySalesChart />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <p className="text-[13px] text-muted-foreground">
              Total Property Seals : <span className="text-foreground font-bold">5,746</span>
            </p>
            <button
              id="weekly-sales-view-more"
              className="border border-[#ff5b5b] text-[#ff5b5b] hover:bg-[#ff5b5b] hover:text-white text-[12px] font-semibold px-4 py-1.5 rounded-[5px] transition-colors"
            >
              View More
            </button>
          </div>
        </div>
      </div>

      {/* ── Recent Properties Table ─────────────────────────────── */}
      <div id="recent-properties-table" className="bg-card border border-border rounded-[8px] shadow-[0_0_35px_rgba(154,161,171,0.15)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-[15px] font-bold text-foreground">Recent Properties</h3>
          <a href="/properties/list" className="text-[12px] font-medium text-primary hover:underline flex items-center gap-1">
            View All <i className="ri-arrow-right-line" />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-muted/40 border-b border-border">
                {["Property", "Agent", "Location", "Status", "Price", "Action"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentProperties.map((prop) => (
                <tr key={prop.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-[6px] flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: prop.agentColor + "22" }}>
                        <i className="ri-building-2-line text-[16px]" style={{ color: prop.agentColor }} />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{prop.name}</p>
                        <p className="text-[11px] text-muted-foreground">{prop.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-7 w-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                        style={{ backgroundColor: prop.agentColor }}>
                        {prop.agentInitial}
                      </span>
                      <span className="font-medium text-foreground whitespace-nowrap">{prop.agent}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">{prop.location}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${prop.statusColor}`}>
                      {prop.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-bold text-foreground">{prop.price}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <button id={`view-prop-${prop.id}`} className="h-7 w-7 rounded-[4px] bg-soft-primary text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-colors">
                        <i className="ri-eye-line text-[13px]" />
                      </button>
                      <button id={`edit-prop-${prop.id}`} className="h-7 w-7 rounded-[4px] bg-soft-success text-success hover:bg-success hover:text-white flex items-center justify-center transition-colors">
                        <i className="ri-edit-line text-[13px]" />
                      </button>
                      <button id={`del-prop-${prop.id}`} className="h-7 w-7 rounded-[4px] bg-soft-danger text-danger hover:bg-danger hover:text-white flex items-center justify-center transition-colors">
                        <i className="ri-delete-bin-line text-[13px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Latest Reviews ──────────────────────────────────────── */}
      <div id="latest-reviews">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-bold text-foreground">Latest Reviews</h3>
          <a href="/reviews" className="text-[12px] font-medium text-primary hover:underline flex items-center gap-1">
            View All <i className="ri-arrow-right-line" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {latestReviews.map((review) => (
            <div key={review.id} id={`review-${review.id}`}
              className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.15)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full flex items-center justify-center text-white text-[14px] font-bold flex-shrink-0"
                  style={{ backgroundColor: review.color }}>
                  {review.initial}
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-foreground">{review.name}</p>
                  <p className="text-[11px] text-muted-foreground">{review.property}</p>
                </div>
                <span className="text-[11px] text-muted-foreground">{review.date}</span>
              </div>
              <div className="flex items-center gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <i key={i} className={`ri-star-fill text-[14px] ${i < review.rating ? "text-[#f1b53d]" : "text-border"}`} />
                ))}
                <span className="ml-1.5 text-[11px] text-muted-foreground">({review.rating}.0)</span>
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-3">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
