"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const mapDots = [
  { name: "Canada", coordinates: [-106.3468, 56.1304] as [number, number] },
  { name: "USA", coordinates: [-95.7129, 37.0902] as [number, number] },
  { name: "Brazil", coordinates: [-51.9253, -14.2350] as [number, number] },
  { name: "Russia", coordinates: [105.3188, 61.5240] as [number, number] },
  { name: "China", coordinates: [104.1954, 35.8617] as [number, number] },
];

interface CountryDetail {
  name: string;
  sales: string;
  leads: number;
  propertiesSold: number;
  conversion: string;
  popularProperty: string;
}

const countryDetails: Record<string, CountryDetail> = {
  Canada: {
    name: "Canada",
    sales: "$18.4M",
    leads: 142,
    propertiesSold: 32,
    conversion: "94.2%",
    popularProperty: "Townhouses & Condos"
  },
  USA: {
    name: "United States",
    sales: "$24.9M",
    leads: 215,
    propertiesSold: 45,
    conversion: "96.5%",
    popularProperty: "Single-Family Residences"
  },
  Brazil: {
    name: "Brazil",
    sales: "$9.2M",
    leads: 88,
    propertiesSold: 18,
    conversion: "89.1%",
    popularProperty: "Modern Beachfront Villas"
  },
  Russia: {
    name: "Russia",
    sales: "$11.8M",
    leads: 94,
    propertiesSold: 22,
    conversion: "91.4%",
    popularProperty: "Luxury Penthouses"
  },
  China: {
    name: "China",
    sales: "$14.2M",
    leads: 110,
    propertiesSold: 27,
    conversion: "93.0%",
    popularProperty: "High-Rise Apartments"
  }
};

const getCountryData = (name: string): CountryDetail => {
  const key = Object.keys(countryDetails).find(k => 
    k.toLowerCase() === name.toLowerCase() || 
    name.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(name.toLowerCase())
  );
  if (key) return countryDetails[key];
  return {
    name: name,
    sales: "$3.5M",
    leads: 24,
    propertiesSold: 6,
    conversion: "85.0%",
    popularProperty: "Residential Properties"
  };
};

export function WorldMap() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryDetail | null>(null);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  if (!mounted) {
    return (
      <div className="relative w-full flex items-center justify-center animate-pulse" style={{ paddingBottom: "52%" }}>
         <div className="absolute inset-0 bg-muted/20 rounded-lg"></div>
      </div>
    );
  }

  const isDark = theme === "dark";
  
  // Adjusted styling for the map to match standard admin templates
  const mapColor = isDark ? "#2b3547" : "#e8eaf0";
  const mapBorder = isDark ? "#3d4654" : "#ffffff";
  const hoverColor = isDark ? "#43526c" : "#cbd1e0";

  return (
    <div className="relative w-full" style={{ paddingBottom: "52%" }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 140,
            center: [0, 40]
          }}
          className="w-full h-full"
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.name || geo.properties.NAME || "Unknown";
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={mapColor}
                    stroke={mapBorder}
                    strokeWidth={0.5}
                    onClick={() => setSelectedCountry(getCountryData(countryName))}
                    style={{
                      default: { outline: "none", cursor: "pointer" },
                      hover: { fill: hoverColor, outline: "none", cursor: "pointer" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
          
          {mapDots.map((dot) => (
            <Marker 
              key={dot.name} 
              coordinates={dot.coordinates}
              onClick={() => setSelectedCountry(getCountryData(dot.name))}
              style={{ default: { outline: "none", cursor: "pointer" } }}
            >
              <circle r={4} fill="#604ae3" opacity={0.9} />
              <circle r={8} fill="#604ae3" opacity={0.3} />
              <text
                textAnchor="start"
                y={3}
                x={8}
                style={{
                  fontFamily: "Nunito, sans-serif",
                  fontSize: "10px",
                  fontWeight: 600,
                  fill: isDark ? "#94a3b8" : "#604ae3",
                  pointerEvents: "none",
                }}
              >
                {dot.name}
              </text>
            </Marker>
          ))}
        </ComposableMap>
      </div>

      {/* Country Detail Overlay Card */}
      {selectedCountry && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-72 bg-card/95 backdrop-blur-md border border-border shadow-xl rounded-lg p-3.5 z-20 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between border-b border-border pb-1.5 mb-2">
            <span className="font-bold text-[13px] text-foreground flex items-center gap-1.5">
              <i className="ri-global-line text-primary text-[15px]" />
              {selectedCountry.name} Market
            </span>
            <button
              onClick={() => setSelectedCountry(null)}
              className="text-muted-foreground hover:text-foreground h-5 w-5 rounded-full hover:bg-muted flex items-center justify-center transition-colors text-[14px]"
            >
              <i className="ri-close-line" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
            <div className="bg-muted/15 p-2 rounded border border-border/40">
              <span className="block font-bold text-[9px] uppercase text-muted-foreground/85">Sales Volume</span>
              <span className="text-[12.5px] font-black text-primary mt-0.5 inline-block">{selectedCountry.sales}</span>
            </div>
            <div className="bg-muted/15 p-2 rounded border border-border/40">
              <span className="block font-bold text-[9px] uppercase text-muted-foreground/85">Properties Sold</span>
              <span className="text-[12.5px] font-black text-foreground mt-0.5 inline-block">{selectedCountry.propertiesSold}</span>
            </div>
            <div className="bg-muted/15 p-2 rounded border border-border/40">
              <span className="block font-bold text-[9px] uppercase text-muted-foreground/85">Active Leads</span>
              <span className="text-[12.5px] font-bold text-foreground mt-0.5 inline-block">{selectedCountry.leads}</span>
            </div>
            <div className="bg-muted/15 p-2 rounded border border-border/40">
              <span className="block font-bold text-[9px] uppercase text-muted-foreground/85">Conv. Rate</span>
              <span className="text-[12.5px] font-bold text-success mt-0.5 inline-block">{selectedCountry.conversion}</span>
            </div>
          </div>

          <div className="mt-2.5 bg-muted/10 p-2 rounded border border-border/40 text-[10px] text-muted-foreground">
            <span className="font-bold">Popular: </span>
            <span className="text-foreground font-semibold">{selectedCountry.popularProperty}</span>
          </div>
        </div>
      )}
    </div>
  );
}
