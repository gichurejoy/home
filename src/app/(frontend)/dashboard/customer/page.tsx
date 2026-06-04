"use client";

import { useEffect, useState, useRef } from "react";
import * as React from "react";
import { CustomerInvestChart } from "@/components/charts/CustomerInvestChart";
import { CustomerRecentInvestChart } from "@/components/charts/CustomerRecentInvestChart";
import { CustomerDevicesChart } from "@/components/charts/CustomerDevicesChart";
import { WorldMap } from "@/components/charts/WorldMap";

interface DropdownProps {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}

function Dropdown({ options, selected, onSelect }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground border border-border bg-muted/30 hover:bg-muted px-2.5 py-1.5 rounded-[5px] transition-all"
      >
        {selected} <i className="ri-arrow-down-s-line text-[13px]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-32 bg-card border border-border rounded-[6px] shadow-lg py-1 z-20 animate-in fade-in slide-in-from-top-1 duration-150">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-[12px] text-foreground hover:bg-muted transition-colors font-medium"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CustomerDashboard() {
  const [devicesPeriod, setDevicesPeriod] = useState("Today");

  // Country goal list data
  const countries = [
    {
      flag: "/assets/images/flag/br.svg",
      name: "Brazil",
      earn: "$15,781",
      todayInc: "+10.0",
      progress: "30%",
      totalCustomer: "3474",
      goal: "10,000",
    },
    {
      flag: "/assets/images/flag/ca.svg",
      name: "Canada",
      earn: "$23,263",
      todayInc: "+4.1",
      progress: "70%",
      totalCustomer: "7843",
      goal: "10,000",
    },
    {
      flag: "/assets/images/flag/ru.svg",
      name: "Russia",
      earn: "$30,562",
      todayInc: "+7.1",
      progress: "50%",
      totalCustomer: "5933",
      goal: "10,000",
    },
    {
      flag: "/assets/images/flag/us.svg",
      name: "USA",
      earn: "$41,341",
      todayInc: "+12.0",
      progress: "80%",
      totalCustomer: "8901",
      goal: "10,000",
    },
  ];

  // Top Customer data list
  const topCustomers = [
    {
      name: "Tiia Karppinen",
      avatar: "/assets/images/users/avatar-6.jpg",
      email: "tiiakarppinen@teleworm.us",
      invest: "$733,291",
    },
    {
      name: "Harland R. Orsini",
      avatar: "/assets/images/users/avatar-7.jpg",
      email: "harlandrorsini@dayrep.com",
      invest: "$831,760",
    },
    {
      name: "David Padgett",
      avatar: "/assets/images/users/avatar-8.jpg",
      email: "davidpadgett@armyspy.com",
      invest: "$647,900",
    },
    {
      name: "Yusra Hasibah",
      avatar: "/assets/images/users/avatar-10.jpg",
      email: "yusraHasibahadad@rhyta.com",
      invest: "$530,389",
    },
    {
      name: "Valerie Obrien",
      avatar: "/assets/images/users/avatar-9.jpg",
      email: "valerieobrien@dayrep.com",
      invest: "$763,829",
    },
  ];

  return (
    <div className="space-y-6">
      {/* CSS keyframe animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes progress-bar-stripes {
            0% { background-position: 1rem 0; }
            100% { background-position: 0 0; }
          }
          .progress-bar-animated-custom {
            animation: progress-bar-stripes 1s linear infinite;
          }
        `
      }} />

      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-[20px] font-bold text-foreground">Customers</h1>
        <ol className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <li>
            <a href="/" className="hover:text-primary transition-colors">Dashboards</a>
          </li>
          <li><i className="ri-arrow-right-s-line text-[12px]" /></li>
          <li className="text-primary font-medium">Customers</li>
        </ol>
      </div>

      {/* ── ROW 1: Country cards (Left 8) + Property Investor (Right 4) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column - Country Goal Cards */}
        <div className="xl:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {countries.map((c) => (
              <div
                key={c.name}
                className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.15)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-muted/60 flex items-center justify-center overflow-hidden border border-border">
                      <img src={c.flag} alt={`${c.name} Flag`} className="w-6 h-auto object-contain rounded-[2px]" />
                    </div>
                    <div>
                      <h4 className="text-[15.5px] font-bold text-foreground leading-tight">{c.name}</h4>
                      <p className="text-[12.5px] text-muted-foreground font-medium mt-0.5">
                        <span className="text-foreground font-bold">{c.earn}</span> Per Month
                      </p>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mb-2">
                    <p className="text-[13.5px] text-muted-foreground font-medium">Total Customer</p>
                    <div className="text-right">
                      <p className="text-[11.5px] text-muted-foreground font-bold mb-0.5">Today</p>
                      <h5 className="text-[#0acf97] text-[13.5px] font-bold leading-none flex items-center justify-end gap-0.5">
                        <i className="ri-arrow-up-s-fill text-[16px]" />
                        {c.todayInc}
                      </h5>
                    </div>
                  </div>

                  {/* Striped and animated progress bar */}
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-3.5 mt-2">
                    <div
                      className="progress-bar-animated-custom bg-primary/75 h-full rounded-full"
                      style={{
                        width: c.progress,
                        backgroundImage:
                          "linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)",
                        backgroundSize: "1rem 1rem",
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <h4 className="text-[18px] font-extrabold text-foreground leading-none">{c.totalCustomer}</h4>
                  <p className="text-[12.5px] text-muted-foreground font-semibold">Goal : {c.goal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Property Investor Card */}
        <div className="xl:col-span-4">
          <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.15)] flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <h4 className="text-[16px] font-bold text-foreground">Property Investor</h4>
              </div>

              <div className="flex items-center gap-3.5 mb-5">
                <img
                  src="/assets/images/users/avatar-2.jpg"
                  alt="Daavid Nummi"
                  className="w-16 h-16 rounded object-cover border border-border p-0.5"
                />
                <div>
                  <h4 className="text-[16.5px] font-bold text-foreground leading-tight">
                    <a href="#!" className="hover:text-primary transition-colors">Daavid Nummi</a>
                  </h4>
                  <a href="#!" className="text-primary font-bold text-[12.5px] hover:underline mt-1 block">
                    EastTribune.nl
                  </a>
                  {/* Social Buttons */}
                  <div className="flex gap-1.5 mt-2.5">
                    <a href="#!" className="h-7 w-7 rounded bg-soft-primary text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                      <i className="ri-facebook-fill text-[14px]" />
                    </a>
                    <a href="#!" className="h-7 w-7 rounded bg-soft-danger text-danger flex items-center justify-center hover:bg-danger hover:text-white transition-colors">
                      <i className="ri-instagram-fill text-[14px]" />
                    </a>
                    <a href="#!" className="h-7 w-7 rounded bg-soft-info text-info flex items-center justify-center hover:bg-info hover:text-white transition-colors">
                      <i className="ri-twitter-fill text-[14px]" />
                    </a>
                    <a href="#!" className="h-7 w-7 rounded bg-soft-success text-success flex items-center justify-center hover:bg-success hover:text-white transition-colors">
                      <i className="ri-whatsapp-fill text-[14px]" />
                    </a>
                    <a href="#!" className="h-7 w-7 rounded bg-soft-warning text-warning flex items-center justify-center hover:bg-warning hover:text-white transition-colors">
                      <i className="ri-mail-fill text-[14px]" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="h-[182px] w-full -mx-2 mt-2">
                <CustomerInvestChart />
              </div>
            </div>

            <div className="border-t border-dashed border-border pt-4 mt-5 flex gap-3">
              <button className="flex-1 bg-primary hover:bg-primary/95 text-white font-bold text-[13px] py-2 rounded-[5px] transition-colors">
                Open Chat
              </button>
              <button className="flex-1 bg-muted hover:bg-muted/80 text-foreground font-bold text-[13px] py-2 rounded-[5px] transition-colors border border-border/80">
                Call To Customer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 2: Recent Customers Invest (Left 6) + Customer By Country (Right 6) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Customers Invest */}
        <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.15)] flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <h4 className="text-[16px] font-bold text-foreground">Recent Customers Invest</h4>
          </div>

          <div>
            <div className="flex items-center justify-between bg-muted/30 border border-border/80 p-3.5 rounded-[5px] mb-5">
              <div>
                <h5 className="text-[13.5px] font-bold text-foreground mb-2">Customer Buy Property</h5>
                <div className="flex -space-x-2">
                  {["avatar-6.jpg", "avatar-7.jpg", "avatar-8.jpg", "avatar-9.jpg", "avatar-10.jpg"].map((av, idx) => (
                    <img
                      key={idx}
                      src={`/assets/images/users/${av}`}
                      alt="Buyer Avatar"
                      className="w-7 h-7 rounded-full border-2 border-card object-cover"
                    />
                  ))}
                </div>
              </div>
              <div className="text-right">
                <h5 className="text-[13px] text-muted-foreground font-semibold mb-1">Revenue</h5>
                <h3 className="text-[16px] font-extrabold text-foreground leading-none flex items-center justify-end gap-1">
                  <span className="text-[#0acf97] text-[12px] font-bold flex items-center">
                    <i className="ri-arrow-up-s-fill" /> +22.0
                  </span>
                  $67435.00
                </h3>
              </div>
            </div>

            <div className="h-[300px] w-full -mx-2">
              <CustomerRecentInvestChart />
            </div>
          </div>
        </div>

        {/* Customer By Country */}
        <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.15)] flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <h4 className="text-[16px] font-bold text-foreground">Customer By Country</h4>
          </div>
          <div className="h-[385px] w-full relative flex items-center justify-center">
            <WorldMap />
          </div>
        </div>
      </div>

      {/* ── ROW 3: Top Customer (col-4) + Devices (col-4) + Property Purchase (col-4) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Top Customer Card */}
        <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.15)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div>
                <h4 className="text-[16px] font-bold text-foreground">Top Customer</h4>
                <p className="text-[12px] text-muted-foreground font-semibold mt-0.5">390 Customer</p>
              </div>
              <a href="#!" className="text-muted-foreground hover:text-foreground text-[18px] transition-colors">
                <i className="ri-edit-box-line" />
              </a>
            </div>

            <div className="space-y-4">
              {topCustomers.map((cust, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between ${
                    idx < topCustomers.length - 1 ? "border-b border-border pb-3.5" : ""
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={cust.avatar}
                      alt={cust.name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div className="leading-tight">
                      <a href="#!" className="text-[13px] font-bold text-foreground hover:text-primary transition-colors block">
                        {cust.name}
                      </a>
                      <span className="text-[11px] text-muted-foreground font-medium block mt-0.5">
                        {cust.email}
                      </span>
                    </div>
                  </div>
                  <span className="text-[12.5px] text-muted-foreground font-semibold">{cust.invest}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="w-full mt-5 bg-primary hover:bg-primary/95 text-white font-bold text-[12px] py-2 rounded-[5px] transition-all"
          >
            View All
          </button>
        </div>

        {/* Customer Visit by Device Card */}
        <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.15)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[16px] font-bold text-foreground">Customer Visit by Device</h4>
              <Dropdown
                options={["Today", "Month", "Years"]}
                selected={devicesPeriod}
                onSelect={setDevicesPeriod}
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[22px] font-bold text-foreground flex items-center gap-2 mb-1 leading-none">
                  67,893
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-danger bg-soft-danger px-1.5 py-0.5 rounded">
                    <i className="ri-arrow-down-line" /> 0.66%
                  </span>
                </h3>
                <small className="text-[11.5px] text-muted-foreground font-medium">(Total Devices)</small>
              </div>
              <div className="h-11 w-11 rounded bg-muted/60 flex items-center justify-center text-primary flex-shrink-0">
                <iconify-icon icon="solar:devices-broken" style={{ fontSize: "28px" }} />
              </div>
            </div>

            <div className="h-[150px] w-full -mx-2">
              <CustomerDevicesChart />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-5">
              {/* Mobile Section */}
              <div className="border border-border/80 p-2.5 rounded-[5px]">
                <p className="text-[12px] text-muted-foreground font-bold flex items-center gap-1 mb-1">
                  <i className="ri-smartphone-line text-foreground" /> Mobile
                </p>
                <p className="text-[15px] font-bold text-foreground mb-2">
                  2.435 <span className="text-muted-foreground text-[11px] font-normal">60%</span>
                </p>
                <div className="flex justify-between text-[11px] font-semibold mb-2">
                  <div>
                    <p className="text-muted-foreground">Android</p>
                    <p className="text-foreground">2,545</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">iOS</p>
                    <p className="text-foreground">487</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-2 bg-muted rounded-full flex overflow-hidden gap-[2px]">
                  <div className="bg-[#0acf97] rounded-full" style={{ width: "70%" }} />
                  <div className="bg-foreground rounded-full" style={{ width: "30%" }} />
                </div>
              </div>

              {/* Desktop Section */}
              <div className="border border-border/80 p-2.5 rounded-[5px]">
                <p className="text-[12px] text-muted-foreground font-bold flex items-center gap-1 mb-1">
                  <i className="ri-computer-line text-foreground" /> Desktop
                </p>
                <p className="text-[15px] font-bold text-foreground mb-2">
                  578 <span className="text-muted-foreground text-[11px] font-normal">20%</span>
                </p>
                <div className="flex justify-between text-[11px] font-semibold mb-2">
                  <div>
                    <p className="text-muted-foreground">Windows</p>
                    <p className="text-foreground">523</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">Mac</p>
                    <p className="text-foreground">876</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-2 bg-muted rounded-full flex overflow-hidden gap-[2px]">
                  <div className="bg-foreground rounded-full" style={{ width: "30%" }} />
                  <div className="bg-[#f8ac59] rounded-full" style={{ width: "70%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4 mt-5 flex gap-3">
            <button className="flex-[7] bg-primary hover:bg-primary/95 text-white font-bold text-[13px] py-2 rounded-[5px] transition-colors">
              View All
            </button>
            <button className="flex-[5] bg-muted hover:bg-muted/80 text-foreground font-bold text-[13px] py-2 rounded-[5px] transition-colors border border-border/80">
              Edit Data
            </button>
          </div>
        </div>

        {/* Recent Purchase Property Card */}
        <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.15)] flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <h4 className="text-[16px] font-bold text-foreground">Recent Purchase Property</h4>
            </div>

            <div className="relative rounded-[6px] overflow-hidden">
              <img
                src="/assets/images/properties/p-10.jpg"
                alt="Property Image"
                className="w-full h-[180px] object-cover"
              />
              <span className="absolute top-2 right-2 bg-[#ff5b5b] text-white text-[11px] font-bold px-2 py-0.5 rounded">
                Sold
              </span>
            </div>

            <div className="flex items-center gap-2.5 mt-4 pt-1">
              <div className="h-10 w-10 rounded bg-soft-primary text-primary flex items-center justify-center flex-shrink-0">
                <iconify-icon icon="solar:buildings-3-bold-duotone" style={{ fontSize: "24px" }} />
              </div>
              <div className="leading-tight">
                <a href="#!" className="text-foreground font-bold text-[14.5px] hover:text-primary transition-colors block">
                  Woodis B. Apartment
                </a>
                <span className="text-[11.5px] text-muted-foreground font-medium block mt-0.5">
                  Bungalow Road Niobrara
                </span>
              </div>
              <div className="ms-auto text-right">
                <span className="text-[16px] font-extrabold text-foreground">$80,675.00</span>
              </div>
            </div>

            {/* Specs badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="inline-flex items-center gap-1 border border-border px-2 py-1 rounded text-[11.5px] font-semibold text-muted-foreground bg-muted/10">
                <iconify-icon icon="solar:bed-broken" style={{ fontSize: "14px" }} /> 4 Beds
              </span>
              <span className="inline-flex items-center gap-1 border border-border px-2 py-1 rounded text-[11.5px] font-semibold text-muted-foreground bg-muted/10">
                <iconify-icon icon="solar:bath-broken" style={{ fontSize: "14px" }} /> 3 Bath
              </span>
              <span className="inline-flex items-center gap-1 border border-border px-2 py-1 rounded text-[11.5px] font-semibold text-muted-foreground bg-muted/10">
                <iconify-icon icon="solar:scale-broken" style={{ fontSize: "14px" }} /> 1700ft
              </span>
              <span className="inline-flex items-center gap-1 border border-border px-2 py-1 rounded text-[11.5px] font-semibold text-muted-foreground bg-muted/10">
                <iconify-icon icon="solar:double-alt-arrow-up-broken" style={{ fontSize: "14px" }} /> 6 Floor
              </span>
            </div>
          </div>

          {/* Buyer details at bottom */}
          <div className="flex items-center gap-2.5 mt-5 pt-3 border-t border-border">
            <img
              src="/assets/images/users/avatar-6.jpg"
              alt="Tiia Karppinen"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div className="leading-tight">
              <a href="#!" className="text-[13px] font-bold text-foreground hover:text-primary transition-colors block">
                Tiia Karppinen
              </a>
              <span className="text-[11.5px] text-muted-foreground font-medium block mt-0.5">
                tiiakarppinen@teleworm.us
              </span>
            </div>
            <div className="ms-auto text-[#0acf97]">
              <i className="ri-checkbox-circle-line text-[20px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
