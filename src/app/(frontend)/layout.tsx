"use client";

import { Sidebar } from "@/components/layouts/Sidebar";
import { Topbar } from "@/components/layouts/Topbar";
import { ThemeSettings } from "@/components/layouts/ThemeSettings";
import { useAppStore } from "@/store/useAppStore";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarSize } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sizeClass = !mounted ? "" : (
    sidebarSize === "condensed"
      ? "sidebar-condensed"
      : sidebarSize === "hidden"
      ? "sidebar-hidden"
      : sidebarSize === "sm-hover"
      ? "sidebar-sm-hover"
      : sidebarSize === "sm-hover-active"
      ? "sidebar-sm-hover-active"
      : ""
  );

  return (
    <div className={`flex h-screen overflow-hidden bg-background ${sizeClass}`}>
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0 layout-content-wrapper">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f4f6fb] dark:bg-[#101726]">
          {children}
        </main>
      </div>
      <ThemeSettings />
    </div>
  );
}
