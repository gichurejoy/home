"use client";

import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import { 
  Building2, 
  Users, 
  UserCheck, 
  DollarSign, 
  Plus, 
  Compass, 
  ShieldCheck, 
  Settings 
} from "lucide-react";

export default function WelcomePage() {
  const { agencyProfile, sessionRole, properties, agents, customers } = useAppStore();

  const quickLinks = [
    {
      title: "Properties Directory",
      desc: "Browse, filter, and compare active listings and pocket listings.",
      href: "/properties/grid",
      icon: Building2,
      color: "bg-[#604ae3]/10 text-[#604ae3]",
    },
    {
      title: "Agents Directory",
      desc: "Manage brokerage agents, commission plans, and performance metrics.",
      href: "/agents/grid",
      icon: UserCheck,
      color: "bg-[#0acf97]/10 text-[#0acf97]",
    },
    {
      title: "Customer CRM",
      desc: "Manage customer leads, showing tours, and active preferences.",
      href: "/customers/grid",
      icon: Users,
      color: "bg-[#39afd1]/10 text-[#39afd1]",
    },
    {
      title: "CommissionsSplit & Ledger",
      desc: "Monitor financial ledger entries, pipelines, and brokerage payouts.",
      href: "/transactions",
      icon: DollarSign,
      color: "bg-[#f1b53d]/10 text-[#f1b53d]",
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb />

      {/* ── Welcome Banner ─────────────────────────────────────── */}
      <div 
        className="relative rounded-2xl p-6 sm:p-8 text-white overflow-hidden shadow-lg border border-white/10"
        style={{ background: "linear-gradient(135deg, #604ae3 0%, #4535c1 100%)" }}
      >
        {/* Background Decorative Rings */}
        <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-white/5 border border-white/10 pointer-events-none" />
        <div className="absolute top-20 -right-6 h-28 w-28 rounded-full bg-white/5 border border-white/10 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/5 border border-white/10 pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[12px] font-bold tracking-wider uppercase">
            <Compass className="h-3.5 w-3.5" /> Welcome to {agencyProfile.name || "waveron"}
          </span>
          <h1 className="text-[26px] sm:text-[34px] font-extrabold leading-tight tracking-tight">
            Manage listings, track splits, and scale your agency.
          </h1>
          <p className="text-white/80 text-[14px] sm:text-[15px] leading-relaxed">
            Welcome back! You are logged in as a <span className="font-bold text-white underline decoration-wavy underline-offset-4">{sessionRole}</span>. 
            waveron streamlines real estate CRM management, automated splits auditing, and pocket listing security in one place.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link 
              href="/properties/add" 
              className="bg-[#0acf97] hover:bg-[#09b986] text-white text-[13px] font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" /> Create New Listing
            </Link>
            <Link 
              href="/settings/rbac" 
              className="bg-white/20 hover:bg-white/30 text-white text-[13px] font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm transition-all"
            >
              <ShieldCheck className="h-4 w-4" /> Review Access Matrix
            </Link>
          </div>
        </div>
      </div>

      {/* ── Agency Stats At A Glance ───────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-[#604ae3]/10 text-[#604ae3] flex items-center justify-center">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[12.5px] text-muted-foreground font-semibold uppercase tracking-wider">Properties</p>
            <h3 className="text-[20px] font-black text-foreground mt-0.5">{properties.length} Active</h3>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-[#0acf97]/10 text-[#0acf97] flex items-center justify-center">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[12.5px] text-muted-foreground font-semibold uppercase tracking-wider">Agents</p>
            <h3 className="text-[20px] font-black text-foreground mt-0.5">{agents.length} Registered</h3>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-[#39afd1]/10 text-[#39afd1] flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[12.5px] text-muted-foreground font-semibold uppercase tracking-wider">Customers</p>
            <h3 className="text-[20px] font-black text-foreground mt-0.5">{customers.length} Leads</h3>
          </div>
        </div>
      </div>

      {/* ── Explorer Cards Grid ────────────────────────────────── */}
      <div>
        <h3 className="text-[16px] font-bold text-foreground mb-4">Core Feature Directories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickLinks.map((card, i) => {
            const Icon = card.icon;
            return (
              <div 
                key={i} 
                className="bg-card border border-border hover:border-primary/30 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`h-10 w-10 rounded-lg ${card.color} flex items-center justify-center mb-4`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-[15.5px] font-bold text-foreground">{card.title}</h4>
                  <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-border mt-4 flex justify-end">
                  <Link 
                    href={card.href} 
                    className="text-[13px] font-semibold text-primary hover:underline flex items-center gap-0.5"
                  >
                    Enter Directory &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Support & Configuration Box ─────────────────────────── */}
      <div className="bg-card border border-border rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-[15px] font-bold text-foreground flex items-center gap-1.5">
            <Settings className="h-4.5 w-4.5 text-muted-foreground" /> Need help getting configured?
          </h4>
          <p className="text-[13px] text-muted-foreground max-w-lg leading-relaxed">
            Take a look at our interactive FAQs guide to understand how to adjust brokerage commission templates, assign split policies, and track regulatory audit logs.
          </p>
        </div>
        <Link 
          href="/pages/faqs" 
          className="bg-muted hover:bg-muted-foreground/15 text-foreground text-[13px] font-bold px-4 py-2 rounded-lg transition-colors shrink-0"
        >
          View FAQs Accordion
        </Link>
      </div>
    </div>
  );
}
