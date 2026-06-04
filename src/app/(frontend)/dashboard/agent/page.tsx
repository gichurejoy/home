"use client";

import { useEffect, useState, useRef } from "react";
import { SalesFunnelChart } from "@/components/charts/SalesFunnelChart";
import { RecentAgentStatusChart } from "@/components/charts/RecentAgentStatusChart";
import { AgentGoalsChart } from "@/components/charts/AgentGoalsChart";
import { WorldMap } from "@/components/charts/WorldMap";

import * as React from "react";

interface DropdownProps {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}

function Dropdown({ options, selected, onSelect }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground border border-border bg-muted/30 hover:bg-muted px-2.5 py-1.5 rounded-[5px] transition-all"
      >
        {selected} <i className="ri-arrow-down-s-line text-[13px]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-32 bg-card border border-border rounded-[6px] shadow-lg py-1 z-20 animate-in fade-in slide-in-from-top-1 duration-150">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-[12px] text-foreground hover:bg-muted transition-colors font-medium"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AgentDashboard() {
  // Dropdown states
  const [funnelPeriod, setFunnelPeriod] = useState("This Month");
  const [revenuePeriod, setRevenuePeriod] = useState("This Month");
  const [statusPeriod, setStatusPeriod] = useState("This Month");
  const [rentPeriod, setRentPeriod] = useState("This Month");
  const [countryRegion, setCountryRegion] = useState("Asia");

  const [autoSmsEnabled, setAutoSmsEnabled] = useState(true);
  const [alerts, setAlerts] = useState([
    {
      id: "alert-1",
      buyer: "Sarah Jenkins",
      avatar: "/assets/images/users/avatar-3.jpg",
      action: "viewing 104 Pine Road Estate for the 4th time today",
      time: "2 mins ago",
      type: "hot",
      score: 96,
      phone: "+1 (555) 019-2834",
    },
    {
      id: "alert-2",
      buyer: "Marcus Vance",
      avatar: "/assets/images/users/avatar-5.jpg",
      action: "opened Malibu Modern Penthouse photos 8 times in 24h",
      time: "25 mins ago",
      type: "hot",
      score: 92,
      phone: "+1 (555) 014-9876",
    },
    {
      id: "alert-3",
      buyer: "Emily Watson",
      avatar: "/assets/images/users/avatar-6.jpg",
      action: "has gone inactive for 7 days (ghosting risk)",
      time: "1 day ago",
      type: "cold",
      score: 85,
      phone: "+1 (555) 018-2435",
    },
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleDismissAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  // Commission & Leaderboard states
  const [commissionTab, setCommissionTab] = useState<"calculator" | "leaderboard">("calculator");
  const [dealVolume, setDealVolume] = useState<number>(500000);
  const [commissionRate, setCommissionRate] = useState<number>(3.0);
  const [splitRate, setSplitRate] = useState<number>(70); // Agent %
  const [isDoubleEnded, setIsDoubleEnded] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      {/* CSS Keyframes for animated striped progress bar */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes progress-bar-stripes {
            0% { background-position: 1rem 0; }
            100% { background-position: 0 0; }
          }
          .progress-bar-animated-custom {
            animation: progress-bar-stripes 1s linear infinite;
          }
        `
      }} />

      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-[20px] font-bold text-foreground">Agent</h1>
        <ol className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <li>
            <a href="/" className="hover:text-primary transition-colors">Dashboards</a>
          </li>
          <li><i className="ri-arrow-right-s-line text-[12px]" /></li>
          <li className="text-primary font-medium">Agent</li>
        </ol>
      </div>

      {/* ── Top Stat Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Card 1: Earn of the Month */}
        <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.15)] flex items-center justify-between">
          <div>
            <p className="text-[15px] font-medium text-muted-foreground mb-2">Earn of the Month</p>
            <h3 className="text-[24px] font-bold text-foreground leading-none">$3548.09</h3>
          </div>
          <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <iconify-icon icon="solar:calendar-date-broken" style={{ fontSize: "32px" }} />
          </div>
        </div>

        {/* Card 2: Earn Growth */}
        <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.15)] flex items-center justify-between">
          <div>
            <p className="text-[15px] font-medium text-muted-foreground mb-2 flex items-center gap-2">
              Earn Growth
              <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-success bg-soft-success px-1.5 py-0.5 rounded">
                <i className="ri-arrow-up-line" /> 44%
              </span>
            </p>
            <h3 className="text-[24px] font-bold text-foreground leading-none">$67435.00</h3>
          </div>
          <div className="h-12 w-12 rounded bg-soft-success flex items-center justify-center text-success flex-shrink-0">
            <iconify-icon icon="solar:graph-new-broken" style={{ fontSize: "32px" }} />
          </div>
        </div>

        {/* Card 3: Conversation Rate */}
        <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.15)] flex items-center justify-between">
          <div>
            <p className="text-[15px] font-medium text-muted-foreground mb-2">Conversation Rate</p>
            <h3 className="text-[24px] font-bold text-foreground leading-none">78.8%</h3>
          </div>
          <div className="h-12 w-12 rounded bg-soft-warning flex items-center justify-center text-warning flex-shrink-0">
            <iconify-icon icon="solar:user-plus-broken" style={{ fontSize: "32px" }} />
          </div>
        </div>

        {/* Card 4: Gross Profit Margin */}
        <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.15)] flex items-center justify-between">
          <div>
            <p className="text-[15px] font-medium text-muted-foreground mb-2">Gross Profit Margin</p>
            <h3 className="text-[24px] font-bold text-foreground leading-none">34.00%</h3>
          </div>
          <div className="h-12 w-12 rounded bg-soft-info flex items-center justify-center text-info flex-shrink-0">
            <iconify-icon icon="solar:chart-2-broken" style={{ fontSize: "32px" }} />
          </div>
        </div>
      </div>

      {/* ── Main content grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column (col-span-9) */}
        <div className="xl:col-span-9 space-y-6">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-5 right-5 z-50 bg-card border border-border rounded-[8px] p-3.5 shadow-2xl animate-in slide-in-from-bottom duration-200 flex items-center gap-2 max-w-sm">
              <span className="h-2 w-2 rounded-full bg-success animate-ping shrink-0" />
              <p className="text-[13px] font-semibold text-foreground">{toastMessage}</p>
            </div>
          )}

          {/* ── B2B SaaS Premium Feature: Anti-Ghosting & Hot Leads Alert Panel ── */}
          <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.08)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-3">
              <div>
                <span className="bg-[#604ae3]/10 text-[#604ae3] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-[4px] tracking-wider">
                  B2B SaaS Premium
                </span>
                <h4 className="text-[15.5px] font-bold text-foreground mt-1.5 flex items-center gap-1.5">
                  <iconify-icon icon="solar:shield-warning-bold-duotone" className="text-[20px] text-danger animate-pulse" />
                  Anti-Ghosting & Behavior-Driven Hot Leads
                </h4>
                <p className="text-[12.5px] text-muted-foreground mt-0.5">
                  Track buyer engagement in real-time. Reach hot prospects before they cool off.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Side: Real-Time Alerts */}
              <div className="lg:col-span-7 space-y-3">
                <h5 className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
                  Live Engagement Trigger Alerts
                </h5>
                
                {alerts.length === 0 ? (
                  <div className="border border-dashed border-border rounded-[6px] p-6 text-center bg-muted/5">
                    <p className="text-[13px] text-muted-foreground">All alerts addressed! Keep monitoring.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`border rounded-[8px] p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all ${
                          alert.type === "hot" ? "bg-red-500/5 border-red-500/20" : "bg-primary/5 border-[#604ae3]/20"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img src={alert.avatar} className="h-9 w-9 rounded-full object-cover border border-border" alt="" />
                          <div>
                            <p className="text-[13px] font-bold text-foreground leading-tight">
                              {alert.buyer}{" "}
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ml-1.5 ${
                                alert.type === "hot" ? "bg-soft-danger text-danger" : "bg-primary/20 text-primary"
                              }`}>
                                {alert.score}% Hot
                              </span>
                            </p>
                            <p className="text-[12px] text-muted-foreground mt-1 font-medium">{alert.action}</p>
                            <span className="text-[10.5px] text-muted-foreground font-semibold mt-0.5 block">{alert.time}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1.5 self-end sm:self-center shrink-0">
                          {alert.type === "hot" ? (
                            <>
                              <button
                                type="button"
                                onClick={() => triggerToast(`Connecting WhatsApp pitch to ${alert.buyer}...`)}
                                className="bg-[#25d366] hover:bg-[#25d366]/90 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-[4px] flex items-center gap-0.5 transition-colors"
                              >
                                <i className="ri-whatsapp-line" /> Pitch
                              </button>
                              <button
                                type="button"
                                onClick={() => triggerToast(`Dialing agent portal for ${alert.buyer}...`)}
                                className="bg-primary hover:bg-primary/95 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-[4px] transition-colors"
                              >
                                Call
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                triggerToast(`Auto-Nurture campaign started for ${alert.buyer}!`);
                                handleDismissAlert(alert.id);
                              }}
                              className="bg-primary hover:bg-primary/95 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-[4px] transition-colors"
                            >
                              Auto-Nurture
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDismissAlert(alert.id)}
                            className="bg-muted/40 hover:bg-muted text-muted-foreground text-[11px] font-bold px-2 py-1.5 rounded-[4px] border border-border transition-colors"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Side: Campaign Controls */}
              <div className="lg:col-span-5 border border-border rounded-[8px] bg-muted/10 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-[12.5px] font-bold text-foreground">Automation Rules</h5>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoSmsEnabled}
                      onChange={() => setAutoSmsEnabled(!autoSmsEnabled)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#604ae3]"></div>
                    <span className="ml-2 text-[11px] font-bold text-muted-foreground uppercase">
                      {autoSmsEnabled ? "On" : "Off"}
                    </span>
                  </label>
                </div>

                <div className="bg-card border border-border rounded-[6px] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-foreground">Inactivity Rule</span>
                    <span className="badge bg-soft-success text-success text-[10px] font-bold px-1.5 py-0.2 rounded">
                      SMS Auto-Send
                    </span>
                  </div>
                  <p className="text-[11.5px] text-muted-foreground leading-snug">
                    If buyer does not view any listings for 7 consecutive days, automatically text them a personalized pocket listing.
                  </p>
                </div>

                {/* Metrics */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Campaign Response ROI
                  </span>
                  <div>
                    <div className="flex justify-between text-[11.5px] font-bold mb-1">
                      <span className="text-muted-foreground">Auto-Pitch Response Rate</span>
                      <span className="text-foreground">42.8%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-success" style={{ width: "42.8%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11.5px] font-bold mb-1">
                      <span className="text-muted-foreground">Re-activation Rate</span>
                      <span className="text-foreground">18.5%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-[#604ae3]" style={{ width: "18.5%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ── B2B SaaS Premium Feature: Commission Splits & Leaderboard ── */}
          <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.08)] mb-6 space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-3">
              <div>
                <span className="bg-[#604ae3]/10 text-[#604ae3] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-[4px] tracking-wider">
                  B2B SaaS Premium
                </span>
                <h4 className="text-[15.5px] font-bold text-foreground mt-1.5 flex items-center gap-1.5">
                  <iconify-icon icon="solar:calculator-bold-duotone" className="text-[20px] text-primary" />
                  Commission Splits & Agency Performance
                </h4>
                <p className="text-[12.5px] text-muted-foreground mt-0.5">
                  Manage agent compensation plans, splits caps, and track brokerage net splits automatically.
                </p>
              </div>

              {/* Tabs Switcher */}
              <div className="inline-flex items-center gap-1 bg-muted p-1 border border-border rounded-[6px] self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setCommissionTab("calculator")}
                  className={`px-3 py-1 rounded-[4px] text-[12px] font-bold transition-all ${
                    commissionTab === "calculator" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Splits Calculator
                </button>
                <button
                  type="button"
                  onClick={() => setCommissionTab("leaderboard")}
                  className={`px-3 py-1 rounded-[4px] text-[12px] font-bold transition-all ${
                    commissionTab === "leaderboard" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Agency Leaderboard
                </button>
              </div>
            </div>

            {commissionTab === "calculator" ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Inputs (Col-7) */}
                <div className="lg:col-span-7 space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Deal Value */}
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider block">
                        Property Sale Price ($)
                      </label>
                      <input
                        type="number"
                        value={dealVolume}
                        onChange={(e) => setDealVolume(Math.max(0, Number(e.target.value)))}
                        className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-1.5 outline-none focus:border-primary transition-colors font-semibold"
                      />
                    </div>

                    {/* Gross Commission Rate */}
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider block">
                        Base Commission Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        disabled={isDoubleEnded}
                        value={isDoubleEnded ? 6.0 : commissionRate}
                        onChange={(e) => setCommissionRate(Math.max(0, Number(e.target.value)))}
                        className="w-full text-[13px] border border-border bg-card disabled:bg-muted text-foreground rounded-[5px] px-3 py-1.5 outline-none focus:border-primary transition-colors font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    {/* Split Presets */}
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider block">
                        Split Preset
                      </label>
                      <div className="flex gap-1.5">
                        {[50, 70, 80, 90].map((rate) => (
                          <button
                            key={rate}
                            type="button"
                            onClick={() => setSplitRate(rate)}
                            className={`flex-1 py-1 rounded text-[12px] font-bold border transition-colors ${
                              splitRate === rate
                                ? "bg-primary text-white border-primary"
                                : "bg-card text-muted-foreground border-border hover:bg-muted/40"
                            }`}
                          >
                            {rate}/{100 - rate}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Double-Ended Toggle */}
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider block">
                        Transaction Type
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer border border-border bg-card rounded-[5px] px-3 py-1.5 hover:bg-muted/10 transition-colors">
                        <input
                          type="checkbox"
                          checked={isDoubleEnded}
                          onChange={() => setIsDoubleEnded(!isDoubleEnded)}
                          className="rounded border-border text-primary focus:ring-primary h-4 w-4 bg-muted/20"
                        />
                        <span className="text-[12.5px] font-semibold text-foreground">
                          Double-Ended Deal (6.0%)
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Split rate slider custom override */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[12px] font-bold text-muted-foreground uppercase">
                      <span>Custom Split Share (Agent vs Broker)</span>
                      <span className="text-primary">{splitRate}% Agent / {100 - splitRate}% Broker</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={splitRate}
                      onChange={(e) => setSplitRate(Number(e.target.value))}
                      className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </div>

                {/* Outputs (Col-5) */}
                <div className="lg:col-span-5 border border-border rounded-[8px] bg-muted/10 p-4 space-y-3.5">
                  <h5 className="text-[12.5px] font-bold text-foreground">Compensation Payout Breakdown</h5>
                  
                  {/* Calculations */}
                  {(() => {
                    const gross = (dealVolume * (isDoubleEnded ? 6.0 : commissionRate)) / 100;
                    const agentPayout = (gross * splitRate) / 100;
                    const brokerCut = gross - agentPayout;

                    return (
                      <div className="space-y-2.5 text-[13px] font-medium text-muted-foreground">
                        <div className="flex justify-between pb-1.5 border-b border-border">
                          <span>Gross Agency Commission:</span>
                          <span className="font-bold text-foreground">
                            {gross.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                          </span>
                        </div>
                        <div className="flex justify-between pb-1.5 border-b border-border">
                          <span className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-success block" /> Agent Share ({splitRate}%):
                          </span>
                          <span className="font-bold text-[#0acf97]">
                            {agentPayout.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                          </span>
                        </div>
                        <div className="flex justify-between pb-1.5 border-b border-border">
                          <span className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-primary block" /> Brokerage Share ({100 - splitRate}%):
                          </span>
                          <span className="font-bold text-primary">
                            {brokerCut.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                          </span>
                        </div>

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => triggerToast(`Commission transaction logged: ${agentPayout.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} added to payroll.`)}
                            className="w-full bg-[#0acf97] hover:bg-[#0acf97]/95 text-white text-[12.5px] font-bold py-2 rounded-[5px] flex items-center justify-center gap-1 transition-all active:scale-[0.98]"
                          >
                            <iconify-icon icon="solar:check-circle-broken" /> Log Deal & Submit splits
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            ) : (
              /* Leaderboard view */
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border text-[12.5px] font-semibold text-muted-foreground">
                        <th className="pb-2.5 pl-1">Agent</th>
                        <th className="pb-2.5">MTD Sales Volume</th>
                        <th className="pb-2.5">Gross Commission</th>
                        <th className="pb-2.5">Agent Payout</th>
                        <th className="pb-2.5">Annual Cap Progress ($100K Limit)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-[13px] font-medium">
                      {[
                        { name: "Ryan G. Harris", avatar: "/assets/images/users/avatar-1.jpg", volume: 1250000, gross: 75000, payout: 60000, cap: 100 },
                        { name: "Michael Coch", avatar: "/assets/images/users/avatar-2.jpg", volume: 950000, gross: 57000, payout: 39900, cap: 57 },
                        { name: "Danielle C. Thom", avatar: "/assets/images/users/avatar-3.jpg", volume: 800000, gross: 48000, payout: 33600, cap: 48 },
                        { name: "Julia V. Quincy", avatar: "/assets/images/users/avatar-5.jpg", volume: 650000, gross: 39000, payout: 27300, cap: 39 },
                      ].map((item, idx) => (
                        <tr key={idx} className="hover:bg-muted/10 transition-colors">
                          <td className="py-3 pl-1">
                            <div className="flex items-center gap-2.5">
                              <span className="font-bold text-muted-foreground w-4">#{idx+1}</span>
                              <img src={item.avatar} className="h-7 w-7 rounded-full object-cover border border-border" alt="" />
                              <span className="font-bold text-foreground">{item.name}</span>
                            </div>
                          </td>
                          <td className="py-3 text-foreground">{item.volume.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</td>
                          <td className="py-3 text-muted-foreground">{item.gross.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</td>
                          <td className="py-3 text-[#0acf97] font-bold">{item.payout.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</td>
                          <td className="py-3">
                            <div className="space-y-1 w-44">
                              <div className="flex justify-between text-[11px] font-bold">
                                <span>{item.cap}% met</span>
                                <span className="text-foreground">${item.cap}K</span>
                              </div>
                              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div className={`h-full ${item.cap === 100 ? "bg-success" : "bg-primary"}`} style={{ width: `${item.cap}%` }} />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Row 1: Funnel & Revenue */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Funnel */}
            <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.15)] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[16px] font-bold text-foreground">Sales Funnel</h4>
                <Dropdown
                  options={["Today", "This Month", "Years"]}
                  selected={funnelPeriod}
                  onSelect={setFunnelPeriod}
                />
              </div>
              <div className="h-[165px] flex items-center justify-center -mx-3">
                <SalesFunnelChart />
              </div>
              <div className="border-t border-border mt-3 bg-muted/30 p-2.5 rounded-[5px]">
                <div className="grid grid-cols-4 text-center">
                  <div className="border-r border-border">
                    <p className="text-[11.5px] text-muted-foreground mb-0.5">Visitors</p>
                    <p className="text-[14px] font-bold text-foreground">123.7k</p>
                  </div>
                  <div className="border-r border-border">
                    <p className="text-[11.5px] text-muted-foreground mb-0.5">Views</p>
                    <p className="text-[14px] font-bold text-foreground">167.1k</p>
                  </div>
                  <div className="border-r border-border">
                    <p className="text-[11.5px] text-muted-foreground mb-0.5">Leads</p>
                    <p className="text-[14px] font-bold text-foreground">89.7k</p>
                  </div>
                  <div>
                    <p className="text-[11.5px] text-muted-foreground mb-0.5">Market</p>
                    <p className="text-[14px] font-bold text-foreground">34.8k</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.15)]">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[16px] font-bold text-foreground">Total Revenue</h4>
                <Dropdown
                  options={["Today", "This Month", "Years"]}
                  selected={revenuePeriod}
                  onSelect={setRevenuePeriod}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[22px] font-bold text-foreground flex items-center gap-2 mb-1.5 leading-none">
                    $15,563.786
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-success bg-soft-success px-1.5 py-0.5 rounded">
                      <i className="ri-arrow-up-line" /> 4.53%
                    </span>
                  </h3>
                  <p className="text-[13px] text-muted-foreground font-medium">
                    Gained <span className="text-success font-semibold">$978.56</span> This Month !
                  </p>
                </div>
                <div className="h-12 w-12 rounded bg-muted/60 flex items-center justify-center text-primary flex-shrink-0">
                  <iconify-icon icon="solar:bag-2-broken" style={{ fontSize: "32px" }} />
                </div>
              </div>

              {/* Revenue Sources panel */}
              <div className="p-4 rounded-[6px] bg-muted/30 border border-border/80 mt-5">
                <h5 className="text-[14px] font-bold text-foreground mb-3">Revenue Sources</h5>
                <div className="grid grid-cols-4 gap-2 mb-3.5">
                  <div>
                    <p className="text-[11.5px] text-muted-foreground flex items-center gap-1.5 mb-1 font-medium">
                      <span className="h-2 w-2 rounded-full bg-primary block" /> Rent
                    </p>
                    <p className="text-[13px] font-bold text-foreground leading-none">$12,223.78</p>
                  </div>
                  <div>
                    <p className="text-[11.5px] text-muted-foreground flex items-center gap-1.5 mb-1 font-medium">
                      <span className="h-2 w-2 rounded-full bg-[#f8ac59] block" /> Sales
                    </p>
                    <p className="text-[13px] font-bold text-foreground leading-none">$56,131</p>
                  </div>
                  <div>
                    <p className="text-[11.5px] text-muted-foreground flex items-center gap-1.5 mb-1 font-medium">
                      <span className="h-2 w-2 rounded-full bg-[#0acf97] block" /> Broker Deal
                    </p>
                    <p className="text-[13px] font-bold text-foreground leading-none">$1,340.15</p>
                  </div>
                  <div>
                    <p className="text-[11.5px] text-muted-foreground flex items-center gap-1.5 mb-1 font-medium">
                      <span className="h-2 w-2 rounded-full bg-[#39afd1] block" /> Market
                    </p>
                    <p className="text-[13px] font-bold text-foreground leading-none">$600.46</p>
                  </div>
                </div>

                {/* Progress segmented bar */}
                <div className="h-2 bg-muted rounded-full flex overflow-hidden gap-[3px]">
                  <div className="bg-primary rounded-full" style={{ width: "40%" }} />
                  <div className="bg-[#f8ac59] rounded-full" style={{ width: "30%" }} />
                  <div className="bg-[#0acf97] rounded-full" style={{ width: "20%" }} />
                  <div className="bg-[#39afd1] rounded-full" style={{ width: "10%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Recent Agent Status */}
          <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.15)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-[16px] font-bold text-foreground mb-0.5">Recent Agent Status</h4>
                <p className="text-[12.5px] text-muted-foreground font-medium">More than $50K</p>
              </div>
              <Dropdown
                options={["Today", "This Month", "Years"]}
                selected={statusPeriod}
                onSelect={setStatusPeriod}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="border border-border/80 bg-muted/20 p-2.5 rounded-[5px] text-center">
                <p className="text-[12px] text-muted-foreground mb-1 font-medium">Today</p>
                <h5 className="text-[16px] font-bold text-foreground">$8,839</h5>
              </div>
              <div className="border border-border/80 bg-muted/20 p-2.5 rounded-[5px] text-center">
                <p className="text-[12px] text-muted-foreground mb-1 font-medium">This Month</p>
                <h5 className="text-[16px] font-bold text-foreground flex items-center justify-center gap-1">
                  $52,356
                  <span className="text-[#0acf97] text-[11px] font-semibold">0.2%</span>
                </h5>
              </div>
              <div className="border border-border/80 bg-muted/20 p-2.5 rounded-[5px] text-center">
                <p className="text-[12px] text-muted-foreground mb-1 font-medium">This Year</p>
                <h5 className="text-[16px] font-bold text-foreground flex items-center justify-center gap-1">
                  $78M
                  <span className="text-[#0acf97] text-[11px] font-semibold">0.1%</span>
                </h5>
              </div>
            </div>

            <div className="h-[330px] w-full -mx-2">
              <RecentAgentStatusChart />
            </div>
          </div>

          {/* Row 3: Collection of Rent & Sessions by Country */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Collection of Rent (col-span-5) */}
            <div className="lg:col-span-5 bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.15)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[16px] font-bold text-foreground">Collection of Rent</h4>
                  <Dropdown
                    options={["Today", "This Month", "Years"]}
                    selected={rentPeriod}
                    onSelect={setRentPeriod}
                  />
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[13px] text-muted-foreground mb-1 font-medium">Total</p>
                    <h3 className="text-[22px] font-bold text-foreground leading-none">$500.50K</h3>
                  </div>
                  <div className="h-12 w-12 rounded bg-muted/60 flex items-center justify-center text-primary flex-shrink-0">
                    <iconify-icon icon="solar:hand-money-broken" style={{ fontSize: "32px" }} />
                  </div>
                </div>

                {/* Animated stripes progress bar */}
                <div className="h-3.5 w-full bg-muted rounded-full overflow-hidden mb-4">
                  <div
                    className="progress-bar-animated-custom bg-[#0acf97] h-full rounded-full"
                    style={{
                      width: "50%",
                      backgroundImage:
                        "linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)",
                      backgroundSize: "1rem 1rem",
                    }}
                  />
                </div>

                <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                  <div>
                    <p className="text-[13px] text-[#0acf97] font-semibold mb-1">Collected</p>
                    <h4 className="text-[18px] font-bold text-foreground leading-none">$250.50K</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] text-muted-foreground font-semibold mb-1">Pending</p>
                    <h4 className="text-[18px] font-bold text-foreground leading-none">$250.00K</h4>
                  </div>
                </div>
              </div>

              {/* Tenants Due row */}
              <div className="flex items-center justify-between bg-muted/30 border border-border/80 p-3 rounded-[5px] mt-1">
                <div>
                  <h5 className="text-[13px] font-bold text-foreground">Tenants with invoice due</h5>
                  <div className="flex -space-x-2 mt-2">
                    {["avatar-4.jpg", "avatar-5.jpg", "avatar-3.jpg", "avatar-6.jpg", "avatar-7.jpg"].map((av, idx) => (
                      <img
                        key={idx}
                        src={`/assets/images/users/${av}`}
                        alt="Tenant Avatar"
                        className="w-7 h-7 rounded-full border-2 border-card object-cover"
                      />
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  id="send-reminder-btn"
                  className="bg-primary hover:bg-primary/95 text-white text-[12px] font-bold px-3 py-2 rounded-[5px] transition-colors"
                >
                  Send Reminder
                </button>
              </div>
            </div>

            {/* Sessions by Country (col-span-7) */}
            <div className="lg:col-span-7 bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.15)] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[16px] font-bold text-foreground">Sessions by Country</h4>
                <Dropdown
                  options={["U.S.A", "Russia", "China", "Canada"]}
                  selected={countryRegion}
                  onSelect={setCountryRegion}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                {/* Map widget column */}
                <div className="md:col-span-7">
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="h-11 w-11 rounded bg-muted/60 flex items-center justify-center text-primary flex-shrink-0">
                      <iconify-icon icon="solar:user-rounded-broken" style={{ fontSize: "28px" }} />
                    </div>
                    <div>
                      <p className="text-[18px] font-bold text-foreground leading-none">145.678</p>
                      <small className="text-[11.5px] text-muted-foreground font-medium">(Total Visitors)</small>
                    </div>
                  </div>

                  <div className="h-[210px] w-full relative">
                    <WorldMap />
                  </div>
                </div>

                {/* Country details column */}
                <div className="md:col-span-5 space-y-4">
                  <div className="p-3 bg-muted/20 border border-border/80 rounded-[5px] space-y-3">
                    {/* United States */}
                    <div>
                      <div className="flex items-center justify-between text-[12.5px] font-semibold text-foreground mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <iconify-icon icon="circle-flags:us" style={{ fontSize: "14px" }} />
                          United States
                        </span>
                        <span>659k</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-secondary rounded-full" style={{ width: "82.05%" }} />
                        </div>
                        <span className="text-[11px] font-semibold text-muted-foreground w-10 text-right">82.05%</span>
                      </div>
                    </div>

                    {/* Russia */}
                    <div>
                      <div className="flex items-center justify-between text-[12.5px] font-semibold text-foreground mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <iconify-icon icon="circle-flags:ru" style={{ fontSize: "14px" }} />
                          Russia
                        </span>
                        <span>485k</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-[#39afd1] rounded-full" style={{ width: "70.5%" }} />
                        </div>
                        <span className="text-[11px] font-semibold text-muted-foreground w-10 text-right">70.5%</span>
                      </div>
                    </div>

                    {/* China */}
                    <div>
                      <div className="flex items-center justify-between text-[12.5px] font-semibold text-foreground mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <iconify-icon icon="circle-flags:cn" style={{ fontSize: "14px" }} />
                          China
                        </span>
                        <span>355k</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-[#f8ac59] rounded-full" style={{ width: "65.8%" }} />
                        </div>
                        <span className="text-[11px] font-semibold text-muted-foreground w-10 text-right">65.8%</span>
                      </div>
                    </div>

                    {/* Canada */}
                    <div>
                      <div className="flex items-center justify-between text-[12.5px] font-semibold text-foreground mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <iconify-icon icon="circle-flags:ca" style={{ fontSize: "14px" }} />
                          Canada
                        </span>
                        <span>204k</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-[#0acf97] rounded-full" style={{ width: "55.8%" }} />
                        </div>
                        <span className="text-[11px] font-semibold text-muted-foreground w-10 text-right">55.8%</span>
                      </div>
                    </div>

                    <div className="pt-1.5 text-center border-t border-border/80">
                      <a href="#!" className="text-primary text-[12px] font-bold hover:underline inline-flex items-center gap-0.5">
                        Add Other <i className="ri-add-line" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (col-span-3) */}
        <div className="xl:col-span-3 space-y-6">
          {/* Card 1: Top Agents showcase */}
          <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.15)]">
            <h4 className="text-[16px] font-bold text-foreground mb-4">Top Agents</h4>
            <div className="bg-primary position-relative rounded-[6px] p-2 overflow-hidden text-center">
              <img
                src="/assets/images/agent-1.png"
                alt="Top Agent"
                className="w-full h-auto rounded-[4px] object-cover"
              />
              <div className="flex items-center justify-between bg-white/20 p-3 mt-2.5 rounded-[5px] text-left">
                <div>
                  <a href="#!" className="text-white font-bold text-[14.5px] hover:underline block leading-tight">
                    Lahomes Group , Pvt Ltd
                  </a>
                  <p className="text-[11.5px] text-white/70 font-semibold mt-0.5">Markova , USA</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex text-[#f1b53d] gap-0.5">
                      <i className="ri-star-fill text-[15px]" />
                      <i className="ri-star-fill text-[15px]" />
                      <i className="ri-star-fill text-[15px]" />
                      <i className="ri-star-fill text-[15px]" />
                      <i className="ri-star-half-line text-[15px]" />
                    </div>
                    <span className="text-white text-[12px] font-semibold">4.5 Rating</span>
                  </div>
                </div>
                <a
                  href="#!"
                  className="h-8 w-8 rounded-full bg-white/25 hover:bg-white/35 flex items-center justify-center text-white transition-colors"
                >
                  <i className="ri-arrow-right-line text-[16px]" />
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: Goals */}
          <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.15)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[16px] font-bold text-foreground">Goals</h4>
              <a href="#!" className="text-muted-foreground hover:text-foreground text-[18px] transition-colors">
                <i className="ri-settings-4-line" />
              </a>
            </div>

            <div className="h-[240px] flex items-center justify-center -my-3">
              <AgentGoalsChart />
            </div>

            <div>
              <h5 className="text-[13.5px] font-bold text-foreground mb-3">Income Statistic</h5>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded bg-muted/60 flex items-center justify-center text-primary flex-shrink-0">
                    <iconify-icon icon="solar:wallet-money-broken" style={{ fontSize: "20px" }} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-foreground leading-none">$12,167</p>
                    <small className="text-[11px] text-muted-foreground">From June</small>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 justify-end">
                  <div className="h-9 w-9 rounded bg-muted/60 flex items-center justify-center text-primary flex-shrink-0">
                    <iconify-icon icon="solar:wallet-money-broken" style={{ fontSize: "20px" }} />
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] font-bold text-foreground leading-none">$14,900</p>
                    <small className="text-[11px] text-muted-foreground">From July</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Recent Join Agent */}
          <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.15)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-[16px] font-bold text-foreground">Recent Join Agent</h4>
                  <p className="text-[12px] text-muted-foreground font-semibold mt-0.5">190 Agent Join</p>
                </div>
                <a href="#!" className="text-muted-foreground hover:text-foreground text-[18px] transition-colors">
                  <i className="ri-edit-box-line" />
                </a>
              </div>

              <div className="space-y-4">
                {/* Agent 1 */}
                <div className="flex items-center justify-between border-b border-border pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/assets/images/users/avatar-1.jpg"
                      alt="Ryan G. Harris"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div className="leading-tight">
                      <a href="#!" className="text-[13px] font-bold text-foreground hover:text-primary transition-colors block">
                        Ryan G. Harris
                      </a>
                      <span className="text-[11px] text-muted-foreground font-medium block">
                        ryangharris@jourrapide.com
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-bold">May 2024</span>
                </div>

                {/* Agent 2 */}
                <div className="flex items-center justify-between border-b border-border pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/assets/images/users/avatar-2.jpg"
                      alt="Michael Coch"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div className="leading-tight">
                      <a href="#!" className="text-[13px] font-bold text-foreground hover:text-primary transition-colors block">
                        Michael Coch
                      </a>
                      <span className="text-[11px] text-muted-foreground font-medium block">
                        michaelbco@armyspy.com
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-bold">May 2024</span>
                </div>

                {/* Agent 3 */}
                <div className="flex items-center justify-between border-b border-border pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/assets/images/users/avatar-3.jpg"
                      alt="Danielle C. Thom"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div className="leading-tight">
                      <a href="#!" className="text-[13px] font-bold text-foreground hover:text-primary transition-colors block">
                        Danielle C. Thom
                      </a>
                      <span className="text-[11px] text-muted-foreground font-medium block">
                        danielompson@dayrep.com
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-bold">May 2024</span>
                </div>

                {/* Agent 4 */}
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/assets/images/users/avatar-5.jpg"
                      alt="Julia V. Quincy"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div className="leading-tight">
                      <a href="#!" className="text-[13px] font-bold text-foreground hover:text-primary transition-colors block">
                        Julia V. Quincy
                      </a>
                      <span className="text-[11px] text-muted-foreground font-medium block">
                        juliabquincy@armyspy.com
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-bold">May 2024</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="w-full mt-5 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-[12px] py-2 rounded-[5px] transition-all"
            >
              View All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
