"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function RecentAgentStatusChart() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[330px] w-full animate-pulse bg-muted/20 rounded-md" />;
  }

  const isDark = theme === "dark";
  const gridColor = isDark ? "#2b3547" : "#eef2f7";
  const labelColor = isDark ? "#94a3b8" : "#98a6ad";

  const options: ApexCharts.ApexOptions = {
    chart: {
      height: 330,
      type: "line",
      toolbar: { show: false },
      fontFamily: "Nunito, inherit",
      background: "transparent",
      animations: { enabled: true, speed: 600 },
    },
    stroke: {
      curve: "straight",
      dashArray: [0, 8],
      width: [0, 2],
    },
    fill: {
      opacity: [1, 1], // changed from 4,1 in JS reference for valid standard css fill rules
    },
    markers: {
      size: [0, 0],
      strokeWidth: 2,
      hover: { size: 4 },
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      axisTicks: { show: false },
      axisBorder: { show: false },
      labels: {
        style: {
          colors: labelColor,
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: labelColor,
          fontSize: "12px",
        },
        formatter: (val: number) => val.toFixed(0),
      },
    },
    grid: {
      show: true,
      borderColor: gridColor,
      xaxis: {
        lines: { show: true },
      },
      yaxis: {
        lines: { show: false },
      },
      padding: {
        top: 0,
        right: -2,
        bottom: 15,
        left: 10,
      },
    },
    legend: {
      show: false,
    },
    plotOptions: {
      bar: {
        columnWidth: "30%",
        borderRadius: 8,
      },
    },
    colors: ["#604ae3", "#f8ac59"],
    tooltip: {
      shared: true,
      theme: isDark ? "dark" : "light",
      y: [
        {
          formatter: (val: number) => (val !== undefined ? val.toFixed(0) + " Sales" : ""),
        },
        {
          formatter: (val: number) => (val !== undefined ? val.toFixed(0) + "% Ratio" : ""),
        },
      ],
    },
  };

  const series = [
    {
      name: "Property Sales",
      type: "bar",
      data: [89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57, 42.36, 88.51, 36.57],
    },
    {
      name: "Profit Ratio",
      type: "line",
      data: [35, 35, 25, 25, 45, 45, 75, 75, 45, 45, 54, 54],
    },
  ];

  return (
    <Chart options={options} series={series} type="line" height={330} width="100%" />
  );
}
