"use client";

import { useState } from "react";
import Link from "next/link";

interface Plan {
  id: "starter" | "grow" | "enterprise";
  name: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

const mockPlans: Plan[] = [
  {
    id: "starter",
    name: "Starter (Solo)",
    priceMonthly: 49,
    priceYearly: 39,
    description: "Perfect for independent agents managing a personal listing portfolio.",
    features: [
      "1 Agent Account",
      "50 Active Leads",
      "Basic CRM & Invoicing",
      "Standard Mapbox Integration",
      "Email Support",
    ],
  },
  {
    id: "grow",
    name: "Grow (Boutique)",
    priceMonthly: 199,
    priceYearly: 159,
    description: "Designed for boutique brokerages and collaborative agent teams.",
    features: [
      "Up to 10 Agents",
      "Unlimited Leads",
      "AI Virtual Staging & Copilot",
      "Double-Ended Pocket Matcher",
      "Live Showing Tour Feedback Feed",
      "Inactivity Anti-Ghosting Alerts",
      "Priority 24/7 Support",
    ],
    isPopular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise (Agency)",
    priceMonthly: 499,
    priceYearly: 399,
    description: "For established agencies requiring full white-label brand autonomy.",
    features: [
      "Unlimited Agents",
      "Custom Domain (seattle.yourportal.com)",
      "Dynamic Accent Color Customizer",
      "Logo & Title Custom Branding",
      "MLS Feed Integration (RETS/RESO)",
      "WhatsApp Business API Integration",
      "Dedicated Account Manager",
    ],
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [currentTier, setCurrentTier] = useState<"starter" | "grow" | "enterprise">("starter");
  
  // Checkout Modal State
  const [checkoutPlan, setCheckoutPlan] = useState<Plan | null>(null);
  const [cardNumber, setCardNumber] = useState("4111 2222 3333 4444");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("123");
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const handleOpenCheckout = (plan: Plan) => {
    if (plan.id === currentTier) return;
    setCheckoutPlan(plan);
    setCheckoutSuccess(false);
    setIsProcessing(false);
  };

  const handleCompleteCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setCheckoutSuccess(true);
      
      setTimeout(() => {
        if (checkoutPlan) {
          setCurrentTier(checkoutPlan.id);
        }
        setCheckoutPlan(null);
      }, 1500);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-[20px] font-bold text-foreground">SaaS Subscription Licensing</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Package and monetize your portal by offering tiered operations software to real estate brokerages.
          </p>
        </div>
        <ol className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">Pages</Link>
          </li>
          <li><i className="ri-arrow-right-s-line text-[12px]" /></li>
          <li className="text-primary font-medium">Pricing Plans</li>
        </ol>
      </div>

      {/* Billing Switcher */}
      <div className="flex flex-col items-center justify-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-1 bg-muted/60 p-1 border border-border rounded-[8px]">
          <button
            type="button"
            onClick={() => setBillingPeriod("monthly")}
            className={`px-4 py-1.5 rounded-[5px] text-[13px] font-bold transition-all ${
              billingPeriod === "monthly"
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingPeriod("yearly")}
            className={`px-4 py-1.5 rounded-[5px] text-[13px] font-bold transition-all flex items-center gap-1.5 ${
              billingPeriod === "yearly"
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Yearly
            <span className="bg-[#0acf97] text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-[4px] tracking-wide">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto pt-4">
        {mockPlans.map((plan) => {
          const isCurrent = plan.id === currentTier;
          const price = billingPeriod === "monthly" ? plan.priceMonthly : plan.priceYearly;
          
          return (
            <div
              key={plan.id}
              className={`bg-card border rounded-[12px] p-6 flex flex-col justify-between relative shadow-md hover:shadow-xl transition-all duration-300 ${
                plan.isPopular ? "border-primary ring-1 ring-primary/30" : "border-border"
              }`}
            >
              {/* Popular ribbon */}
              {plan.isPopular && (
                <span className="absolute top-0 right-6 -translate-y-1/2 bg-primary text-white text-[10.5px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h4 className="text-[17px] font-extrabold text-foreground">{plan.name}</h4>
                  <p className="text-[12.5px] text-muted-foreground mt-1.5 leading-snug">{plan.description}</p>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-1 py-2 border-y border-border">
                  <span className="text-[32px] font-black text-foreground">${price}</span>
                  <span className="text-[13px] text-muted-foreground font-semibold">/ month</span>
                  {billingPeriod === "yearly" && (
                    <span className="text-[11px] text-success font-semibold ml-2">(billed annually)</span>
                  )}
                </div>

                {/* Features list */}
                <ul className="space-y-2.5 pt-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[13px] text-foreground/80 font-medium">
                      <i className="ri-checkbox-circle-fill text-success text-[16px] shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => handleOpenCheckout(plan)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 px-4 rounded-[6px] text-[13.5px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isCurrent
                      ? "bg-soft-success text-success border border-[#0acf97]/20"
                      : plan.isPopular
                      ? "bg-primary hover:bg-primary/95 text-white active:scale-[0.98]"
                      : "bg-muted/40 hover:bg-muted text-foreground border border-border active:scale-[0.98]"
                  }`}
                >
                  {isCurrent ? (
                    <>
                      <i className="ri-check-line text-[16px]" /> Active Plan
                    </>
                  ) : (
                    "Upgrade Plan"
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Checkout Simulation Modal ─────────────────────────────── */}
      {checkoutPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
            onClick={() => setCheckoutPlan(null)}
          />

          {/* Dialog Container */}
          <div className="relative bg-card border border-border rounded-[8px] w-full max-w-sm p-5 shadow-2xl z-10 animate-in zoom-in-95 duration-150 space-y-4">
            
            <div className="flex justify-between items-start border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-[4px] tracking-wider">
                  Secure Checkout
                </span>
                <h4 className="text-[15px] font-bold text-foreground mt-1.5">
                  Subscribe to {checkoutPlan.name}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutPlan(null)}
                className="text-muted-foreground hover:text-foreground text-[20px]"
              >
                <i className="ri-close-line" />
              </button>
            </div>

            {/* Bill Summary */}
            <div className="bg-muted/30 border border-border rounded p-3 flex justify-between items-center text-[13px]">
              <span className="font-semibold text-muted-foreground">Due Now ({billingPeriod})</span>
              <span className="font-bold text-foreground">
                ${billingPeriod === "monthly" ? checkoutPlan.priceMonthly : checkoutPlan.priceYearly} / mo
              </span>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleCompleteCheckout} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Credit Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                    className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] pl-9 pr-3 py-2 outline-none focus:border-primary transition-colors font-semibold"
                  />
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <i className="ri-bank-card-line text-[16px]" />
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Expiration
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    required
                    placeholder="MM/YY"
                    className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors text-center font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                    CVC
                  </label>
                  <input
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    required
                    placeholder="123"
                    className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary transition-colors text-center font-semibold"
                  />
                </div>
              </div>

              {/* Status info */}
              {isProcessing && (
                <div className="text-[12px] text-primary bg-primary/10 border border-primary/20 p-2.5 rounded flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin shrink-0" />
                  <span>Processing secure checkout transaction...</span>
                </div>
              )}

              {checkoutSuccess && (
                <div className="text-[12px] text-success bg-soft-success border border-[#0acf97]/20 p-2.5 rounded flex items-center gap-1.5">
                  <i className="ri-checkbox-circle-line text-[16px]" />
                  <span>Subscription activated! Welcome to the new tier.</span>
                </div>
              )}

              {/* Actions */}
              {!isProcessing && !checkoutSuccess && (
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setCheckoutPlan(null)}
                    className="flex-1 bg-muted/40 hover:bg-muted text-foreground text-[13px] font-bold py-2 rounded-[5px] border border-border transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#0acf97] hover:bg-[#0acf97]/95 text-white text-[13px] font-bold py-2 rounded-[5px] transition-colors"
                  >
                    Authorize Payment
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
