"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/store/useToastStore";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Trash2, Home, ArrowLeft, Check, X, Plus, Star, Award } from "lucide-react";
import Link from "next/link";

export default function ComparePropertiesPage() {
  const { 
    comparedPropertyIds, 
    toggleComparedPropertyId, 
    clearComparedProperties,
    properties,
    agents
  } = useAppStore();

  const [presentationMode, setPresentationMode] = useState(false);
  const [clientRatings, setClientRatings] = useState<Record<string, number>>({});
  const [presentationNotes, setPresentationNotes] = useState("We have handpicked these listings based on your target investment budget, location preferences, and upgrade yield potential. Let me know which one stands out!");

  const selectedProperties = properties.filter(p => comparedPropertyIds.includes(p.id));

  const handleRemove = (id: string) => {
    toggleComparedPropertyId(id);
    toast.success("Property removed from comparison.");
  };

  // Get all unique facilities across compared properties
  const allFacilities = Array.from(
    new Set(selectedProperties.flatMap(p => p.facilities))
  );

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
        <div>
          <Breadcrumb />
          <h1 className="text-[20px] font-bold text-foreground">Property Comparison Tool</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Compare specifications and features side-by-side</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedProperties.length > 0 && (
            <button
              onClick={() => {
                setPresentationMode(!presentationMode);
                toast.success(`Client Presentation Mode ${!presentationMode ? "enabled" : "disabled"}.`);
              }}
              className={`flex items-center gap-1.5 text-[12.5px] font-bold px-3.5 py-1.5 rounded-[5px] border transition-all cursor-pointer border-0 ${
                presentationMode
                  ? "bg-[#0acf97] text-white hover:bg-[#09bc8a]"
                  : "bg-[#604ae3]/10 text-[#604ae3] border-[#604ae3]/20 hover:bg-[#604ae3] hover:text-white"
              }`}
            >
              <Award className="h-4 w-4" /> {presentationMode ? "Exit Client View" : "Client View Mode"}
            </button>
          )}
          <Link
            href="/properties/grid"
            className="flex items-center gap-1.5 text-[12.5px] font-bold text-muted-foreground border border-border bg-card hover:bg-muted px-3.5 py-1.5 rounded-[5px] transition-all"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Listings
          </Link>
          {selectedProperties.length > 0 && (
            <button
              onClick={() => {
                clearComparedProperties();
                toast.success("Comparison cleared.");
              }}
              className="bg-danger/10 hover:bg-danger text-danger hover:text-white text-[12.5px] font-bold px-3.5 py-1.5 rounded-[5px] flex items-center gap-1 transition-all"
            >
              <Trash2 className="h-4 w-4" /> Clear All
            </button>
          )}
        </div>
      </div>

      {selectedProperties.length === 0 ? (
        <div className="bg-card border border-border rounded-[8px] p-12 text-center shadow-[0_0_35px_rgba(154,161,171,0.05)]">
          <Home className="h-12 w-12 text-muted-foreground/60 mx-auto mb-3" />
          <h3 className="text-[16px] font-bold text-foreground">No properties selected for comparison</h3>
          <p className="text-[13px] text-muted-foreground mt-1 max-w-md mx-auto">
            Go to the property grid or list, select the properties you want to compare by checking the &quot;Compare&quot; box, and return here.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link
              href="/properties/grid"
              className="bg-primary hover:bg-primary/95 text-white text-[13px] font-bold px-4 py-2 rounded-[5px] transition-all"
            >
              Browse Property Grid
            </Link>
            <Link
              href="/properties/list"
              className="border border-border text-foreground hover:bg-muted text-[13px] font-bold px-4 py-2 rounded-[5px] transition-all"
            >
              Browse Property List
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Client Presentation Banner & Custom Notes */}
          {presentationMode && (
            <div className="bg-gradient-to-r from-[#604ae3]/10 to-[#604ae3]/5 border border-[#604ae3]/20 rounded-xl p-5 text-left flex flex-col md:flex-row gap-5 items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded bg-primary flex items-center justify-center text-white">
                    <Award className="h-4 w-4" />
                  </div>
                  <h3 className="text-[16px] font-bold text-foreground">Curated Client Property Showcase</h3>
                </div>
                <textarea
                  value={presentationNotes}
                  onChange={(e) => setPresentationNotes(e.target.value)}
                  className="w-full text-[13px] border border-border bg-card/60 text-foreground rounded-lg p-2.5 outline-none focus:border-primary transition-colors font-medium resize-none leading-relaxed"
                  rows={2}
                />
              </div>
              <div className="border border-border bg-card p-3 rounded-lg flex items-center gap-3 shrink-0">
                <img src="/assets/images/users/avatar-2.jpg" className="h-10 w-10 rounded-full object-cover border" alt="" />
                <div>
                  <p className="text-[12px] font-bold text-foreground">Dominic Keller</p>
                  <p className="text-[10px] text-muted-foreground">Managing Broker & Advisor</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-card border border-border rounded-[8px] shadow-[0_0_35px_rgba(154,161,171,0.05)] overflow-hidden">
          {/* Scrollable table container */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left min-w-[600px] table-fixed">
              <thead>
                <tr className="border-b border-border bg-muted/10">
                  <th className="py-4 px-5 font-bold text-[13px] text-muted-foreground w-[220px]">
                    Property details
                  </th>
                  {selectedProperties.map(p => (
                    <th key={p.id} className="py-4 px-5 relative align-top">
                      <button
                        onClick={() => handleRemove(p.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-danger/10 hover:bg-danger text-danger hover:text-white transition-all"
                        title="Remove from comparison"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>

                      <div className="space-y-2.5 mt-2 pr-6">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-full h-[120px] object-cover rounded-md border border-border"
                        />
                        <div>
                          <Link href={`/properties/${p.id}`} className="font-bold text-[14px] text-foreground hover:text-primary transition-colors block line-clamp-1">
                            {p.title}
                          </Link>
                          <span className={`inline-block text-[11px] font-bold px-1.5 py-0.2 rounded mt-1.5 text-white ${
                            p.status === "For Rent" ? "bg-emerald-500" :
                            p.status === "For Sale" ? "bg-amber-500" :
                            "bg-red-500"
                          }`}>
                            {p.status}
                          </span>
                        </div>
                      </div>
                    </th>
                  ))}
                  {/* Fill empty columns up to 4 */}
                  {Array.from({ length: Math.max(0, 4 - selectedProperties.length) }).map((_, idx) => (
                    <th key={`empty-th-${idx}`} className="py-4 px-5 align-middle border-l border-border/40 text-center text-muted-foreground/30 font-medium text-[13px]">
                      <div className="border-2 border-dashed border-border/60 rounded-lg py-12 px-4 flex flex-col items-center justify-center">
                        <Plus className="h-6 w-6 mb-2" />
                        <span>Add property</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-border text-[13.5px] font-medium text-foreground">
                {/* Client Ratings Row */}
                {presentationMode && (
                  <tr className="bg-[#604ae3]/5">
                    <td className="py-3 px-5 text-[#604ae3] font-bold">Client Feedback</td>
                    {selectedProperties.map(p => {
                      const currentRating = clientRatings[p.id] || 0;
                      return (
                        <td key={p.id} className="py-3 px-5 border-l border-border/40">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => {
                                  setClientRatings(prev => ({ ...prev, [p.id]: star }));
                                  toast.success(`Rated ${p.title} ${star} Stars!`);
                                }}
                                className="bg-transparent border-0 p-0 cursor-pointer"
                              >
                                <Star
                                  className={`h-5 w-5 ${
                                    star <= currentRating
                                      ? "fill-[#f9bc0b] text-[#f9bc0b]"
                                      : "text-muted-foreground/45 hover:text-[#f9bc0b]"
                                  } transition-colors`}
                                />
                              </button>
                            ))}
                          </div>
                        </td>
                      );
                    })}
                    {Array.from({ length: Math.max(0, 4 - selectedProperties.length) }).map((_, idx) => (
                      <td key={`empty-rating-${idx}`} className="py-3 px-5 border-l border-border/40" />
                    ))}
                  </tr>
                )}

                {/* Price Row */}
                <tr>
                  <td className="py-3 px-5 text-muted-foreground font-bold bg-muted/5">Price</td>
                  {selectedProperties.map(p => (
                    <td key={p.id} className="py-3 px-5 font-bold text-primary text-[15px] border-l border-border/40">
                      ${p.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  ))}
                  {Array.from({ length: Math.max(0, 4 - selectedProperties.length) }).map((_, idx) => (
                    <td key={`empty-price-${idx}`} className="py-3 px-5 border-l border-border/40 bg-muted/5" />
                  ))}
                </tr>

                {/* Location Row */}
                <tr>
                  <td className="py-3 px-5 text-muted-foreground font-bold bg-muted/5">Location</td>
                  {selectedProperties.map(p => (
                    <td key={p.id} className="py-3 px-5 text-muted-foreground border-l border-border/40">
                      {p.location}
                    </td>
                  ))}
                  {Array.from({ length: Math.max(0, 4 - selectedProperties.length) }).map((_, idx) => (
                    <td key={`empty-loc-${idx}`} className="py-3 px-5 border-l border-border/40 bg-muted/5" />
                  ))}
                </tr>

                {/* Type Row */}
                <tr>
                  <td className="py-3 px-5 text-muted-foreground font-bold bg-muted/5">Property Type</td>
                  {selectedProperties.map(p => (
                    <td key={p.id} className="py-3 px-5 border-l border-border/40">
                      {p.type}
                    </td>
                  ))}
                  {Array.from({ length: Math.max(0, 4 - selectedProperties.length) }).map((_, idx) => (
                    <td key={`empty-type-${idx}`} className="py-3 px-5 border-l border-border/40 bg-muted/5" />
                  ))}
                </tr>

                {/* Size Row */}
                <tr>
                  <td className="py-3 px-5 text-muted-foreground font-bold bg-muted/5">Size</td>
                  {selectedProperties.map(p => (
                    <td key={p.id} className="py-3 px-5 border-l border-border/40 text-muted-foreground">
                      {p.area} sqft
                    </td>
                  ))}
                  {Array.from({ length: Math.max(0, 4 - selectedProperties.length) }).map((_, idx) => (
                    <td key={`empty-size-${idx}`} className="py-3 px-5 border-l border-border/40 bg-muted/5" />
                  ))}
                </tr>

                {/* Bedrooms Row */}
                <tr>
                  <td className="py-3 px-5 text-muted-foreground font-bold bg-muted/5">Bedrooms</td>
                  {selectedProperties.map(p => (
                    <td key={p.id} className="py-3 px-5 border-l border-border/40">
                      {p.bedrooms} BHK
                    </td>
                  ))}
                  {Array.from({ length: Math.max(0, 4 - selectedProperties.length) }).map((_, idx) => (
                    <td key={`empty-bed-${idx}`} className="py-3 px-5 border-l border-border/40 bg-muted/5" />
                  ))}
                </tr>

                {/* Bathrooms Row */}
                <tr>
                  <td className="py-3 px-5 text-muted-foreground font-bold bg-muted/5">Bathrooms</td>
                  {selectedProperties.map(p => (
                    <td key={p.id} className="py-3 px-5 border-l border-border/40">
                      {p.bathrooms} Bath
                    </td>
                  ))}
                  {Array.from({ length: Math.max(0, 4 - selectedProperties.length) }).map((_, idx) => (
                    <td key={`empty-bath-${idx}`} className="py-3 px-5 border-l border-border/40 bg-muted/5" />
                  ))}
                </tr>

                {/* Floors Row */}
                <tr>
                  <td className="py-3 px-5 text-muted-foreground font-bold bg-muted/5">Floors</td>
                  {selectedProperties.map(p => (
                    <td key={p.id} className="py-3 px-5 border-l border-border/40">
                      {p.floors}
                    </td>
                  ))}
                  {Array.from({ length: Math.max(0, 4 - selectedProperties.length) }).map((_, idx) => (
                    <td key={`empty-floor-${idx}`} className="py-3 px-5 border-l border-border/40 bg-muted/5" />
                  ))}
                </tr>

                {/* Agent Assignment */}
                {!presentationMode && (
                  <tr>
                    <td className="py-3 px-5 text-muted-foreground font-bold bg-muted/5">Listing Agent</td>
                    {selectedProperties.map(p => {
                      const agent = agents.find(a => a.id === p.agentId);
                      return (
                        <td key={p.id} className="py-3 px-5 border-l border-border/40">
                          {agent ? (
                            <div className="flex items-center gap-2">
                              <img src={agent.avatar} className="h-6 w-6 rounded-full object-cover border border-border" alt="" />
                              <span className="truncate">{agent.name}</span>
                            </div>
                          ) : "N/A"}
                        </td>
                      );
                    })}
                    {Array.from({ length: Math.max(0, 4 - selectedProperties.length) }).map((_, idx) => (
                      <td key={`empty-agent-${idx}`} className="py-3 px-5 border-l border-border/40 bg-muted/5" />
                    ))}
                  </tr>
                )}

                {/* Header Feature Section */}
                <tr className="bg-muted/10">
                  <td colSpan={5} className="py-2.5 px-5 text-muted-foreground font-extrabold uppercase text-[11px] tracking-wider">
                    Accessibility & Facilities
                  </td>
                </tr>

                {/* Dynamic Features Row Mapping */}
                {allFacilities.map(facility => (
                  <tr key={facility}>
                    <td className="py-3 px-5 text-muted-foreground bg-muted/5">{facility}</td>
                    {selectedProperties.map(p => {
                      const hasFacility = p.facilities.some(f => f.toLowerCase() === facility.toLowerCase());
                      return (
                        <td key={p.id} className="py-3 px-5 border-l border-border/40">
                          {hasFacility ? (
                            <Check className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <X className="h-5 w-5 text-red-400" />
                          )}
                        </td>
                      );
                    })}
                    {Array.from({ length: Math.max(0, 4 - selectedProperties.length) }).map((_, idx) => (
                      <td key={`empty-fac-${facility}-${idx}`} className="py-3 px-5 border-l border-border/40 bg-muted/5" />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
