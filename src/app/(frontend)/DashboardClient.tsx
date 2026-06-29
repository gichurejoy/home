"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { SalesAnalyticChart } from "@/components/charts/RevenueChart";
import { MiniSparkChart } from "@/components/charts/MiniSparkChart";
import { RadialChart } from "@/components/charts/RadialChart";
import { WeeklySalesChart } from "@/components/charts/WeeklySalesChart";
import { WorldMap } from "@/components/charts/WorldMap";
import { RecordDealModal } from "@/components/modals/RecordDealModal";
import Image from "next/image";
import Link from "next/link";

export default function DashboardClient() {
  const { properties, agents, customers, closedDeals } = useAppStore();
  const [isRecordDealOpen, setIsRecordDealOpen] = useState(false);

  // Dynamic calculations
  const totalProperties = properties.length + 2843; // Base of 2854 properties
  const totalAgents = agents.length + 699; // Base of 705 agents
  const totalCustomers = customers.length + 9423; // Base of 9431 customers

  // Base sales volume is $71.5M, plus all logged deal prices
  const totalSalesVolume = 71500000 + closedDeals.reduce((sum, d) => sum + d.price, 0);
  const formattedRevenue = `$${(totalSalesVolume / 1000000).toFixed(1)}M`;

  // Dynamic balance = Brokerage splits sum
  // Base balance is $117,000.43. We subtract the pre-seeded deal cuts from initialClosedDeals ($15,000 + $0 + $5,360 = $20,360) so it matches $117,000.43 exactly on load.
  const brokerTotalEarnings = 117000.43 - 20360 + closedDeals.reduce((sum, d) => sum + d.brokerCut, 0);
  const formattedBalance = `$${brokerTotalEarnings.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Monthly income and expense (broker cuts and agent cuts)
  const currentMonthDeals = closedDeals.filter(d => d.closeDate.startsWith("2026-06"));
  const currentMonthIncome = 13321.12 + currentMonthDeals.reduce((sum, d) => sum + d.brokerCut, 0);
  const currentMonthExpense = 7566.11 + currentMonthDeals.reduce((sum, d) => sum + d.agentPayout, 0);

  // Targets
  const revenueTargetPct = Math.min(100, Math.round((totalSalesVolume / 90000000) * 100)); // Target of $90M

  // Dynamic Stat Cards Configuration
  const statCards = [
    {
      id: "stat-properties",
      label: "No. of Properties",
      value: totalProperties.toLocaleString(),
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
      value: totalAgents.toLocaleString(),
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
      value: totalCustomers.toLocaleString(),
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
      value: formattedRevenue,
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
        "Outstanding service from start to finish. The waveron team made the whole experience stress-free.",
      property: "Greenleaf Villas",
      date: "May 15, 2026",
    },
  ];

  // Map agent info to properties dynamically for the table
  const recentProperties = properties.slice(0, 5).map((p) => {
    const matchedAgent = agents.find((a) => a.id === p.agentId);
    return {
      ...p,
      agentName: matchedAgent ? matchedAgent.name : "Unknown Agent",
      agentInitial: matchedAgent ? matchedAgent.name.charAt(0) : "A",
      agentColor: matchedAgent
        ? p.agentId === "AGT-001"
          ? "#604ae3"
          : p.agentId === "AGT-002"
          ? "#0acf97"
          : p.agentId === "AGT-003"
          ? "#f1b53d"
          : "#39afd1"
        : "#888888",
    };
  });

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-foreground">Analytics</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Real-time SaaS commissions & analytics portal</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="dashboard-record-deal"
            onClick={() => setIsRecordDealOpen(true)}
            className="bg-[#0acf97] hover:bg-[#0acf97]/90 text-white text-[13px] font-bold px-4 py-2 rounded-[5px] flex items-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
          >
            <i className="ri-exchange-dollar-line text-[16px] align-middle" /> Record Closed Deal
          </button>
          
          <ol className="hidden sm:flex items-center gap-1.5 text-[13px] text-muted-foreground bg-card px-3 py-1.5 border border-border rounded-[5px]">
            <li>
              <a href="/" className="hover:text-primary transition-colors">Dashboard</a>
            </li>
            <li><i className="ri-arrow-right-s-line text-[12px]" /></li>
            <li className="text-primary font-medium">Analytics</li>
          </ol>
        </div>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div
            key={card.id}
            id={card.id}
            className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.15)]"
          >
            <div className="flex items-start justify-between">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-[6px] ${card.iconBg} flex-shrink-0`}
              >
                <i className={`${card.icon} text-[22px] ${card.iconColor}`} />
              </div>
              <div className="w-[130px] flex-shrink-0 -mt-1">
                <MiniSparkChart
                  data={card.sparkData}
                  color={card.sparkColor}
                  height={72}
                  tooltipLabel={card.tooltipLabel}
                />
              </div>
            </div>

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
                  Total Commissions : <span className="text-primary font-bold">
                    ${closedDeals.reduce((sum, d) => sum + d.grossCommission, 0).toLocaleString()}
                  </span>
                </span>
              </div>
              <button
                id="sales-period-btn"
                className="flex items-center gap-1 text-[12px] font-medium text-muted-foreground border border-border bg-muted/30 hover:bg-muted px-3 py-1.5 rounded-[5px] transition-all"
              >
                All-Time <i className="ri-arrow-down-s-line text-[13px]" />
              </button>
            </div>
          </div>
          
          {/* Dynamic chart wired to store */}
          <SalesAnalyticChart />

          {/* Footer */}
          <div className="grid grid-cols-3 mt-5 pt-4 border-t border-border">
            <div className="text-center border-r border-border">
              <p className="text-[12px] text-muted-foreground mb-1">Broker Net cut</p>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-[17px] font-bold text-foreground">
                  ${closedDeals.reduce((sum, d) => sum + d.brokerCut, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-success bg-soft-success px-1.5 py-0.5 rounded">
                  <i className="ri-arrow-up-line text-[9px]" />0.8%
                </span>
              </div>
            </div>
            <div className="text-center border-r border-border">
              <p className="text-[12px] text-muted-foreground mb-1">Agent Splits Paid</p>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-[17px] font-bold text-foreground">
                  ${closedDeals.reduce((sum, d) => sum + d.agentPayout, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-danger bg-soft-danger px-1.5 py-0.5 rounded">
                  <i className="ri-arrow-down-line text-[9px]" />5.3%
                </span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-[12px] text-muted-foreground mb-1">Average Split</p>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-[17px] font-bold text-foreground">
                  {closedDeals.length > 0 ? Math.round(closedDeals.reduce((sum, d) => sum + (d.agentPayout / d.grossCommission) * 100, 0) / closedDeals.length) : 80}%
                </span>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-success bg-soft-success px-1.5 py-0.5 rounded">
                  <i className="ri-arrow-up-line text-[9px]" />2.9%
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
              <h3 className="text-[28px] font-bold">{formattedBalance}</h3>
              <p className="text-white/70 text-[13px] mb-5">Broker Net Revenue Balance</p>
              
              <div className="flex gap-6 mb-5">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="h-5 w-5 bg-white/20 rounded-[4px] flex items-center justify-center">
                      <i className="ri-arrow-down-line text-[11px]" />
                    </div>
                    <span className="text-[13px] font-semibold">${currentMonthIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <p className="text-white/60 text-[11px] ml-6">Jun Income</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="h-5 w-5 bg-white/20 rounded-[4px] flex items-center justify-center">
                      <i className="ri-arrow-up-line text-[11px]" />
                    </div>
                    <span className="text-[13px] font-semibold">${currentMonthExpense.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <p className="text-white/60 text-[11px] ml-6">Jun Splits Paid</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button id="balance-send-btn" onClick={() => setIsRecordDealOpen(true)} className="bg-[#f1b53d] hover:bg-[#e0a631] text-white text-[13px] font-semibold px-5 py-2 rounded-[6px] transition-all active:scale-[0.97]">
                  New Transaction
                </button>
                <button id="balance-receive-btn" onClick={() => window.location.href="/transactions"} className="bg-white/20 hover:bg-white/30 text-white text-[13px] font-semibold px-5 py-2 rounded-[6px] transition-all">
                  Ledger Logs
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
                <p className="text-[14px] font-bold text-foreground mb-3">Listings</p>
                <div className="h-10 w-10 bg-soft-primary rounded-[8px] flex items-center justify-center mx-auto mb-2">
                  <i className="ri-building-2-line text-[20px] text-primary" />
                </div>
                <h4 className="text-[20px] font-bold text-foreground">{properties.length}</h4>
                <p className="text-[11px] text-muted-foreground mb-3">Store Active Listings</p>
                <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                  <div className="h-full rounded-full bg-[#604ae3]" style={{ width: `${Math.min(100, Math.round((properties.length / 15) * 100))}%` }} />
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-[14px] font-bold text-foreground mb-3">Volume ROI</p>
                <div className="h-10 w-10 bg-soft-success rounded-[8px] flex items-center justify-center mx-auto mb-2">
                  <i className="ri-briefcase-line text-[20px] text-success" />
                </div>
                <h4 className="text-[20px] font-bold text-foreground">{formattedRevenue}</h4>
                <p className="text-[11px] text-muted-foreground mb-3">{revenueTargetPct}% of Target</p>
                <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                  <div className="h-full rounded-full bg-[#0acf97]" style={{ width: `${revenueTargetPct}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Social Source + Most Sales Location + Weekly Sales ─────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

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

          <div className="flex-1 -my-2">
            <RadialChart value={70 + closedDeals.length} color="#604ae3" height={210} />
          </div>

          <div className="border-t border-border pt-4 mt-1">
            <div className="flex items-center gap-2 text-[13px] text-muted-foreground mb-3">
              <i className="ri-group-line text-[16px] text-[#604ae3]" />
              <span>Buyers logged: <span className="text-[#604ae3] font-bold">{customers.length}</span></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-muted-foreground">See More Statistic</span>
              <button
                id="social-see-details-btn"
                onClick={() => window.location.href="/customers"}
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
              Global <i className="ri-arrow-down-s-line text-[13px]" />
            </button>
          </div>

          <WorldMap />

          <div className="mt-4">
            <div className="flex justify-between mb-2">
              {salesLocations.map((loc) => (
                <span key={loc.name} className="text-[12px] text-muted-foreground font-medium text-center flex-1">
                  {loc.name}
                </span>
              ))}
            </div>
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

          <div className="relative rounded-[6px] overflow-hidden mb-3 flex-shrink-0" style={{ height: "160px" }}>
            <Image
              src="/villa-pool.png"
              alt="Featured property"
              fill
              className="object-cover"
              priority
            />
            <button className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors">
              <i className="ri-arrow-left-s-line text-[16px]" />
            </button>
            <button className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors">
              <i className="ri-arrow-right-s-line text-[16px]" />
            </button>
          </div>

          <div className="-mx-2 flex-shrink-0">
            <WeeklySalesChart />
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <p className="text-[13px] text-muted-foreground">
              Total Deals Closed : <span className="text-foreground font-bold">{closedDeals.length}</span>
            </p>
            <button
              id="weekly-sales-view-more"
              onClick={() => window.location.href="/properties/list"}
              className="border border-[#ff5b5b] text-[#ff5b5b] hover:bg-[#ff5b5b] hover:text-white text-[12px] font-semibold px-4 py-1.5 rounded-[5px] transition-colors"
            >
              View Listings
            </button>
          </div>
        </div>
      </div>

      {/* ── Recent Properties Table ─────────────────────────────── */}
      <div id="recent-properties-table" className="bg-card border border-border rounded-[8px] shadow-[0_0_35px_rgba(154,161,171,0.15)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-[15px] font-bold text-foreground">Recent Properties</h3>
          <Link href="/properties/list" className="text-[12px] font-medium text-primary hover:underline flex items-center gap-1">
            View All <i className="ri-arrow-right-line" />
          </Link>
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
                        <p className="font-semibold text-foreground">{prop.title}</p>
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
                      <span className="font-medium text-foreground whitespace-nowrap">{prop.agentName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">{prop.location}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      prop.status === "Sold" 
                        ? "text-danger bg-soft-danger" 
                        : prop.status === "For Rent" 
                        ? "text-success bg-soft-success" 
                        : "text-warning bg-soft-warning"
                    }`}>
                      {prop.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-bold text-foreground">${prop.price.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <Link href={`/properties/${prop.id}`} className="h-7 w-7 rounded-[4px] bg-soft-primary text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-colors">
                        <i className="ri-eye-line text-[13px]" />
                      </Link>
                      {prop.status !== "Sold" && (
                        <button
                          onClick={() => {
                            setIsRecordDealOpen(true);
                          }}
                          className="h-7 w-7 rounded-[4px] bg-soft-success text-success hover:bg-success hover:text-white flex items-center justify-center transition-colors"
                          title="Record Sale"
                        >
                          <i className="ri-exchange-dollar-line text-[14px]" />
                        </button>
                      )}
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
          <Link href="/reviews" className="text-[12px] font-medium text-primary hover:underline flex items-center gap-1">
            View All <i className="ri-arrow-right-line" />
          </Link>
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

      {/* Transaction Entry Modal */}
      <RecordDealModal 
        isOpen={isRecordDealOpen}
        onClose={() => setIsRecordDealOpen(false)}
      />
    </div>
  );
}
