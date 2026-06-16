"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface DetailChartsClientProps {
  chartType: "listings" | "sold" | "rent";
  color: string;
}

export default function DetailChartsClient({ chartType, color }: DetailChartsClientProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  if (!mounted) {
    return <div className="h-[45px] w-[100px] bg-muted/20 rounded animate-pulse" />;
  }

  // Different mock sparkline data for each property stat
  const datasets = {
    listings: [15, 24, 18, 30, 22, 28, 26],
    sold: [8, 14, 11, 19, 15, 22, 17],
    rent: [7, 10, 7, 11, 7, 6, 9],
  };

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      height: 45,
      sparkline: { enabled: true },
      background: "transparent",
      parentHeightOffset: 0,
      animations: { enabled: true, speed: 300 }
    },
    stroke: { curve: "smooth", width: 1.8 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.01
      }
    },
    colors: [color],
    tooltip: { enabled: false },
    grid: { padding: { top: 2, bottom: 2 } }
  };

  const series = [{ name: chartType, data: datasets[chartType] }];

  return (
    <Chart options={options} series={series} type="area" height={45} width="100%" />
  );
}
