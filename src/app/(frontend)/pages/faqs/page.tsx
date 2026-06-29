"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ChevronDown, HelpCircle, Search, MessageSquare, Info } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

export default function FAQsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState<string | null>("general-0");

  const categories: FAQCategory[] = [
    {
      title: "General Platform",
      items: [
        {
          q: "What is waveron Real Estate Portal?",
          a: "waveron is a real estate CRM and brokerage commission management system. It enables managing agents, listings, buyers, transactions, and automated agent commission payout split auditing in a unified dashboard.",
        },
        {
          q: "How do I change the brand name or logo?",
          a: "You can customize the brand styling dynamically. Open the settings drawer by clicking the cog icon in the topbar or the 'Theme Settings' panel. From there, you can change the brand color scheme, sidebar size, and menu layouts.",
        },
        {
          q: "How does the setup wizard work?",
          a: "Upon first log in, you will be guided through a 5-step wizard to setup your branding profile, create a default split policy, register your first agent, list your first property, and record your first deal.",
        },
      ],
    },
    {
      title: "Commissions & Split Calculations",
      items: [
        {
          q: "How are agent commission splits calculated?",
          a: "Payout splits are automatically calculated based on the agent's assigned split plan. For example, on an 80/20 plan, the agent receives 80% of the gross commission, and the brokerage receives 20%. You can override these split percentages directly in the Record Deal Modal.",
        },
        {
          q: "What is the Brokerage Cap limit?",
          a: "The annual cap limit is the maximum commission amount an agent pays to the brokerage in splits during a calendar year. Once the agent's accumulated brokerage cuts meet or exceed this cap, they transition to a 100% payout split automatically.",
        },
        {
          q: "Can I record a double-ended deal?",
          a: "Yes! A double-ended deal occurs when the same agent represents both the buyer and the seller. Checking the 'Double-Ended' box in the Record Deal modal automatically increases the commission rate to 6.0% and applies the agent splits on the entire volume.",
        },
      ],
    },
    {
      title: "Compliance & Security Matrix",
      items: [
        {
          q: "What is Role-Based Access Control (RBAC)?",
          a: "RBAC limits dashboard capabilities based on roles (Super Admin, Broker, Agent, Viewer). You can review the permissions matrix page under Custom Pages -> User Roles Matrix to toggle specific read, write, or delete configurations.",
        },
        {
          q: "Where can I view regulatory change logs?",
          a: "Brokers can monitor all administrative changes (like adding agents, updating splits, or deleting records) on the Security Audit Logs page. Every log records the user, action category, components, IP address, and timestamp.",
        },
      ],
    },
  ];

  const handleToggle = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  // Filter items based on search term
  const filteredCategories = categories.map((cat, catIdx) => {
    const items = cat.items.filter(
      (item) =>
        item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.a.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return { ...cat, items, catIdx };
  }).filter((cat) => cat.items.length > 0);

  return (
    <div className="space-y-6">
      <Breadcrumb />

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="text-center max-w-xl mx-auto py-4">
        <h1 className="text-[22px] sm:text-[28px] font-black text-foreground">Frequently Asked Questions</h1>
        <p className="text-[13.5px] text-muted-foreground mt-1.5 leading-relaxed">
          Learn how to customize commission plans, audit ledger splits, manage CRM pipelines, and configure role settings.
        </p>

        {/* Search Input */}
        <div className="relative mt-6 max-w-md mx-auto">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-[13.5px] focus:outline-none focus:border-primary transition-colors text-foreground placeholder-muted-foreground shadow-sm"
            placeholder="Search FAQs (e.g. splits, cap)..."
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        </div>
      </div>

      {/* ── Accordion List ─────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto space-y-6">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-xl shadow-sm">
            <Info className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <h4 className="text-[15px] font-bold text-foreground">No FAQs Match Your Search</h4>
            <p className="text-[12.5px] text-muted-foreground mt-1">Try using a different keyword, like "commission" or "branding".</p>
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <div key={cat.title} className="space-y-3">
              <h4 className="text-[14px] font-extrabold uppercase tracking-wider text-muted-foreground pl-1">
                {cat.title}
              </h4>
              <div className="space-y-2.5">
                {cat.items.map((item, itemIdx) => {
                  const id = `${cat.catIdx}-${itemIdx}`;
                  const isOpen = openIndex === id;
                  return (
                    <div 
                      key={itemIdx}
                      className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:border-border/80 transition-colors"
                    >
                      <button
                        onClick={() => handleToggle(id)}
                        className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-[14px] sm:text-[14.5px] text-foreground hover:bg-muted/10 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <HelpCircle className="h-4.5 w-4.5 text-primary shrink-0" />
                          {item.q}
                        </span>
                        <ChevronDown 
                          className={`h-4.5 w-4.5 text-muted-foreground shrink-0 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      
                      {isOpen && (
                        <div className="px-5 pb-4 pt-1 border-t border-border bg-muted/5">
                          <p className="text-[13px] text-muted-foreground leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Contact Support ────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto bg-[#604ae3]/5 border border-[#604ae3]/10 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-[#604ae3]/10 rounded-full flex items-center justify-center text-[#604ae3]">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h5 className="font-bold text-[14.5px] text-foreground">Still have questions?</h5>
            <p className="text-[12.5px] text-muted-foreground">Contact our support center or start a chat with a broker.</p>
          </div>
        </div>
        <button 
          onClick={() => window.location.href="/chats"}
          className="bg-[#604ae3] hover:bg-[#503bc7] text-white text-[12.5px] font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          Open Chat Inbox
        </button>
      </div>
    </div>
  );
}
