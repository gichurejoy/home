"use client";

import { Sidebar } from "@/components/layouts/Sidebar";
import { Topbar } from "@/components/layouts/Topbar";
import { ThemeSettings } from "@/components/layouts/ThemeSettings";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { CustomDialogs } from "@/components/ui/CustomDialogs";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { CompareBar } from "@/components/ui/CompareBar";
import { useAppStore } from "@/store/useAppStore";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarSize, hasCompletedOnboarding } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  useEffect(() => {
    if (mounted && !hasCompletedOnboarding && pathname !== "/onboarding") {
      router.push("/onboarding");
    }
  }, [mounted, hasCompletedOnboarding, pathname, router]);

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

  if (pathname === "/onboarding") {
    return (
      <div className="h-screen w-screen bg-[#f4f6fb] dark:bg-[#101726] overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
        {children}
        <ToastContainer />
        <CustomDialogs />
      </div>
    );
  }

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
      <ToastContainer />
      <CustomDialogs />
      <CommandPalette />
      <CompareBar />
    </div>
  );
}

