"use client";

import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SubItem {
  title: string;
  href: string;
}

interface NavItem {
  title: string;
  href?: string;
  icon: string; // Remix icon class
  children?: SubItem[];
}

const navigation: { section: string; items: NavItem[] }[] = [
  {
    section: "Menu",
    items: [
      {
        title: "Dashboards",
        icon: "ri-dashboard-line",
        children: [
          { title: "Analytics", href: "/" },
          { title: "Agent", href: "/dashboard/agent" },
          { title: "Customer", href: "/dashboard/customer" },
        ],
      },
      {
        title: "Property",
        icon: "ri-building-2-line",
        children: [
          { title: "Property Grid", href: "/properties/grid" },
          { title: "Property List", href: "/properties/list" },
          { title: "Property Map", href: "/properties/map" },
          { title: "Property Details", href: "/properties/1" },
          { title: "Add Property", href: "/properties/add" },
          { title: "Pocket Listings", href: "/properties/pocket-listings" },
        ],
      },
      {
        title: "Agents",
        icon: "ri-user-star-line",
        children: [
          { title: "List View", href: "/agents/list" },
          { title: "Grid View", href: "/agents/grid" },
          { title: "Agent Details", href: "/agents/1" },
          { title: "Add Agent", href: "/agents/add" },
        ],
      },
      {
        title: "Customers",
        icon: "ri-group-line",
        children: [
          { title: "List View", href: "/customers/list" },
          { title: "Grid View", href: "/customers/grid" },
          { title: "Customer Details", href: "/customers/1" },
          { title: "Add Customer", href: "/customers/add" },
          { title: "Showing Tours", href: "/customers/showing-tours" },
        ],
      },
      { title: "Orders", href: "/orders", icon: "ri-shopping-cart-line" },
      {
        title: "Transactions",
        icon: "ri-exchange-dollar-line",
        children: [
          { title: "Ledger List", href: "/transactions" },
          { title: "Deals Pipeline", href: "/transactions/pipeline" },
          { title: "Commissions Split", href: "/transactions/commissions" },
        ],
      },
      { title: "Reports", href: "/reports", icon: "ri-file-chart-line" },
      { title: "Reviews", href: "/reviews", icon: "ri-chat-quote-line" },
      { title: "Chats", href: "/chats", icon: "ri-discuss-line" },
      { title: "Inbox", href: "/inbox", icon: "ri-mail-line" },
      {
        title: "Posts",
        icon: "ri-news-line",
        children: [
          { title: "All Posts", href: "/posts" },
          { title: "Post Details", href: "/posts/post-1" },
          { title: "Create Post", href: "/posts/create" },
        ],
      },
    ],
  },
  {
    section: "Custom",
    items: [
      {
        title: "Pages",
        icon: "ri-pages-line",
        children: [
          { title: "Welcome", href: "/pages/welcome" },
          { title: "Calendar", href: "/calendar" },
          { title: "FAQs", href: "/pages/faqs" },
          { title: "Pricing", href: "/pages/pricing" },
          { title: "User Roles Matrix", href: "/settings/rbac" },
          { title: "Security Audit Logs", href: "/settings/audit-logs" },
        ],
      },
      {
        title: "Authentication",
        icon: "ri-shield-keyhole-line",
        children: [
          { title: "Sign In", href: "/auth/signin" },
          { title: "Sign Up", href: "/auth/signup" },
          { title: "Reset Password", href: "/auth/password-reset" },
          { title: "Lock Screen", href: "/auth/lock-screen" },
        ],
      },
    ],
  },
];

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, menuColor, agencyName, sessionRole, usersList } = useAppStore();
  const currentUser = usersList.find(u => u.role === sessionRole) || {
    name: "Dominic Keller",
    role: "Super Admin" as const,
    avatar: "/assets/images/users/avatar-2.jpg"
  };
  const initials = currentUser.name.split(" ").map(n => n[0]).join("").substring(0, 2);

  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    Dashboards: true,
  });

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const isChildActive = (item: NavItem) =>
    item.children?.some((c) => c.href === pathname) ?? false;

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 xl:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col transition-all duration-300 ease-in-out xl:static xl:translate-x-0 sidebar-wrapper",
          "bg-[var(--sidebar-bg)]",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          menuColor === "light" ? "sidebar-light" : ""
        )}
      >
        {/* Logo */}
        <div className="flex h-[70px] shrink-0 items-center justify-between px-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 bg-primary rounded-[5px] flex items-center justify-center shrink-0">
              <i className="ri-home-4-fill text-white text-[18px]" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[20px] font-bold text-white tracking-wide sidebar-logo-text">{agencyName}</span>
              <span className="text-[9px] font-medium text-white/50 tracking-[0.18em] mt-0.5 sidebar-logo-text">
                LIVING LIFE
              </span>
            </div>
          </Link>
          <button
            className="xl:hidden text-[var(--sidebar-text)] hover:text-white transition-colors"
            onClick={() => setSidebarOpen(false)}
            id="sidebar-close-btn"
          >
            <i className="ri-close-line text-[20px]" />
          </button>
        </div>

        {/* Nav */}
        <div className="flex flex-1 flex-col overflow-y-auto pt-3 pb-4">
          <nav className="px-3 space-y-4">
            {navigation.map((group) => (
              <div key={group.section}>
                <p className="px-3 mb-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-[var(--sidebar-text)]/50 sidebar-section-title">
                  {group.section}
                </p>
                <ul role="list" className="space-y-0.5">
                  {group.items.map((item) => {
                    const childActive = isChildActive(item);
                    const selfActive = !item.children && pathname === item.href;
                    const active = childActive || selfActive;

                    return (
                      <li key={item.title}>
                        {item.children ? (
                          <div>
                            <button
                              id={`sidebar-menu-${item.title.toLowerCase().replace(/\s/g,'-')}`}
                              onClick={() => toggleMenu(item.title)}
                              className={cn(
                                "w-full flex items-center justify-between gap-2 rounded-[5px] px-3 py-2 text-[13.5px] font-medium transition-all duration-150 sidebar-link-item",
                                active
                                  ? "text-white bg-[var(--sidebar-active)]/20"
                                  : "text-[var(--sidebar-text)] hover:text-white hover:bg-white/5"
                              )}
                            >
                              <div className="flex items-center gap-2.5">
                                <i
                                  className={cn(
                                    item.icon,
                                    "text-[17px]",
                                    active ? "text-[var(--sidebar-active)]" : ""
                                  )}
                                />
                                <span className="sidebar-text-label">{item.title}</span>
                              </div>
                              <i
                                className={cn(
                                  "text-[13px] transition-transform duration-200 sidebar-arrow",
                                  openMenus[item.title]
                                    ? "ri-arrow-down-s-line rotate-0"
                                    : "ri-arrow-down-s-line -rotate-90"
                                  )}
                              />
                            </button>

                            {openMenus[item.title] && (
                              <ul className="mt-0.5 ml-4 space-y-0.5 border-l border-white/10 pl-4 sidebar-submenu">
                                {item.children.map((sub) => {
                                  const subActive = pathname === sub.href;
                                  return (
                                    <li key={sub.title}>
                                      <Link
                                        href={sub.href}
                                        className={cn(
                                          "flex items-center gap-2 py-[5px] text-[13px] transition-colors rounded-[4px] px-2",
                                          subActive
                                            ? "text-white font-semibold"
                                            : "text-[var(--sidebar-text)] hover:text-white"
                                        )}
                                        onClick={() => setSidebarOpen(false)}
                                      >
                                        <span
                                          className={cn(
                                            "inline-block h-[6px] w-[6px] rounded-full border transition-colors",
                                            subActive
                                              ? "border-[var(--sidebar-active)] bg-[var(--sidebar-active)]"
                                              : "border-[var(--sidebar-text)]/50"
                                          )}
                                        />
                                        {sub.title}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </div>
                        ) : (
                          <Link
                            href={item.href!}
                            id={`sidebar-link-${item.title.toLowerCase().replace(/\s/g,'-')}`}
                            className={cn(
                              "flex items-center gap-2.5 rounded-[5px] px-3 py-2 text-[13.5px] font-medium transition-all duration-150 sidebar-link-item",
                              selfActive
                                ? "text-white bg-[var(--sidebar-active)]/20"
                                : "text-[var(--sidebar-text)] hover:text-white hover:bg-white/5"
                            )}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <i
                              className={cn(
                                item.icon,
                                "text-[17px]",
                                selfActive ? "text-[var(--sidebar-active)]" : ""
                              )}
                            />
                            <span className="sidebar-text-label">{item.title}</span>
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom user card */}
        <div className="px-4 py-3 border-t border-white/5 sidebar-bottom-user">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-[#604ae3] flex items-center justify-center text-white text-[13px] font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[11px] text-[var(--sidebar-text)]">{currentUser.role}</p>
            </div>
            <Link href="/auth/signin" className="ml-auto text-[var(--sidebar-text)] hover:text-white transition-colors">
              <i className="ri-logout-box-r-line text-[18px]" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
