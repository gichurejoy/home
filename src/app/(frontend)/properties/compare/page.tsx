"use client";

import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/store/useToastStore";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Trash2, Home, ArrowLeft, Check, X, Plus } from "lucide-react";
import Link from "next/link";

export default function ComparePropertiesPage() {
  const { 
    comparedPropertyIds, 
    toggleComparedPropertyId, 
    clearComparedProperties,
    properties,
    agents
  } = useAppStore();

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
      )}
    </div>
  );
}
