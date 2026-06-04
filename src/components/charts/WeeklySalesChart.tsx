"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function WeeklySalesChart() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[140px] animate-pulse bg-muted/20 rounded w-full" />;
  }

  const isDark = theme === "dark";
  const labelColor = isDark ? "#94a3b8" : "#98a6ad";
  const gridColor = isDark ? "#2b3547" : "#eef2f7";

  const data = [35, 55, 40, 65, 45, 70, 40];
  const colors = data.map((val) => {
    const maxVal = Math.max(...data);
    return val === maxVal ? "#604ae3" : "#c9c3f3";
  });

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      height: 140,
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
      },
    },
    grid: {
      borderColor: gridColor,
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { top: -15, bottom: 0, left: 2, right: 2 },
    },
    colors,
    dataLabels: { enabled: false },
    legend: { show: false },
    xaxis: {
      categories: ["S", "M", "T", "W", "T", "F", "S"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: labelColor, fontSize: "11px", fontFamily: "Nunito, inherit" } },
    },
    yaxis: {
      min: 0,
      max: 70,
      tickAmount: 2,
      labels: {
        style: { colors: labelColor, fontSize: "10px" },
        formatter: (val: number) => `${val}`,
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
    },
  };

  return (
    <Chart
      options={options}
      series={[{ name: "Sales", data }]}
      type="bar"
      height={140}
      width="100%"
    />
  );
}
