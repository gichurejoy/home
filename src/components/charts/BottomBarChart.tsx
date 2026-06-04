"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface BottomBarChartProps {
  id: string;
  data: number[];
  color: string;
  height?: number;
  categories?: string[];
}

export function BottomBarChart({
  id,
  data,
  color,
  height = 160,
  categories = ["S", "M", "T", "W", "T", "F", "S"],
}: BottomBarChartProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{ height }}
        className="w-full animate-pulse bg-muted/20 rounded"
      />
    );
  }

  const isDark = theme === "dark";
  const mutedColor = isDark ? "#2b3547" : "#eef2f7";
  const labelColor = isDark ? "#94a3b8" : "#98a6ad";

  // Highlight the max bar with the active color
  const maxIdx = data.indexOf(Math.max(...data));
  const colors = data.map((_, i) => (i === maxIdx ? color : mutedColor));

  const options: ApexCharts.ApexOptions = {
    chart: {
      id,
      type: "bar",
      height,
      toolbar: { show: false },
      background: "transparent",
      parentHeightOffset: 0,
      animations: { enabled: true, speed: 600 },
    },
    plotOptions: {
      bar: {
        columnWidth: "45%",
        borderRadius: 4,
        distributed: true,
        dataLabels: { position: "top" },
      },
    },
    grid: {
      show: false,
      padding: { top: -20, bottom: -10, left: 0, right: 0 },
    },
    colors,
    dataLabels: { enabled: false },
    legend: { show: false },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: labelColor, fontSize: "11px" } },
    },
    yaxis: { labels: { show: false } },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: { formatter: (val: number) => `${val}` },
    },
  };

  return (
    <Chart
      options={options}
      series={[{ name: "Value", data }]}
      type="bar"
      height={height}
      width="100%"
    />
  );
}
