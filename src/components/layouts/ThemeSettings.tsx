"use client";

import { useAppStore } from "@/store/useAppStore";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSettings() {
  const {
    settingsOpen,
    setSettingsOpen,
    topbarColor,
    setTopbarColor,
    menuColor,
    setMenuColor,
    sidebarSize,
    setSidebarSize,
    agencyName,
    setAgencyName,
    brandColor,
    setBrandColor,
    resetSettings
  } = useAppStore();

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  // Dynamically overwrite root theme color variables
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.style.setProperty("--primary", brandColor);
      document.documentElement.style.setProperty("--ring", brandColor);
    }
  }, [brandColor]);

  if (!mounted) return null;

  const handleColorSchemeChange = (value: "light" | "dark") => {
    setTheme(value);
  };

  const handleReset = () => {
    resetSettings();
    setTheme("light");
  };

  if (!settingsOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs"
        onClick={() => setSettingsOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 z-55 w-[280px] bg-card border-l border-border flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-primary text-white">
          <h5 className="font-bold text-[15px] m-0">Theme Settings</h5>
          <button
            onClick={() => setSettingsOpen(false)}
            className="h-7 w-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <i className="ri-close-line text-[18px]" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-[13.5px]">
          
          {/* Color Scheme */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-foreground text-[13.5px] uppercase tracking-wider">Color Scheme</h5>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer text-muted-foreground hover:text-foreground">
                <input
                  type="radio"
                  name="color-scheme"
                  className="text-primary border-border focus:ring-primary h-4 w-4"
                  checked={theme === "light"}
                  onChange={() => handleColorSchemeChange("light")}
                />
                <span className={theme === "light" ? "font-bold text-foreground" : ""}>Light</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer text-muted-foreground hover:text-foreground">
                <input
                  type="radio"
                  name="color-scheme"
                  className="text-primary border-border focus:ring-primary h-4 w-4"
                  checked={theme === "dark"}
                  onChange={() => handleColorSchemeChange("dark")}
                />
                <span className={theme === "dark" ? "font-bold text-foreground" : ""}>Dark</span>
              </label>
            </div>
          </div>

          {/* Topbar Color */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-foreground text-[13.5px] uppercase tracking-wider">Topbar Color</h5>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer text-muted-foreground hover:text-foreground">
                <input
                  type="radio"
                  name="topbar-color"
                  className="text-primary border-border focus:ring-primary h-4 w-4"
                  checked={topbarColor === "light"}
                  onChange={() => setTopbarColor("light")}
                />
                <span className={topbarColor === "light" ? "font-bold text-foreground" : ""}>Light</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer text-muted-foreground hover:text-foreground">
                <input
                  type="radio"
                  name="topbar-color"
                  className="text-primary border-border focus:ring-primary h-4 w-4"
                  checked={topbarColor === "dark"}
                  onChange={() => setTopbarColor("dark")}
                />
                <span className={topbarColor === "dark" ? "font-bold text-foreground" : ""}>Dark</span>
              </label>
            </div>
          </div>

          {/* Menu Color */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-foreground text-[13.5px] uppercase tracking-wider">Menu Color</h5>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer text-muted-foreground hover:text-foreground">
                <input
                  type="radio"
                  name="menu-color"
                  className="text-primary border-border focus:ring-primary h-4 w-4"
                  checked={menuColor === "light"}
                  onChange={() => setMenuColor("light")}
                />
                <span className={menuColor === "light" ? "font-bold text-foreground" : ""}>Light</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer text-muted-foreground hover:text-foreground">
                <input
                  type="radio"
                  name="menu-color"
                  className="text-primary border-border focus:ring-primary h-4 w-4"
                  checked={menuColor === "dark"}
                  onChange={() => setMenuColor("dark")}
                />
                <span className={menuColor === "dark" ? "font-bold text-foreground" : ""}>Dark</span>
              </label>
            </div>
          </div>

          {/* Sidebar Size */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-foreground text-[13.5px] uppercase tracking-wider">Sidebar Size</h5>
            <div className="space-y-2">
              {[
                { key: "default", label: "Default" },
                { key: "condensed", label: "Condensed" },
                { key: "hidden", label: "Hidden" },
                { key: "sm-hover", label: "Small Hover" },
                { key: "sm-hover-active", label: "Small Hover Active" }
              ].map((size) => (
                <label key={size.key} className="flex items-center gap-2.5 cursor-pointer text-muted-foreground hover:text-foreground">
                  <input
                    type="radio"
                    name="sidebar-size"
                    className="text-primary border-border focus:ring-primary h-4 w-4"
                    checked={sidebarSize === size.key}
                    onChange={() => setSidebarSize(size.key as typeof sidebarSize)}
                  />
                  <span className={sidebarSize === size.key ? "font-bold text-foreground" : ""}>{size.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* White-Label Branding */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h5 className="font-bold text-foreground text-[13.5px] uppercase tracking-wider">B2B SaaS Branding</h5>
            
            {/* Logo Text Override */}
            <div className="space-y-1.5">
              <label className="text-[12.5px] font-semibold text-muted-foreground block">
                Agency Brand Name
              </label>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                placeholder="Lahomes"
                className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-1.5 outline-none focus:border-primary transition-colors font-medium"
              />
            </div>

            {/* Brand Color Override */}
            <div className="space-y-2">
              <label className="text-[12.5px] font-semibold text-muted-foreground block">
                Accent Brand Color
              </label>
              <div className="flex flex-wrap gap-2 items-center">
                {[
                  { key: "purple", color: "#604ae3", name: "Purple" },
                  { key: "red", color: "#ff5b5b", name: "Red" },
                  { key: "green", color: "#10b981", name: "Green" },
                  { key: "blue", color: "#39afd1", name: "Blue" },
                  { key: "orange", color: "#f1b53d", name: "Orange" },
                ].map((preset) => (
                  <button
                    key={preset.key}
                    type="button"
                    onClick={() => setBrandColor(preset.color)}
                    style={{ backgroundColor: preset.color }}
                    title={preset.name}
                    className={`h-6 w-6 rounded-full border-2 transition-all ${
                      brandColor.toLowerCase() === preset.color.toLowerCase()
                        ? "border-foreground scale-110 shadow-sm"
                        : "border-transparent hover:scale-105"
                    }`}
                  />
                ))}
                
                {/* Custom Color Picker */}
                <div className="relative h-6 w-6 rounded-full overflow-hidden border border-border flex items-center justify-center hover:scale-105 transition-all">
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                  />
                  <i className="ri-palette-line text-[14px] text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-border bg-muted/20">
          <button
            onClick={handleReset}
            className="w-full bg-[#ff5b5b] hover:bg-[#eb4a4a] text-white text-[13.5px] font-bold py-2 rounded-[5px] transition-colors shadow-xs"
          >
            Reset
          </button>
        </div>

      </div>
    </>
  );
}
