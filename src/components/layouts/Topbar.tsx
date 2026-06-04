"use client";

import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";

const notifications = [
  {
    id: 1,
    type: "avatar",
    avatarInitial: "J",
    avatarColor: "bg-[#604ae3]",
    name: "Josephine Thompson",
    message: 'commented on admin panel "Wow 😍! this admin looks good and awesome design"',
    time: "2 min ago",
  },
  {
    id: 2,
    type: "initial",
    avatarInitial: "D",
    avatarColor: "bg-soft-info text-info",
    name: "Donoghue Susan",
    message: "Hi, How are you? What about our next meeting",
    time: "1 hr ago",
  },
  {
    id: 3,
    type: "initial",
    avatarInitial: "J",
    avatarColor: "bg-[#3d4654] text-white",
    name: "Jacob Gines",
    message: "Answered to your comment on the cash flow forecast's graph 🔔.",
    time: "3 hr ago",
  },
  {
    id: 4,
    type: "icon",
    icon: "ri-leaf-line",
    avatarColor: "bg-soft-warning text-warning",
    name: "Karen Robinson",
    message: "Wow 😍! this admin looks good and awesome design",
    time: "1 day ago",
  },
];

export function Topbar() {
  const { toggleSidebar, setSettingsOpen, topbarColor } = useAppStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <header className={`sticky top-0 z-40 flex h-[70px] shrink-0 items-center border-b border-border bg-card shadow-[0_0_35px_rgba(154,161,171,0.15)] transition-colors ${
      mounted && theme === "light" && topbarColor === "dark" ? "topbar-dark" : ""
    }`}>
      <div className="flex w-full items-center justify-between px-4 sm:px-6">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Menu toggle */}
          <button
            type="button"
            id="topbar-menu-toggle"
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            onClick={toggleSidebar}
          >
            <i className="ri-menu-2-line text-[22px]" />
          </button>

          {/* Search */}
          <form className="hidden md:flex relative ml-1" action="#" method="GET">
            <div className="relative">
              <input
                type="search"
                id="topbar-search"
                className="h-[38px] w-[220px] rounded-full border-0 bg-[#f3f4f7] dark:bg-[#252d3c] pl-9 pr-4 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Search..."
                autoComplete="off"
              />
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-muted-foreground" />
            </div>
          </form>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1">
          {/* Light/Dark toggle */}
          <button
            type="button"
            id="topbar-theme-toggle"
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {mounted && theme === "dark" ? (
              <i className="ri-sun-line text-[22px]" />
            ) : (
              <i className="ri-moon-line text-[22px]" />
            )}
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            id="topbar-fullscreen"
            className="hidden lg:flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            onClick={toggleFullscreen}
          >
            <i className="ri-fullscreen-line text-[22px]" />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              id="topbar-notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              onClick={() => setNotifOpen(!notifOpen)}
            >
              <i className="ri-notification-3-line text-[22px]" />
              <span className="absolute right-1.5 top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#ff5b5b] text-[10px] font-bold text-white">
                3
              </span>
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-[330px] rounded-lg border border-border bg-card shadow-[0_0_35px_rgba(154,161,171,0.25)] overflow-hidden z-50">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-dashed border-border">
                  <h6 className="text-[15px] font-semibold text-foreground">Notifications</h6>
                  <button className="text-[12px] text-primary underline">Clear All</button>
                </div>
                {/* Items */}
                <div className="max-h-[280px] overflow-y-auto">
                  {notifications.map((notif) => (
                    <a
                      key={notif.id}
                      href="#"
                      className="flex items-start gap-3 px-4 py-3 border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-[14px] font-semibold ${
                            notif.type === "icon" ? notif.avatarColor : notif.avatarColor
                          }`}
                        >
                          {notif.type === "icon" ? (
                            <i className={notif.icon} />
                          ) : (
                            notif.avatarInitial
                          )}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-foreground leading-snug">
                          <span className="font-semibold">{notif.name} </span>
                          {notif.message}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{notif.time}</p>
                      </div>
                    </a>
                  ))}
                </div>
                {/* Footer */}
                <div className="py-2 text-center border-t border-border">
                  <a href="#" className="text-[13px] font-medium text-primary hover:underline">
                    View All
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button
            type="button"
            id="topbar-settings"
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            onClick={() => setSettingsOpen(true)}
          >
            <i className="ri-settings-3-line text-[22px]" />
          </button>

          {/* Divider */}
          <div className="mx-1 h-8 w-px bg-border" />

          {/* User avatar & dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              id="topbar-user-menu"
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className="h-9 w-9 rounded-full overflow-hidden bg-primary/20 border-2 border-primary/30 flex-shrink-0">
                {/* Colored initials avatar */}
                <div className="h-full w-full flex items-center justify-center bg-[#604ae3] text-white text-[14px] font-bold">
                  D
                </div>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[13px] font-semibold text-foreground leading-none">Dominic</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Admin</p>
              </div>
              <i className="ri-arrow-down-s-line text-[16px] text-muted-foreground hidden sm:block" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-[200px] rounded-lg border border-border bg-card shadow-[0_0_35px_rgba(154,161,171,0.25)] py-2 z-50">
                <div className="px-4 py-2 border-b border-border mb-1">
                  <p className="text-[13px] font-semibold text-foreground">Dominic Keller</p>
                  <p className="text-[11px] text-muted-foreground">Admin</p>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-[13px] text-foreground hover:bg-muted/50 transition-colors"
                  onClick={() => setProfileOpen(false)}
                >
                  <i className="ri-user-line text-[15px] text-muted-foreground" />
                  My Account
                </Link>
                <Link
                  href="/profile/settings"
                  className="flex items-center gap-2 px-4 py-2 text-[13px] text-foreground hover:bg-muted/50 transition-colors"
                  onClick={() => setProfileOpen(false)}
                >
                  <i className="ri-settings-3-line text-[15px] text-muted-foreground" />
                  Settings
                </Link>
                <Link
                  href="/help"
                  className="flex items-center gap-2 px-4 py-2 text-[13px] text-foreground hover:bg-muted/50 transition-colors"
                  onClick={() => setProfileOpen(false)}
                >
                  <i className="ri-lifebuoy-line text-[15px] text-muted-foreground" />
                  Support
                </Link>
                <div className="my-1 border-t border-border" />
                <Link
                  href="/auth/signin"
                  className="flex items-center gap-2 px-4 py-2 text-[13px] text-[#ff5b5b] hover:bg-muted/50 transition-colors"
                  onClick={() => setProfileOpen(false)}
                >
                  <i className="ri-logout-box-r-line text-[15px]" />
                  Sign Out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
