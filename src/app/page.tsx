"use client";

import { useState } from "react";
import Link from "next/link";

export default function AtelierLandingPage() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activePreviewStyle, setActivePreviewStyle] = useState<'scandi' | 'office' | 'rustic' | 'japandi'>('scandi');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Staged styles image definitions
  const previewImages = {
    scandi: "/assets/images/properties/p-4.jpg",
    office: "/assets/images/properties/p-11.jpg",
    rustic: "/assets/images/properties/p-12.jpg",
    japandi: "/assets/images/properties/p-3.jpg",
  };

  const styleLabels = {
    scandi: "Scandinavian Minimalist",
    office: "Creative Home Office",
    rustic: "Cozy Rustic Warmth",
    japandi: "Japandi Editorial Serenity",
  };

  const pricingPlans = [
    {
      name: "Home Plan",
      priceMonthly: 19,
      priceAnnual: 15,
      desc: "Perfect for homeowners embarking on single-room makeovers.",
      features: [
        "20 AI room renders per month",
        "10 style exploration presets",
        "High-resolution exports (PNG)",
        "Standard material palette lookup",
        "Email support",
      ],
      cta: "Start Free Trial",
    },
    {
      name: "Studio Plan",
      priceMonthly: 49,
      priceAnnual: 39,
      desc: "Designed for interior makers managing multiple client properties.",
      features: [
        "60 AI room renders per month",
        "Unlimited style presets",
        "Project organization folders",
        "High-definition export specs",
        "Priority email support",
      ],
      cta: "Get Studio License",
      popular: true,
    },
    {
      name: "Pro Plan",
      priceMonthly: 99,
      priceAnnual: 79,
      desc: "Built for scaling real estate brokerages and developer teams.",
      features: [
        "120 AI room renders per month",
        "Unlimited style explorations",
        "Collaborative access (up to 5 seats)",
        "Custom branding & PDF print formats",
        "24/7 dedicated support desk",
      ],
      cta: "Upgrade to Pro Enterprise",
    },
  ];

  const faqItems = [
    {
      question: "How does the AI room visualization tool work?",
      answer: "By uploading a single photo or wide-angle scan of your room, our neural engine analyzes structural boundaries, natural light direction, and window positions. Within seconds, it replaces spatial objects with coordinated, designer-approved furniture arrangements based on your chosen design style preset.",
    },
    {
      question: "Can I staging/design my own custom color palettes?",
      answer: "Absolutely. Under our Studio and Pro plans, you can feed custom hex codes or select from curated palettes. The AI color-matches materials, textiles, wall coatings, and cabinetry accents to match your exact brand guidelines or project specs.",
    },
    {
      question: "What are credits and how do they renew?",
      answer: "Each generated design render counts as one credit. Credits are loaded onto your account monthly at the start of your billing cycle. Unused credits do not roll over, but you can purchase booster packs if you exceed your monthly allowance.",
    },
    {
      question: "Is there a trial period available?",
      answer: "Yes, you can register and receive 3 complimentary room renders to test our AI spatial visualizer. No credit card is required to sign up.",
    },
  ];

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#1A1A1A] font-sans antialiased overflow-x-hidden">
      {/* Dynamic Font Import */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        
        .font-serif-editorial {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
        }
        .font-sans-premium {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
      `}} />

      {/* ── Navigation Header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#FBFBFA]/85 backdrop-blur-md border-b border-[#1A1A1A]/5 px-6 py-4 flex items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <span className="h-7 w-7 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white font-serif-editorial text-[18px]">A</span>
          <span className="font-sans-premium font-bold tracking-wider text-[15px] uppercase">Atelier AI</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-[#1A1A1A]/80 tracking-wide">
          <a href="#how-it-works" className="hover:text-[#1A1A1A] transition-colors">How It Works</a>
          <a href="#slider-preview" className="hover:text-[#1A1A1A] transition-colors">Staging Sandbox</a>
          <a href="#pricing" className="hover:text-[#1A1A1A] transition-colors">Pricing Plans</a>
          <a href="#faqs" className="hover:text-[#1A1A1A] transition-colors">Support FAQs</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/auth/signin"
            className="text-[12.5px] font-bold text-[#1A1A1A]/70 hover:text-[#1A1A1A] px-4 py-2 transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="bg-[#1A1A1A] hover:bg-[#1A1A1A]/95 text-white text-[12.5px] font-extrabold px-4 py-2 rounded-full shadow-sm transition-all active:scale-95"
          >
            Launch Portal
          </Link>
        </div>
      </header>

      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="relative py-16 lg:py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6 text-left">
          <span className="bg-[#1A1A1A]/5 text-[#1A1A1A] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-widest inline-block">
            AI Interior Design & Virtual Staging
          </span>
          
          <h1 className="text-[44px] sm:text-[62px] leading-[1.05] font-light tracking-tight text-[#1A1A1A]">
            Imagine your room <br />
            <span className="font-serif-editorial text-[#B58E3D] text-[48px] sm:text-[70px]">redesigned</span> in seconds
          </h1>
          
          <p className="text-[14.5px] sm:text-[16px] text-[#1A1A1A]/75 leading-relaxed max-w-lg font-medium">
            Atelier AI merges high-end editorial aesthetics with warm visual staging components. 
            Upload a photo to see custom materials, lighting directions, and layout arrangements draft in real time.
          </p>

          <div className="flex flex-wrap gap-3.5 pt-2">
            <Link
              href="/dashboard"
              className="bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white text-[13.5px] font-bold px-6 py-3 rounded-full flex items-center gap-1.5 shadow transition-all active:scale-[0.98]"
            >
              Start Free Transformation <i className="ri-arrow-right-line" />
            </Link>
            <a
              href="#slider-preview"
              className="border border-[#1A1A1A]/20 hover:bg-[#1A1A1A]/5 text-[#1A1A1A] text-[13.5px] font-bold px-6 py-3 rounded-full transition-all"
            >
              Explore Sandbox
            </a>
          </div>

          {/* Social Proof stats */}
          <div className="pt-8 border-t border-[#1A1A1A]/10 grid grid-cols-3 gap-6 text-[12px] font-bold">
            <div>
              <p className="text-[20px] font-black text-[#B58E3D]">12k+</p>
              <p className="text-[#1A1A1A]/65 mt-0.5">Rooms Rendered</p>
            </div>
            <div className="border-l border-[#1A1A1A]/10 pl-6">
              <p className="text-[20px] font-black text-[#B58E3D]">99.2%</p>
              <p className="text-[#1A1A1A]/65 mt-0.5">Client Wow-Rate</p>
            </div>
            <div className="border-l border-[#1A1A1A]/10 pl-6">
              <p className="text-[20px] font-black text-[#B58E3D]">&lt; 3s</p>
              <p className="text-[#1A1A1A]/65 mt-0.5">Computation Time</p>
            </div>
          </div>
        </div>

        {/* Hero Interactive Preview Frame (Col 6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="border border-[#1A1A1A]/10 bg-white p-2 rounded-2xl shadow-xl">
            <div className="aspect-[4/3] rounded-xl overflow-hidden relative group">
              <img
                src={previewImages[activePreviewStyle]}
                className="w-full h-full object-cover transition-all duration-700"
                alt="AI Staging View"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 text-white text-left">
                <span className="text-[9.5px] uppercase font-bold tracking-widest bg-white/20 backdrop-blur-md px-2 py-0.5 rounded">Active Preset</span>
                <h3 className="text-[15.5px] font-black mt-1 leading-tight">{styleLabels[activePreviewStyle]}</h3>
              </div>
            </div>
          </div>

          {/* Interactive style selection bar */}
          <div className="bg-[#F5F2EB] border border-[#1A1A1A]/5 p-1 rounded-full flex gap-1">
            {(['scandi', 'office', 'rustic', 'japandi'] as const).map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setActivePreviewStyle(style)}
                className={`flex-1 text-center py-2 px-3 rounded-full text-[12px] font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
                  activePreviewStyle === style
                    ? "bg-[#1A1A1A] text-white shadow"
                    : "text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/5"
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand Logos Marquee ─────────────────────────────────────── */}
      <section className="bg-[#F5F2EB]/50 py-10 border-y border-[#1A1A1A]/5 text-center">
        <div className="max-w-7xl mx-auto px-6 space-y-4">
          <p className="text-[10px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest">Empowering Premium Real Estate Brands & Design Agencies</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-40">
            <span className="font-serif-editorial text-[26px] font-black">METROPOLIS</span>
            <span className="font-sans-premium font-black tracking-widest text-[16px]">V E L O U R</span>
            <span className="font-serif-editorial text-[26px] italic font-light">Atelier Design</span>
            <span className="font-sans-premium font-black tracking-wide text-[15px]">NORDIC STUDIO</span>
          </div>
        </div>
      </section>

      {/* ── How It Works / Features Section ────────────────────────── */}
      <section id="how-it-works" className="py-20 px-6 max-w-7xl mx-auto text-center space-y-12">
        <div className="space-y-3">
          <span className="text-[#B58E3D] text-[11px] font-bold uppercase tracking-wider block">Seamless Workflow</span>
          <h2 className="text-[32px] sm:text-[40px] font-light tracking-tight">AI interior staging in three simple steps</h2>
          <p className="text-[13.5px] text-[#1A1A1A]/65 max-w-md mx-auto">Skip the expensive CAD rendering delays and draft layout mockups directly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Upload Interior Frame",
              desc: "Provide a smartphone photo or a wide scan of your room space. The AI maps spatial boundaries automatically.",
            },
            {
              step: "02",
              title: "Pick Your Design Presets",
              desc: "Explore curated design styles. Adjust colors, furniture counts, wood finishes, and lighting mood panels.",
            },
            {
              step: "03",
              title: "Export & Print PDF",
              desc: "Instantly download photorealistic renders and co-branded marketing brochures for clients and teams.",
            },
          ].map((item) => (
            <div key={item.step} className="bg-white border border-[#1A1A1A]/5 p-6 rounded-xl shadow-sm text-left space-y-4">
              <span className="text-[28px] font-serif-editorial text-[#B58E3D] font-black block">{item.step}</span>
              <h4 className="text-[16px] font-bold text-[#1A1A1A]">{item.title}</h4>
              <p className="text-[12.5px] text-[#1A1A1A]/70 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Interactive Before/After Staging Slider Section ─────────── */}
      <section id="slider-preview" className="bg-[#F5F2EB] py-20 px-6 text-center border-y border-[#1A1A1A]/5">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="space-y-3">
            <span className="text-[#B58E3D] text-[11px] font-bold uppercase tracking-wider block">Interactive Staging Sandbox</span>
            <h2 className="text-[32px] sm:text-[40px] font-light tracking-tight">Drag to reveal staged transformations</h2>
            <p className="text-[13.5px] text-[#1A1A1A]/65 max-w-md mx-auto">Compare an empty CAD structure view with a co-branded Scandinavian styled room makeover.</p>
          </div>

          {/* Interactive Slider Container */}
          <div
            className="w-full max-w-3xl aspect-[16/10] mx-auto rounded-2xl overflow-hidden relative shadow-2xl select-none cursor-ew-resize border border-[#1A1A1A]/10"
            onMouseMove={handleSliderMove}
            onTouchMove={handleSliderMove}
          >
            {/* Background: Staged Styled Room */}
            <div className="absolute inset-0">
              <img
                src="/assets/images/properties/p-4.jpg"
                className="w-full h-full object-cover"
                alt="Staged styled room preview"
              />
              <span className="absolute bottom-4 right-4 bg-black/70 text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded">Staged Room</span>
            </div>

            {/* Foreground: Unfurnished Empty Room */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
              <img
                src="/assets/images/properties/p-12.jpg"
                className="w-full h-full object-cover filter brightness-[0.75]"
                alt="Empty room preview"
              />
              <span className="absolute bottom-4 left-4 bg-black/70 text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded">Empty CAD Frame</span>
            </div>

            {/* Slider Handle Divider */}
            <div
              className="absolute inset-y-0 w-[2px] bg-white z-10"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -left-3.5 -translate-y-1/2 h-7 w-7 rounded-full bg-white text-black shadow-lg flex items-center justify-center text-[13px] font-bold border border-black/10">
                &lsaquo;&rsaquo;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing Tiers Section ───────────────────────────────────── */}
      <section id="pricing" className="py-20 px-6 max-w-7xl mx-auto text-center space-y-12">
        <div className="space-y-4">
          <span className="text-[#B58E3D] text-[11px] font-bold uppercase tracking-wider block">Transparent Packages</span>
          <h2 className="text-[32px] sm:text-[40px] font-light tracking-tight">Flexible plans scaled to your output needs</h2>
          
          {/* Monthly / Annual Billing Selector */}
          <div className="inline-flex items-center gap-1.5 bg-[#F5F2EB] p-1 border border-[#1A1A1A]/5 rounded-full">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`py-1.5 px-4 rounded-full text-[11.5px] font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
                billingCycle === 'monthly' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-[#1A1A1A]/60'
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`py-1.5 px-4 rounded-full text-[11.5px] font-extrabold tracking-wide uppercase transition-all cursor-pointer flex items-center gap-1 ${
                billingCycle === 'annual' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-[#1A1A1A]/60'
              }`}
            >
              Annual Billing <span className="bg-[#B58E3D] text-white text-[8.5px] font-bold px-1.5 py-0.2 rounded-full uppercase shrink-0">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {pricingPlans.map((plan) => {
            const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnual;
            return (
              <div
                key={plan.name}
                className={`bg-white border rounded-2xl p-6 text-left space-y-6 relative transition-all ${
                  plan.popular
                    ? "border-[#B58E3D] ring-2 ring-[#B58E3D]/10 shadow-xl scale-[1.02]"
                    : "border-[#1A1A1A]/5 shadow-sm hover:shadow-md"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-6 bg-[#B58E3D] text-white text-[9.5px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                    Most Popular
                  </span>
                )}
                
                <div className="space-y-2">
                  <h4 className="text-[17px] font-extrabold text-[#1A1A1A]">{plan.name}</h4>
                  <p className="text-[12.5px] text-[#1A1A1A]/65 leading-relaxed">{plan.desc}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-[34px] font-black text-[#1A1A1A]">${price}</span>
                  <span className="text-[11.5px] font-semibold text-[#1A1A1A]/50 uppercase">/ user / month</span>
                </div>

                <ul className="space-y-2.5 border-t border-[#1A1A1A]/5 pt-4 text-[12px] font-bold text-[#1A1A1A]/80">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <i className="ri-checkbox-circle-fill text-[#B58E3D] text-[13px]" /> {feature}
                    </li>
                  ))}
                </ul>

                <div className="pt-2">
                  <Link
                    href="/dashboard"
                    className={`w-full text-center py-2.5 rounded-full text-[12.5px] font-extrabold tracking-wide uppercase block transition-all active:scale-[0.98] ${
                      plan.popular
                        ? "bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/95 shadow-md"
                        : "bg-[#F5F2EB] text-[#1A1A1A] hover:bg-[#F5F2EB]/90"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FAQ Section ─────────────────────────────────────────────── */}
      <section id="faqs" className="bg-[#F5F2EB]/40 py-20 px-6 border-t border-[#1A1A1A]/5">
        <div className="max-w-3xl mx-auto space-y-12 text-left">
          <div className="text-center space-y-3">
            <span className="text-[#B58E3D] text-[11px] font-bold uppercase tracking-wider block">Support & Help</span>
            <h2 className="text-[32px] sm:text-[40px] font-light tracking-tight">Frequently Asked Questions</h2>
            <p className="text-[13.5px] text-[#1A1A1A]/65 max-w-sm mx-auto">Find quick configurations and spatial logic info below.</p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#1A1A1A]/5 rounded-xl overflow-hidden shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                    className="w-full py-4 px-5 flex items-center justify-between text-left font-bold text-[#1A1A1A] text-[13.5px] transition-colors hover:bg-[#1A1A1A]/5"
                  >
                    <span>{item.question}</span>
                    <i className={`text-[15px] transition-transform ${isExpanded ? "ri-subtract-line rotate-180" : "ri-add-line"}`} />
                  </button>
                  {isExpanded && (
                    <div className="py-4 px-5 border-t border-[#1A1A1A]/5 text-[12.5px] leading-relaxed text-[#1A1A1A]/75 font-medium bg-muted/5">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Conversion Footer CTA Section ─────────────────────────────── */}
      <section className="bg-[#1A1A1A] text-white py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-white/5 border border-white/10 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/5 border border-white/10 pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <h2 className="text-[34px] sm:text-[46px] font-light leading-tight tracking-tight">
            Ready to style your space? <br />
            <span className="font-serif-editorial text-[#B58E3D] text-[38px] sm:text-[52px]">Enter Atelier AI</span>
          </h2>
          <p className="text-white/70 text-[13.5px] sm:text-[14.5px] leading-relaxed max-w-lg mx-auto">
            Join thousands of premier listing specialists and spatial designers. Deploy staging concepts instantly.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="bg-white hover:bg-white/95 text-black text-[13.5px] font-extrabold px-8 py-3.5 rounded-full shadow transition-all active:scale-[0.98] inline-block"
            >
              Start Free Trial Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="bg-[#FAF6F0] py-10 px-6 border-t border-[#1A1A1A]/5 text-center text-[12px] font-bold text-[#1A1A1A]/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white font-serif-editorial text-[14px]">A</span>
            <span className="font-sans-premium font-extrabold tracking-wider uppercase text-[#1A1A1A]">Atelier AI</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Waveron Inc. All rights reserved. In partnership with Aura.build.</p>
          <div className="flex gap-4">
            <a href="#how-it-works" className="hover:underline">Privacy Policy</a>
            <a href="#pricing" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
