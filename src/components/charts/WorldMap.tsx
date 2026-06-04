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

export function WorldMap() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={mapColor}
                  stroke={mapBorder}
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#d0d4e0", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
          
          {mapDots.map((dot) => (
            <Marker key={dot.name} coordinates={dot.coordinates}>
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
                }}
              >
                {dot.name}
              </text>
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </div>
  );
}
