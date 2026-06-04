"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function SalesAnalyticChart() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[280px] w-full animate-pulse bg-muted/20 rounded-md" />;
  }

  const isDark = theme === "dark";
  const gridColor = isDark ? "#2b3547" : "#eef2f7";
  const labelColor = isDark ? "#94a3b8" : "#98a6ad";

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      height: 280,
      toolbar: { show: false },
      fontFamily: "Nunito, inherit",
      background: "transparent",
      animations: { enabled: true, speed: 800 },
    },
    colors: ["#604ae3", "#f1b53d"],
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: [2, 2],
      dashArray: [0, 5],
    },
    fill: {
      type: ["gradient", "gradient"],
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.02,
        stops: [0, 100],
      },
    },
    markers: { size: 0 },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: labelColor, fontSize: "12px" } },
    },
    yaxis: {
      labels: {
        style: { colors: labelColor, fontSize: "12px" },
        formatter: (val: number) => `$${val}k`,
      },
    },
    grid: {
      borderColor: gridColor,
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      fontSize: "12px",
      labels: { colors: labelColor },
      markers: { size: 6 },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: { formatter: (val: number) => `$${val}k` },
    },
    theme: {
      mode: isDark ? "dark" : "light",
    },
  };

  const series = [
    {
      name: "Revenue",
      data: [31, 40, 28, 51, 42, 85, 70, 91, 110, 98, 120, 130],
    },
    {
      name: "Expenses",
      data: [11, 32, 45, 32, 34, 52, 41, 70, 65, 76, 89, 68],
    },
  ];

  return (
    <Chart options={options} series={series} type="area" height={280} width="100%" />
  );
}

// Keep old name as alias for backward compatibility
export { SalesAnalyticChart as RevenueChart };
