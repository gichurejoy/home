"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/store/useToastStore";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Sidebar } from "@/components/layouts/Sidebar";

export default function BrandingCustomizer() {
  const { agencyName, agencyProfile, completeOnboarding } = useAppStore();

  const [name, setName] = useState(agencyName);
  const [tagline, setTagline] = useState(agencyProfile.tagline || "Real Estate SaaS Portal");
  const [currency, setCurrency] = useState(agencyProfile.currency || "USD");
  const [accentColor, setAccentColor] = useState("#604ae3");
  const [logoUrl, setLogoUrl] = useState("/assets/images/logo-placeholder.png");

  const handleSave = () => {
    completeOnboarding({
      name,
      tagline,
      logo: logoUrl,
      currency
    });
    toast.success("Agency branding updated successfully!");
  };

  const presets = [
    { name: "Waveron Purple", value: "#604ae3" },
    { name: "Emerald Green", value: "#0acf97" },
    { name: "Classic Gold", value: "#f9bc0b" },
    { name: "Deep Indigo", value: "#3954db" },
    { name: "Amber Red", value: "#fa5c7c" }
  ];

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <Breadcrumb />
          <h1 className="text-[20px] font-bold text-foreground">Branding & White-Label Customizer</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Customize your agency branding, logos, and UI accents.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Controls Form (Col 5) */}
        <div className="xl:col-span-5 space-y-4 bg-card border border-border rounded-lg p-5 shadow-sm text-left">
          <h4 className="text-[15px] font-bold text-foreground border-b border-border pb-2.5">Portal Configuration</h4>
          
          {/* Agency Name */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Agency Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary font-semibold"
            />
          </div>

          {/* Tagline */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary font-semibold"
            />
          </div>

          {/* Accent Color Picker Presets */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">UI Accent Theme</label>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setAccentColor(preset.value)}
                  className={`h-7 px-2.5 rounded text-[11px] font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    accentColor === preset.value
                      ? "bg-primary text-white border-primary"
                      : "bg-card text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  <span className="h-3 w-3 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: preset.value }} />
                  {preset.name.split(" ")[1]}
                </button>
              ))}
            </div>
          </div>

          {/* Currency Select */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Default Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-primary font-semibold"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          <div className="pt-3 border-t border-border mt-4">
            <button
              type="button"
              onClick={handleSave}
              className="w-full bg-[#0acf97] hover:bg-[#0acf97]/95 text-white text-[13px] font-bold py-2 rounded-[5px] transition-all shadow active:scale-[0.98] cursor-pointer"
            >
              Save Branding & Apply Updates
            </button>
          </div>
        </div>

        {/* Right Pane: Live Mockup Previewer (Col 7) */}
        <div className="xl:col-span-7 space-y-4">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block text-left">Live Mockup Preview</span>
          
          <div className="w-full border border-border rounded-lg bg-card shadow-2xl overflow-hidden aspect-[16/10] flex flex-col justify-between select-none">
            {/* Mock Header */}
            <div className="h-10 bg-slate-900 text-white px-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded flex items-center justify-center text-white" style={{ backgroundColor: accentColor }}>
                  <i className="ri-home-4-fill text-[11px]" />
                </span>
                <span className="text-[12px] font-bold">{name}</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] opacity-75">
                <span>{tagline}</span>
                <span className="h-4 w-[1px] bg-white/10" />
                <span className="font-mono">{currency} Mode</span>
              </div>
            </div>

            {/* Mock Dashboard Area */}
            <div className="flex-1 flex bg-slate-950/5">
              {/* Mock Sidebar */}
              <div className="w-32 bg-slate-900 border-r border-white/5 p-2 flex flex-col justify-between text-left">
                <div className="space-y-1.5">
                  <div className="h-2 w-16 bg-white/15 rounded" />
                  <div className="h-4 rounded bg-white/10 flex items-center px-1.5 gap-1">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                    <div className="h-1.5 w-10 bg-white/30 rounded" />
                  </div>
                  <div className="h-3 w-20 bg-white/10 rounded" />
                  <div className="h-3 w-16 bg-white/10 rounded" />
                </div>
                <div className="h-4 w-24 bg-white/10 rounded" />
              </div>

              {/* Mock Contents */}
              <div className="flex-1 p-4 space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="h-3 w-20 bg-foreground/30 rounded" />
                    <div className="h-2 w-32 bg-muted-foreground/30 rounded mt-1" />
                  </div>
                  <div className="h-5 w-16 rounded bg-success/15 border border-success/10" />
                </div>

                {/* Cards */}
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((idx) => (
                    <div key={idx} className="bg-card border border-border p-2.5 rounded-md shadow-sm space-y-1.5">
                      <div className="h-2 w-12 bg-muted-foreground/30 rounded" />
                      <div className="h-4 w-16 bg-foreground/40 rounded" />
                      <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ backgroundColor: accentColor, width: `${idx * 25}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Main Graph space */}
                <div className="border border-border bg-card rounded-md p-3 aspect-[2.8/1] flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="h-2 w-24 bg-muted-foreground/30 rounded" />
                    <div className="h-2.5 w-12 bg-muted-foreground/20 rounded" />
                  </div>
                  {/* Mock Chart Vectors */}
                  <div className="h-12 w-full flex items-end gap-1.5">
                    {[30, 45, 35, 60, 50, 75, 90, 80, 95].map((val, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t opacity-80"
                        style={{ height: `${val}%`, backgroundColor: accentColor }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
