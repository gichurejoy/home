"use client";

import { useState, useMemo, useEffect } from "react";
import { agents as initialAgents, Agent } from "@/data/mockAgents";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function AgentGrid() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Dropdown menus states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeDropdownCard, setActiveDropdownCard] = useState<string | null>(null);

  // Stats computation
  const totalAgents = agents.length;

  // Search and filter logic
  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesSearch =
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedStatus === "All" || agent.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [agents, searchTerm, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);
  const paginatedAgents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAgents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAgents, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this agent?")) {
      setAgents(agents.filter((a) => a.id !== id));
      setActiveDropdownCard(null);
    }
  };

  // --- Charts Subcomponents ---
  const DonutPortfolio = () => {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) {
      return <div className="h-[120px] w-[120px] rounded-full bg-muted/20 animate-pulse mx-auto" />;
    }

    const isDark = theme === "dark";
    const options: ApexCharts.ApexOptions = {
      chart: { type: "donut", height: 120, background: "transparent" },
      series: [80, 40, 30],
      labels: ["Vacant", "Occupied", "Unlisted"],
      colors: ["#604ae3", "#ffb12f", "#0acf97"],
      legend: { show: false },
      stroke: { width: 0 },
      plotOptions: {
        pie: {
          donut: {
            size: "72%",
            labels: {
              show: false,
              total: { showAlways: true, show: true }
            }
          }
        }
      },
      dataLabels: { enabled: false },
      tooltip: { theme: isDark ? "dark" : "light" }
    };

    return <Chart options={options} series={[80, 40, 30]} type="donut" height={120} width="100%" />;
  };

  const SealSparkline = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) {
      return <div className="h-[60px] w-full bg-white/10 rounded animate-pulse" />;
    }

    const options: ApexCharts.ApexOptions = {
      chart: {
        type: "area",
        height: 60,
        sparkline: { enabled: true },
        background: "transparent",
        parentHeightOffset: 0
      },
      stroke: { curve: "smooth", width: 2 },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.45,
          opacityTo: 0.05
        }
      },
      colors: ["#ffffff"],
      tooltip: { enabled: false },
      grid: { padding: { top: 5, bottom: 5 } }
    };

    const series = [{ name: "Properties", data: [35, 45, 30, 60, 50, 75, 65, 95, 80, 110] }];

    return <Chart options={options} series={series} type="area" height={60} width="100%" />;
  };

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-[20px] font-bold text-foreground">Agent Grid</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Real Estate Agent Dashboard View</p>
        </div>
        <ol className="flex items-center text-[13px] text-muted-foreground">
          <li>
            <a href="/" className="hover:text-primary transition-colors">Real Estate</a>
          </li>
          <li className="mx-1 text-muted-foreground/60">&rsaquo;</li>
          <li className="text-primary font-medium">Agent Grid</li>
        </ol>
      </div>

      {/* ── Top Overview Widgets Row ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Welcome Back card */}
        <div className="lg:col-span-6 bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)] relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 h-full">
            <div className="flex-1 space-y-3">
              <div>
                <h4 className="text-[18px] font-bold text-foreground leading-snug">Welcome Back , Gaston</h4>
                <p className="text-[13px] text-muted-foreground mt-0.5">This is your properties portfolio report</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-[120px] min-w-[120px]">
                  <DonutPortfolio />
                </div>
                <div className="space-y-1 text-[12.5px] font-semibold text-muted-foreground">
                  <h5 className="text-[13.5px] font-bold text-foreground mb-1.5">Properties: <span className="text-[16px] text-primary ml-1">250</span></h5>
                  <p className="flex items-center gap-1.5"><i className="ri-circle-fill text-[#604ae3] text-[9px]" /> 80 Vacant</p>
                  <p className="flex items-center gap-1.5"><i className="ri-circle-fill text-[#ffb12f] text-[9px]" /> 40 Occupied</p>
                  <p className="flex items-center gap-1.5"><i className="ri-circle-fill text-[#0acf97] text-[9px]" /> 30 Unlisted</p>
                </div>
              </div>
              <p className="text-[11.5px] text-muted-foreground pt-1 flex items-center gap-1">
                Last Updated <span className="text-foreground font-semibold">: 4 day ago</span>
              </p>
            </div>
            <div className="hidden md:block w-36 text-right self-end -mb-5 -mr-5">
              <img src="/assets/images/home-2.png" alt="Home Asset" className="img-fluid max-h-24 w-auto object-contain ml-auto opacity-95" />
            </div>
          </div>
        </div>

        {/* Development Task card */}
        <div className="lg:col-span-3 bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)] flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-dashed border-border pb-3">
            <h4 className="text-[14px] font-bold text-foreground">Development Task</h4>
            <div className="relative">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="text-muted-foreground hover:text-foreground text-[16px]"
              >
                <i className="ri-more-2-line" />
              </button>
              {isSettingsOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-card border border-border rounded-[5px] shadow-lg py-1 z-10 text-[12.5px] text-foreground">
                  <a href="#!" className="block px-3 py-1.5 hover:bg-muted font-semibold">Download</a>
                  <a href="#!" className="block px-3 py-1.5 hover:bg-muted font-semibold">Share</a>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4 mt-3">
            <div className="grid grid-cols-3 gap-1 text-[12px] text-center">
              <div>
                <h5 className="font-bold text-foreground text-[14px]">250</h5>
                <p className="text-muted-foreground mt-0.5">Total</p>
              </div>
              <div className="border-x border-border">
                <h5 className="font-bold text-foreground text-[14px]">30</h5>
                <p className="text-muted-foreground mt-0.5">Pending</p>
              </div>
              <div>
                <h5 className="font-bold text-foreground text-[14px]">04</h5>
                <p className="text-muted-foreground mt-0.5">Days Left</p>
              </div>
            </div>
            {/* Multi-segmented rounded progress bar */}
            <div className="h-2 w-full flex gap-1.5 mt-2 overflow-visible">
              <div className="bg-[#604ae3] h-full rounded-full" style={{ width: "40%" }} />
              <div className="bg-[#ffb12f] h-full rounded-full" style={{ width: "30%" }} />
              <div className="bg-[#0acf97] h-full rounded-full" style={{ width: "30%" }} />
            </div>
            <p className="text-[12px] text-muted-foreground">
              <span className="text-[#0acf97] font-bold inline-flex items-center gap-0.5"><i className="ri-arrow-up-line" />34.4%</span> vs last month
            </p>
          </div>
          <div className="border-t border-border pt-2 flex items-center justify-between text-[11.5px] text-muted-foreground mt-3">
            <p>Last Updated : <span className="text-foreground font-semibold">12 hours ago</span></p>
            <a href="#!" className="text-[#604ae3] font-bold hover:underline">View More</a>
          </div>
        </div>

        {/* Total Seal Properties card */}
        <div className="lg:col-span-3 bg-[#604ae3] text-white rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)] flex flex-col justify-between min-h-[170px] overflow-hidden relative">
          <div className="flex justify-between items-start z-1">
            <div>
              <h4 className="text-[13px] font-bold text-white/80 uppercase tracking-wider">TOTAL SEAL PROPERTIES</h4>
              <p className="text-[26px] font-extrabold text-white mt-1.5">450</p>
            </div>
            <div className="h-11 w-11 bg-white/20 rounded flex items-center justify-center shrink-0">
              <iconify-icon icon="solar:home-bold-duotone" className="text-[26px] text-white" />
            </div>
          </div>
          <div className="-mx-5 -mb-5 mt-4 rounded-b-[8px] overflow-hidden">
            <SealSparkline />
          </div>
        </div>
      </div>

      {/* ── Filter Controls Row ─────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-[8px] p-4 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[13px] text-muted-foreground">
              Showing <span className="font-bold text-foreground">{filteredAgents.length}</span> out of <span className="font-bold text-foreground">{totalAgents}</span> Agents
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search Agent..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-[13px] border border-border bg-card text-foreground rounded-[5px] pl-8 pr-3 py-1.5 w-[200px] outline-none focus:border-[#604ae3] transition-colors placeholder:text-muted-foreground/60"
              />
              <i className="ri-search-line absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/80 text-[14px]" />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-1 text-[13px] font-semibold text-muted-foreground border border-border bg-muted/20 hover:bg-muted/40 px-3 py-1.5 rounded-[5px] transition-all"
              >
                <i className="ri-filter-line text-[14px]" /> Status: {selectedStatus}{" "}
                <i className="ri-arrow-down-s-line text-[14px]" />
              </button>
              {isFilterOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-card border border-border rounded-[5px] shadow-lg py-1 z-10 text-[12.5px] text-foreground">
                  {["All", "Active", "Inactive", "On Leave"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        setSelectedStatus(st);
                        setCurrentPage(1);
                        setIsFilterOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-muted font-medium"
                    >
                      {st}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/agents/add"
              className="bg-[#604ae3] text-white text-[13px] font-bold px-3.5 py-1.5 rounded-[5px] flex items-center gap-1 hover:bg-[#503bc7] transition-all"
            >
              <i className="ri-add-line text-[15px]" /> New Agent
            </Link>
          </div>
        </div>
      </div>

      {/* ── Agents Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginatedAgents.length === 0 ? (
          <div className="col-span-full py-16 text-center text-muted-foreground">
            No agents found matching your query.
          </div>
        ) : (
          paginatedAgents.map((agent, index) => {
            const displayRank = (currentPage - 1) * itemsPerPage + index + 1;
            const isDropdownActive = activeDropdownCard === agent.id;
            return (
              <div
                key={agent.id}
                className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)] hover:shadow-md transition-shadow relative flex flex-col justify-between"
              >
                {/* Card Top Block */}
                <div className="border-b border-border pb-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={agent.avatar}
                      alt={agent.name}
                      className="avatar-lg rounded-[6px] border-[3px] border-white w-16 h-16 object-cover shadow-sm shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/agents/${agent.id}`}
                        className="text-foreground hover:text-[#604ae3] font-bold text-[15.5px] leading-tight block truncate transition-colors"
                      >
                        {agent.name}
                      </Link>
                      <p className="text-[12.5px] text-muted-foreground truncate mt-0.5">{agent.email}</p>
                      <p className="text-[12px] text-primary font-bold mt-1">
                        # {displayRank}
                      </p>
                    </div>
                    {/* More Settings Card Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdownCard(isDropdownActive ? null : agent.id)}
                        className="h-7 w-7 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors text-[16px]"
                      >
                        <i className="ri-more-2-fill" />
                      </button>
                      {isDropdownActive && (
                        <div className="absolute right-0 mt-1 w-32 bg-card border border-border rounded-[5px] shadow-lg py-1 z-10 text-[12px] text-foreground text-left">
                          <Link href={`/agents/${agent.id}`} className="block px-3 py-1.5 hover:bg-muted font-semibold">
                            View Profile
                          </Link>
                          <Link href="/agents/add" className="block px-3 py-1.5 hover:bg-muted font-semibold">
                            Edit Agent
                          </Link>
                          <button
                            onClick={() => handleDelete(agent.id)}
                            className="w-full text-left text-[#ff5b5b] block px-3 py-1.5 hover:bg-[#ff5b5b]/10 font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Middle Info */}
                <div className="py-4 space-y-2.5 text-[13px] text-muted-foreground">
                  <p className="flex items-center gap-2 font-semibold">
                    <iconify-icon icon="solar:home-bold-duotone" className="text-[18px] text-primary" />
                    <span className="text-foreground">{agent.properties}</span> Properties
                  </p>
                  <p className="flex items-center gap-2 font-semibold leading-snug line-clamp-2">
                    <iconify-icon icon="solar:map-point-wave-bold-duotone" className="text-[18px] text-primary shrink-0" />
                    {agent.address}
                  </p>
                  <div className="pt-2">
                    <h5 className="text-[12.5px] font-bold text-foreground mb-2">Social Media :</h5>
                    <div className="flex gap-1.5">
                      <a href={agent.socials.facebook} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded bg-soft-primary text-primary hover:bg-[#604ae3] hover:text-white flex items-center justify-center text-[16px] transition-all">
                        <i className="ri-facebook-fill" />
                      </a>
                      <a href={agent.socials.instagram} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded bg-soft-danger text-danger hover:bg-[#ff5b5b] hover:text-white flex items-center justify-center text-[16px] transition-all">
                        <i className="ri-instagram-line" />
                      </a>
                      <a href={agent.socials.twitter} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded bg-soft-info text-info hover:bg-[#39afd1] hover:text-white flex items-center justify-center text-[16px] transition-all">
                        <i className="ri-twitter-line" />
                      </a>
                      <a href={agent.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded bg-soft-success text-success hover:bg-[#0acf97] hover:text-white flex items-center justify-center text-[16px] transition-all">
                        <i className="ri-whatsapp-line" />
                      </a>
                      <a href={agent.socials.email} className="h-8 w-8 rounded bg-soft-warning text-warning hover:bg-[#f1b53d] hover:text-white flex items-center justify-center text-[16px] transition-all">
                        <i className="ri-mail-line" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Card Footer Call/Message */}
                <div className="border-t border-border pt-4 mt-2">
                  <div className="grid grid-cols-2 gap-2.5">
                    <a
                      href={`tel:${agent.phone}`}
                      className="bg-[#604ae3] text-white text-[12.5px] font-bold py-2 px-3 rounded-[5px] flex items-center justify-center gap-1 hover:bg-[#503bc7] active:scale-[0.98] transition-all text-center"
                    >
                      <iconify-icon icon="solar:outgoing-call-rounded-broken" className="text-[17px] align-middle" />
                      Call Us
                    </a>
                    <a
                      href={`mailto:${agent.email}`}
                      className="bg-secondary hover:bg-secondary-foreground/10 text-secondary-foreground text-[12.5px] font-bold py-2 px-3 rounded-[5px] flex items-center justify-center gap-1 active:scale-[0.98] transition-all text-center"
                    >
                      <iconify-icon icon="solar:chat-round-dots-broken" className="text-[16px] align-middle" />
                      Message
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Pagination Footer ────────────────────────────────────────── */}
      {filteredAgents.length > 0 && (
        <div className="bg-card border border-border rounded-[8px] p-4 shadow-[0_0_35px_rgba(154,161,171,0.05)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="font-semibold text-foreground">
              {Math.min(currentPage * itemsPerPage, filteredAgents.length)}
            </span>{" "}
            of <span className="font-semibold text-foreground">{filteredAgents.length}</span> Agents
          </p>
          <nav className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className={`text-[12.5px] border border-border px-3 py-1.5 rounded-[5px] font-medium transition-colors ${
                currentPage === 1
                  ? "text-muted-foreground/40 cursor-not-allowed"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const active = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  className={`text-[12.5px] px-3.5 py-1.5 rounded-[5px] font-bold border transition-all ${
                    active
                      ? "border-[#604ae3] bg-[#604ae3] text-white"
                      : "border-border text-muted-foreground hover:bg-muted font-medium"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className={`text-[12.5px] border border-border px-3 py-1.5 rounded-[5px] font-medium transition-colors ${
                currentPage === totalPages
                  ? "text-muted-foreground/40 cursor-not-allowed"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
