"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { MapPin, Search, Grid, List, Map as MapIcon, Star, Heart } from "lucide-react";
import Link from "next/link";
import { Property } from "@/data/mockProperties";

export default function PropertyMapPage() {
  const { properties } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(properties[0] || null);

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === "All" || p.type.toLowerCase().includes(filterType.toLowerCase());
      return matchSearch && matchType;
    });
  }, [properties, searchTerm, filterType]);

  // Simulated coordinate positions on map viewport for each property
  const mapCoordinates = useMemo(() => {
    // Distribute properties evenly on a virtual 100% x 100% canvas grid
    const coords: Record<string, { x: number; y: number }> = {
      "PROP-001": { x: 30, y: 40 },
      "PROP-002": { x: 60, y: 25 },
      "PROP-003": { x: 45, y: 70 },
      "PROP-004": { x: 75, y: 55 },
      "PROP-005": { x: 20, y: 65 },
      "PROP-006": { x: 50, y: 15 },
      "PROP-007": { x: 80, y: 80 },
      "PROP-008": { x: 15, y: 20 },
      "PROP-009": { x: 65, y: 60 },
      "PROP-010": { x: 35, y: 85 }
    };
    
    // Default fallback coordinates if ID not preset
    properties.forEach((p, idx) => {
      if (!coords[p.id]) {
        coords[p.id] = {
          x: 10 + (idx * 23) % 80,
          y: 15 + (idx * 17) % 75
        };
      }
    });

    return coords;
  }, [properties]);

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumb />
          <h1 className="text-[20px] font-bold text-foreground">Interactive Listings Map</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Explore properties and neighborhoods visually</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/properties/grid"
            className="p-2 border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors"
            title="Grid View"
          >
            <Grid className="h-4 w-4" />
          </Link>
          <Link
            href="/properties/list"
            className="p-2 border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors"
            title="List View"
          >
            <List className="h-4 w-4" />
          </Link>
          <Link
            href="/properties/map"
            className="p-2 border border-primary bg-primary text-white rounded transition-colors"
            title="Map View"
          >
            <MapIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Main Map View Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[72vh] items-stretch">
        
        {/* ── Left Column: Property List (Col 4) ────────────────────── */}
        <div className="xl:col-span-4 flex flex-col gap-4 bg-card border border-border rounded-xl p-4 shadow-lg overflow-hidden h-full">
          {/* Controls */}
          <div className="space-y-3 shrink-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search location or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-[13px] border border-border bg-card text-foreground rounded-[5px] pl-8 pr-3 py-1.5 outline-none focus:border-primary placeholder:text-muted-foreground/60"
              />
              <Search className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/80" />
            </div>

            {/* Type Filter */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {["All", "Villa", "Apartment", "Residences", "Cottage"].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded border transition-all whitespace-nowrap ${
                    filterType === type 
                      ? 'bg-primary text-white border-primary shadow-sm' 
                      : 'border-border text-muted-foreground hover:bg-muted bg-card'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Properties Scroll View */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {filteredProperties.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-[12.5px]">
                No properties found.
              </div>
            ) : (
              filteredProperties.map(p => {
                const isSelected = selectedProperty?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProperty(p)}
                    className={`border rounded-lg p-3 flex gap-3 cursor-pointer transition-all hover:shadow bg-card ${
                      isSelected 
                        ? 'ring-2 ring-primary border-transparent' 
                        : 'border-border/80 hover:border-border'
                    }`}
                  >
                    <img
                      src={p.image}
                      className="h-16 w-20 object-cover rounded border border-border shrink-0"
                      alt=""
                    />
                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-[13px] font-bold text-foreground truncate">{p.title}</h4>
                        <p className="text-[11px] text-muted-foreground truncate leading-normal mt-0.5">{p.location}</p>
                      </div>
                      <div className="flex items-center justify-between text-[11px] mt-1.5">
                        <span className="font-bold text-primary">
                          ${p.price.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground font-semibold">
                          {p.bedrooms} BHK &bull; {p.area} sqft
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Right Column: Interactive Map Viewport (Col 8) ─────────── */}
        <div className="xl:col-span-8 bg-[#1a1f2c] border border-border rounded-xl shadow-lg relative overflow-hidden h-full flex flex-col justify-center select-none">
          {/* Custom Stylized Premium Map Background Graphic */}
          <div className="absolute inset-0 bg-[#0e121b] opacity-95">
            {/* Grid Map pattern lines */}
            <div className="absolute inset-0" style={{ 
              backgroundImage: 'radial-gradient(rgba(96,74,227,0.15) 1px, transparent 0)', 
              backgroundSize: '24px 24px' 
            }} />
            
            {/* Simulated River Vector Path */}
            <svg className="absolute inset-0 h-full w-full opacity-25" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M -10 150 Q 200 80 400 300 T 900 200" 
                fill="none" 
                stroke="#604ae3" 
                strokeWidth="45" 
                strokeLinecap="round" 
                className="blur-sm"
              />
              <path 
                d="M -10 150 Q 200 80 400 300 T 900 200" 
                fill="none" 
                stroke="#39afd1" 
                strokeWidth="15" 
                strokeLinecap="round" 
              />
              {/* Central Park Area */}
              <rect x="250" y="320" width="180" height="120" rx="20" fill="#0acf97" fillOpacity="0.1" stroke="#0acf97" strokeWidth="2" strokeDasharray="4 4" />
              <text x="340" y="380" fill="#0acf97" fillOpacity="0.6" fontSize="12" fontWeight="bold" textAnchor="middle">CENTRAL PARK DISTRICT</text>
              
              {/* Marina Area */}
              <circle cx="750" cy="180" r="70" fill="#39afd1" fillOpacity="0.08" stroke="#39afd1" strokeWidth="2" strokeDasharray="4 4" />
              <text x="750" y="185" fill="#39afd1" fillOpacity="0.6" fontSize="12" fontWeight="bold" textAnchor="middle">MARINA BAY</text>
            </svg>
          </div>

          {/* Interactive Property Map Pins */}
          {filteredProperties.map(p => {
            const coords = mapCoordinates[p.id] || { x: 50, y: 50 };
            const isSelected = selectedProperty?.id === p.id;
            
            return (
              <button
                key={p.id}
                onClick={() => setSelectedProperty(p)}
                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-1 px-2 py-1 rounded-[5px] shadow-lg border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-primary border-primary text-white scale-110 z-30 ring-4 ring-primary/30 animate-pulse' 
                    : 'bg-[#1b2230]/95 border-[#604ae3]/30 text-white hover:bg-primary/95 hover:border-primary'
                }`}
              >
                <MapPin className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-[#604ae3]'}`} />
                <span className="text-[10px] font-extrabold tracking-wider">
                  ${(p.price / 1000).toFixed(0)}K
                </span>
              </button>
            );
          })}

          {/* Floating Mini Details Card Popup (Bottom Left of Map) */}
          {selectedProperty && (
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-40 bg-[#1b2230] border border-[#604ae3]/30 rounded-xl shadow-2xl p-3 max-w-sm w-auto animate-in slide-in-from-bottom-5 duration-200">
              <div className="flex gap-3.5">
                <img
                  src={selectedProperty.image}
                  className="h-20 w-24 object-cover rounded border border-border shrink-0"
                  alt=""
                />
                <div className="min-w-0 flex-1 flex flex-col justify-between text-white">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9.5px] font-extrabold uppercase bg-[#0acf97]/15 text-[#0acf97] border border-[#0acf97]/25 px-1.5 py-0.2 rounded">
                        {selectedProperty.type}
                      </span>
                      <span className="text-[12.5px] font-extrabold text-[#0acf97]">
                        ${selectedProperty.price.toLocaleString()}
                      </span>
                    </div>
                    
                    <h4 className="text-[13.5px] font-bold mt-1.5 truncate leading-snug">
                      {selectedProperty.title}
                    </h4>
                    <p className="text-[11px] text-white/60 truncate leading-snug mt-0.5">
                      {selectedProperty.location}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-white/5 text-[10px] text-white/50 font-bold">
                    <span>
                      {selectedProperty.bedrooms} Beds &bull; {selectedProperty.bathrooms} Baths
                    </span>
                    <Link
                      href={`/properties/${selectedProperty.id}`}
                      className="text-primary hover:underline flex items-center gap-0.5 font-extrabold"
                    >
                      View details &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
