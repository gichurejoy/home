"use client";

import { useAppStore } from "@/store/useAppStore";
import { notFound } from "next/navigation";
import Link from "next/link";
import { use, useState } from "react";
import DetailChartsClient from "./DetailChartsClient";
import { RecordDealModal } from "@/components/modals/RecordDealModal";
import { EntityNotesCard } from "@/components/ui/EntityNotesCard";

export default function AgentDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { agents, closedDeals, properties } = useAppStore();
  const [isRecordDealOpen, setIsRecordDealOpen] = useState(false);

  // Resolve direct match (AGT-001) and numeric index matches (1, 01, etc.)
  const agent = agents.find((a) => {
    const idLower = resolvedParams.id.toLowerCase();
    const aIdLower = a.id.toLowerCase();
    if (aIdLower === idLower) return true;
    const numericPart = aIdLower.replace("agt-", "").replace(/^0+/, "");
    if (numericPart === idLower.replace(/^0+/, "")) return true;
    return false;
  });

  if (!agent) {
    notFound();
  }

  // Get index rank (1-based)
  const displayRank = agents.indexOf(agent) + 1;

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-[20px] font-bold text-foreground">Agent Overview</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Profile overview of {agent.name}</p>
        </div>
        <ol className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <li>
            <a href="/" className="hover:text-primary transition-colors">Real Estate</a>
          </li>
          <li><i className="ri-arrow-right-s-line text-[12px]" /></li>
          <li>
            <Link href="/agents/grid" className="hover:text-primary transition-colors">Agents</Link>
          </li>
          <li><i className="ri-arrow-right-s-line text-[12px]" /></li>
          <li className="text-primary font-medium">Agent Overview</li>
        </ol>
      </div>

      {/* Hero Banner Cover Card */}
      <div className="bg-card border border-border rounded-[8px] overflow-hidden shadow-[0_0_35px_rgba(154,161,171,0.05)]">
        <div className="relative aspect-[21/9] md:aspect-[32/9] bg-muted/20">
          <img
            src="/assets/images/properties/p-12.jpg"
            alt="Agent Banner Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-5 text-white">
            <h2 className="text-[20px] md:text-[24px] font-bold">{agent.name}</h2>
            <p className="text-[13px] text-white/95 font-medium">{agent.agency}</p>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Profile Card, Stats, Bio, Files, Reviews (col-xl-8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Profile overview card */}
          <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="avatar-xl rounded-full border-[3px] border-muted object-cover w-20 h-20 shadow-sm"
                  />
                  <span className="absolute bottom-0 start-50 -translate-x-1/2 translate-y-1 bg-[#0acf97] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                    # {displayRank}
                  </span>
                </div>
                <div>
                  <h4 className="text-[17px] font-bold text-foreground leading-snug">{agent.name}</h4>
                  <p className="text-[12.5px] text-muted-foreground mt-0.5">{agent.email}</p>
                  <p className="text-[12px] text-[#ffb12f] font-semibold mt-1 flex items-center gap-0.5">
                    <i className="ri-star-fill" /> {agent.rating} <span className="text-muted-foreground font-normal ml-0.5">(28 reviews)</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setIsRecordDealOpen(true)}
                  className="bg-[#0acf97] hover:bg-[#0acf97]/90 text-white text-[13.5px] font-bold py-2 px-4 rounded-[5px] active:scale-[0.98] transition-all text-center flex items-center gap-1.5 shadow-sm"
                >
                  <i className="ri-exchange-dollar-line text-[16px] align-middle" /> Record Deal
                </button>
                <a
                  href={`mailto:${agent.email}`}
                  className="bg-card border border-border text-foreground hover:bg-muted text-[13.5px] font-bold py-2 px-4 rounded-[5px] active:scale-[0.98] transition-all text-center flex items-center gap-1.5"
                >
                  <iconify-icon icon="solar:chat-round-dots-broken" className="text-[16px] align-middle" /> Message
                </a>
              </div>
            </div>

            {/* Address & Socials block */}
            <div className="py-4 border-b border-border space-y-2.5 text-[13px] text-muted-foreground">
              <p className="flex items-center gap-2">
                <iconify-icon icon="solar:map-point-wave-bold-duotone" className="text-[18px] text-primary" />
                <span className="font-semibold text-foreground">Address:</span> {agent.address}
              </p>
              <p className="flex items-center gap-2">
                <iconify-icon icon="solar:outgoing-call-rounded-bold-duotone" className="text-[18px] text-primary" />
                <span className="font-semibold text-foreground">Phone:</span> {agent.phone}
              </p>

              <div className="pt-2">
                <h5 className="text-[13px] font-bold text-foreground mb-2">Social Media :</h5>
                <div className="flex gap-1.5">
                  <a href={agent.socials.facebook} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded bg-[#3b5998]/10 text-[#3b5998] hover:bg-[#3b5998] hover:text-white flex items-center justify-center text-[16px] transition-all">
                    <i className="ri-facebook-fill" />
                  </a>
                  <a href={agent.socials.instagram} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded bg-[#e1306c]/10 text-[#e1306c] hover:bg-[#e1306c] hover:text-white flex items-center justify-center text-[16px] transition-all">
                    <i className="ri-instagram-line" />
                  </a>
                  <a href={agent.socials.twitter} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded bg-[#1da1f2]/10 text-[#1da1f2] hover:bg-[#1da1f2] hover:text-white flex items-center justify-center text-[16px] transition-all">
                    <i className="ri-twitter-line" />
                  </a>
                  <a href={agent.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded bg-[#25d366]/10 text-[#25d366] hover:bg-[#25d366] hover:text-white flex items-center justify-center text-[16px] transition-all">
                    <i className="ri-whatsapp-line" />
                  </a>
                  <a href={agent.socials.email} className="h-8 w-8 rounded bg-muted text-foreground hover:bg-[#604ae3] hover:text-white flex items-center justify-center text-[16px] transition-all">
                    <i className="ri-mail-line" />
                  </a>
                </div>
              </div>
            </div>

            {/* About and License Block */}
            <div className="pt-4 space-y-3">
              <h4 className="text-[14px] font-bold text-foreground">About {agent.name.split(" ")[0]} :</h4>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{agent.bio}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-[12.5px] pt-2 font-semibold">
                <p className="text-muted-foreground"><span className="text-foreground font-bold">Agency</span> : {agent.agency}</p>
                <p className="text-muted-foreground"><span className="text-foreground font-bold">Agent License</span> : {agent.license}</p>
                <p className="text-muted-foreground"><span className="text-foreground font-bold">Text Number</span> : {agent.textNumber}</p>
                <p className="text-muted-foreground"><span className="text-foreground font-bold">Services Area</span> : {agent.servicesArea}</p>
              </div>
            </div>
          </div>

          {/* Property status Sparkline widget cards */}
          {(() => {
            const agentProperties = properties.filter(p => p.agentId === agent.id);
            const agentDeals = closedDeals.filter(d => d.agentId === agent.id);
            
            const listingsCount = agent.listingsCount - 2 + agentProperties.filter(p => p.status !== "Sold").length;
            const soldCount = agent.soldCount - 3 + agentDeals.length;
            const rentCount = agent.rentCount;
            const commissionEarned = agentDeals.reduce((sum, d) => sum + d.agentPayout, 0);

            return (
              <div className="space-y-3">
                <h4 className="text-[14.5px] font-bold text-foreground">Property Status :</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  
                  {/* Card 1: Total Listing */}
                  <div className="bg-card border border-border rounded-[8px] p-4 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="h-9 w-9 bg-primary/10 rounded flex items-center justify-center mb-3">
                          <iconify-icon icon="solar:home-bold" className="text-[20px] text-primary" />
                        </div>
                        <p className="text-[12.5px] font-semibold text-muted-foreground">Total Listing</p>
                        <h4 className="text-[22px] font-bold text-foreground mt-0.5">{listingsCount}</h4>
                      </div>
                      <div className="w-[110px]">
                        <DetailChartsClient chartType="listings" color="#604ae3" />
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Property Sold */}
                  <div className="bg-card border border-border rounded-[8px] p-4 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="h-9 w-9 bg-primary/10 rounded flex items-center justify-center mb-3">
                          <iconify-icon icon="solar:wallet-money-bold" className="text-[20px] text-primary" />
                        </div>
                        <p className="text-[12.5px] font-semibold text-muted-foreground">Property Sold</p>
                        <h4 className="text-[22px] font-bold text-foreground mt-0.5">{soldCount}</h4>
                      </div>
                      <div className="w-[110px]">
                        <DetailChartsClient chartType="sold" color="#0acf97" />
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Property Rent */}
                  <div className="bg-card border border-border rounded-[8px] p-4 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="h-9 w-9 bg-primary/10 rounded flex items-center justify-center mb-3">
                          <iconify-icon icon="solar:hand-money-bold" className="text-[20px] text-primary" />
                        </div>
                        <p className="text-[12.5px] font-semibold text-muted-foreground">Property Rent</p>
                        <h4 className="text-[22px] font-bold text-foreground mt-0.5">{rentCount}</h4>
                      </div>
                      <div className="w-[110px]">
                        <DetailChartsClient chartType="rent" color="#ffb12f" />
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Commission Earned */}
                  <div className="bg-card border border-border rounded-[8px] p-4 shadow-[0_0_35px_rgba(154,161,171,0.05)]">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="h-9 w-9 bg-primary/10 rounded flex items-center justify-center mb-3">
                          <iconify-icon icon="solar:double-alt-arrow-up-bold" className="text-[20px] text-primary" />
                        </div>
                        <p className="text-[12.5px] font-semibold text-muted-foreground">Commission Earned</p>
                        <h4 className="text-[22px] font-bold text-foreground mt-0.5">${commissionEarned.toLocaleString()}</h4>
                      </div>
                      <div className="w-[110px]">
                        <DetailChartsClient chartType="listings" color="#39afd1" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })()}

          {/* ── B2B SaaS Premium Feature: Commission Splits & Payout Progress ── */}
          {(() => {
            const agentDeals = closedDeals.filter(d => d.agentId === agent.id);
            const totalEarned = agentDeals.reduce((sum, d) => sum + d.agentPayout, 0);
            const capMet = Math.min(100, Math.round((totalEarned / 100000) * 100));

            return (
              <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.08)] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-3">
                  <div>
                    <span className="bg-[#604ae3]/10 text-[#604ae3] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-[4px] tracking-wider">
                      B2B SaaS Premium
                    </span>
                    <h4 className="text-[15.5px] font-bold text-foreground mt-1.5 flex items-center gap-1.5">
                      <iconify-icon icon="solar:graph-bold-duotone" className="text-[19px] text-primary" />
                      Commission Cap & Split Progress
                    </h4>
                    <p className="text-[12.5px] text-muted-foreground mt-0.5">
                      Real-time brokerage split cap tracking. Agent keeps 100% of splits after hitting cap.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[13px] font-extrabold text-[#0acf97] bg-soft-success px-2.5 py-1 rounded">
                      {capMet >= 100 ? "100% Cap-Met Split" : "80/20 Tiered Split"}
                    </span>
                  </div>
                </div>

                {/* Cap Status Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[12.5px] font-bold">
                    <span className="text-muted-foreground">Annual Split Cap Status ($100K Limit)</span>
                    <span className="text-foreground">${totalEarned.toLocaleString()} / $100,000 ({capMet}% Met)</span>
                  </div>
                  <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${capMet >= 100 ? "bg-[#0acf97]" : "bg-[#604ae3]"}`}
                      style={{ width: `${capMet}%` }}
                    />
                  </div>
                  <p className="text-[11.5px] text-muted-foreground">
                    {capMet >= 100
                      ? "🎉 Cap met! This agent is now on 100% commission splits for the remainder of the calendar year."
                      : `Agent needs $${(100000 - totalEarned).toLocaleString()} more in split payouts to achieve 100% commission rate.`}
                  </p>
                </div>

                {/* Split Ledger Table */}
                <div className="space-y-3.5 pt-2">
                  <h5 className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">
                    Recent Closed Deal Split Ledger
                  </h5>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border text-[12px] font-semibold text-muted-foreground">
                          <th className="pb-2.5">Property / Deal</th>
                          <th className="pb-2.5">Gross Commission</th>
                          <th className="pb-2.5">Split Ratio</th>
                          <th className="pb-2.5">Agent Payout</th>
                          <th className="pb-2.5 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-[12.5px] font-medium text-foreground/80">
                        {agentDeals.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-6 text-center text-muted-foreground">
                              No deals closed yet.
                            </td>
                          </tr>
                        ) : (
                          agentDeals.map((row) => (
                            <tr key={row.id} className="hover:bg-muted/10">
                              <td className="py-2.5 font-bold text-foreground">{row.propertyTitle}</td>
                              <td className="py-2.5">{row.grossCommission.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</td>
                              <td className="py-2.5">
                                <span className={`text-[11px] px-1.5 py-0.2 rounded font-bold ${
                                  row.splitRatio.includes("Cap-Met") ? "bg-[#0acf97]/15 text-[#0acf97]" : "bg-primary/10 text-primary"
                                }`}>
                                  {row.splitRatio}
                                </span>
                              </td>
                              <td className="py-2.5 text-success font-bold">{row.agentPayout.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</td>
                              <td className="py-2.5 text-right font-bold text-muted-foreground">
                                <span className={`text-[11px] px-2 py-0.5 rounded font-bold ${
                                  row.status === "Paid" ? "bg-soft-success text-success" : "bg-soft-warning text-warning"
                                }`}>
                                  {row.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Reviews List Widget */}
          <div className="space-y-4">
            <h4 className="text-[14.5px] font-bold text-foreground">Reviews :</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Review 1 */}
              <div className="bg-card border border-border rounded-[8px] p-4 shadow-[0_0_35px_rgba(154,161,171,0.05)] space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src="/assets/images/users/avatar-3.jpg"
                    alt="Esther Howard"
                    className="h-11 w-11 rounded-full object-cover border border-muted"
                  />
                  <div>
                    <h5 className="font-bold text-foreground text-[14px]">Esther Howard</h5>
                    <p className="text-[12px] text-muted-foreground font-medium">@estherhoward <span className="text-foreground/80 font-bold ml-1">(U.S.A)</span></p>
                  </div>
                </div>
                <p className="text-[12.5px] text-muted-foreground leading-relaxed italic">
                  &ldquo;The team at agent went above and beyond to understand my needs and tailor their solutions to fit my business requirements. Not only did they exceed our expectations.&rdquo;
                </p>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex text-amber-400 gap-0.5 text-[14px]">
                    <i className="ri-star-fill" /><i className="ri-star-fill" /><i className="ri-star-fill" /><i className="ri-star-fill" /><i className="ri-star-half-fill" />
                  </div>
                  <p className="text-[11px] text-muted-foreground font-semibold">3 Days Ago</p>
                </div>
              </div>

              {/* Review 2 */}
              <div className="bg-card border border-border rounded-[8px] p-4 shadow-[0_0_35px_rgba(154,161,171,0.05)] space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src="/assets/images/users/avatar-4.jpg"
                    alt="Elbart Bant"
                    className="h-11 w-11 rounded-full object-cover border border-muted"
                  />
                  <div>
                    <h5 className="font-bold text-foreground text-[14px]">Elbart Bant</h5>
                    <p className="text-[12px] text-muted-foreground font-medium">@elbartbant <span className="text-foreground/80 font-bold ml-1">(Canada)</span></p>
                  </div>
                </div>
                <p className="text-[12.5px] text-muted-foreground leading-relaxed italic">
                  &ldquo;The agent team exceeded expectations in my needs and customizing their solutions to perfectly align with my business requirements. Game-changer for our business.&rdquo;
                </p>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex text-amber-400 gap-0.5 text-[14px]">
                    <i className="ri-star-fill" /><i className="ri-star-fill" /><i className="ri-star-fill" /><i className="ri-star-fill" /><i className="ri-star-fill" />
                  </div>
                  <p className="text-[11px] text-muted-foreground font-semibold">15 Days Ago</p>
                </div>
              </div>

            </div>
          </div>

          {/* Property Files widget */}
          <div className="space-y-3.5">
            <h4 className="text-[14.5px] font-bold text-foreground">Property Files :</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* File 1 */}
              <div className="border border-border rounded p-3 bg-muted/10 flex items-center justify-between relative hover:bg-muted/25 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <iconify-icon icon="solar:file-check-bold" className="text-rose-500 text-[26px]" />
                  <div className="min-w-0">
                    <h5 className="text-[12.5px] font-bold text-foreground truncate"><a href="#!" className="stretched-link">Property-File.pdf</a></h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5">2.4 MB</p>
                  </div>
                </div>
                <i className="ri-download-cloud-2-line text-muted-foreground text-[18px] shrink-0" />
              </div>

              {/* File 2 */}
              <div className="border border-border rounded p-3 bg-muted/10 flex items-center justify-between relative hover:bg-muted/25 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <iconify-icon icon="solar:user-bold" className="text-primary text-[26px]" />
                  <div className="min-w-0">
                    <h5 className="text-[12.5px] font-bold text-foreground truncate"><a href="#!" className="stretched-link">Client-List.pdf</a></h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5">1.6 MB</p>
                  </div>
                </div>
                <i className="ri-download-cloud-2-line text-muted-foreground text-[18px] shrink-0" />
              </div>

              {/* File 3 */}
              <div className="border border-border rounded p-3 bg-muted/10 flex items-center justify-between relative hover:bg-muted/25 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <iconify-icon icon="solar:gallery-minimalistic-bold" className="text-emerald-500 text-[26px]" />
                  <div className="min-w-0">
                    <h5 className="text-[12.5px] font-bold text-foreground truncate"><a href="#!" className="stretched-link">Property-Photo.pdf</a></h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5">23.2 MB</p>
                  </div>
                </div>
                <i className="ri-download-cloud-2-line text-muted-foreground text-[18px] shrink-0" />
              </div>

              {/* File 4 */}
              <div className="border border-border rounded p-3 bg-muted/10 flex items-center justify-between relative hover:bg-muted/25 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <iconify-icon icon="solar:streets-map-point-bold" className="text-amber-500 text-[26px]" />
                  <div className="min-w-0">
                    <h5 className="text-[12.5px] font-bold text-foreground truncate"><a href="#!" className="stretched-link">Area-sqft.png</a></h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5">2.3 MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <EntityNotesCard entityId={agent.id} />
        </div>

        {/* Right Column: Trophy/Medal, Location Vector Map, Contact Scheduler Form (col-xl-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Trophy Medal Card */}
          <div className="bg-card border border-border rounded-[8px] p-5 shadow-[0_0_35px_rgba(154,161,171,0.05)] text-center relative overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border pb-3 text-left">
              <img
                src={agent.avatar}
                alt={agent.name}
                className="h-10 w-10 rounded-full object-cover border border-muted"
              />
              <div>
                <h5 className="font-bold text-foreground text-[13.5px]">{agent.name}</h5>
                <p className="text-[11.5px] text-muted-foreground font-semibold">#1 Medalist</p>
              </div>
              <div className="ms-auto h-9 w-9 bg-primary/10 rounded flex items-center justify-center shrink-0">
                <iconify-icon icon="solar:cup-star-bold" className="text-primary text-[20px]" />
              </div>
            </div>

            <div className="py-6 bg-[#604ae3]/5 border border-dashed border-[#604ae3]/30 rounded mt-4 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
              <img
                src="/assets/images/trophy.png"
                alt="Trophy Award"
                className="h-28 w-28 object-contain z-1"
              />
              <span className="absolute top-2.5 right-2.5 z-10 text-[11px] font-bold px-2 py-0.5 rounded text-white bg-rose-500 shadow-sm">
                # 1
              </span>
              <h5 className="font-extrabold text-[#604ae3] text-[15px] mt-4 z-1">Top Sales Award</h5>
              <p className="text-[11.5px] text-muted-foreground max-w-[200px] mt-1 z-1 leading-snug">Awarded for closing the highest real estate portfolios this fiscal month.</p>
            </div>
          </div>

          {/* Interactive Google Map of Agent Service Area */}
          <div className="bg-card border border-border rounded-[8px] overflow-hidden shadow-[0_0_35px_rgba(154,161,171,0.05)]">
            <div className="px-5 py-4 bg-muted/10 border-b border-border">
              <h4 className="text-[15px] font-bold text-foreground">Services Area Location</h4>
            </div>
            <div className="p-5">
              <div className="overflow-hidden rounded border border-border h-48 bg-muted/10">
                <iframe
                  className="w-full h-full"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://maps.google.com/maps?width=100%25&height=200&hl=en&q=${encodeURIComponent(agent.address)}&t=&z=13&ie=UTF8&iwloc=B&output=embed`}
                />
              </div>
              <div className="mt-3.5 bg-muted/20 p-3 rounded flex items-center justify-between border border-border/80">
                <div className="min-w-0">
                  <h5 className="text-[13px] font-bold text-foreground leading-snug">Primary Hub</h5>
                  <p className="text-[11.5px] text-muted-foreground truncate mt-0.5 max-w-[180px]" title={agent.address}>{agent.address}</p>
                </div>
                <div className="h-9 w-9 bg-primary text-white rounded flex items-center justify-center shrink-0">
                  <iconify-icon icon="solar:point-on-map-perspective-bold" className="text-[18px]" />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Scheduler Form */}
          <div className="bg-card border border-border rounded-[8px] overflow-hidden shadow-[0_0_35px_rgba(154,161,171,0.05)]">
            <div className="px-5 py-4 bg-muted/10 border-b border-border">
              <h4 className="text-[15px] font-bold text-foreground">Schedule Consultation</h4>
            </div>
            <form className="p-5 space-y-3.5">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors"
                  required
                />
                <input
                  type="time"
                  className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors placeholder:text-muted-foreground/60"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors placeholder:text-muted-foreground/60"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors placeholder:text-muted-foreground/60"
              />
              <textarea
                rows={4}
                placeholder="Your Message..."
                className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] px-3 py-2 outline-none focus:border-[#604ae3] transition-colors placeholder:text-muted-foreground/60 resize-none leading-relaxed"
                required
              />
              <button
                type="submit"
                className="w-full bg-[#604ae3] text-white text-[13.5px] font-bold py-2 rounded-[5px] hover:bg-[#503bc7] active:scale-[0.98] transition-all"
              >
                Book Appointment
              </button>
            </form>
          </div>

        </div>

      </div>
      <RecordDealModal
        isOpen={isRecordDealOpen}
        onClose={() => setIsRecordDealOpen(false)}
        defaultAgentId={agent.id}
      />
    </div>
  );
}
