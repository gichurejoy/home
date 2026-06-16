"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function CustomerRecentInvestChart() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  if (!mounted) {
    return <div className="h-[300px] w-full animate-pulse bg-muted/20 rounded-md" />;
  }

  const isDark = theme === "dark";
  const gridColor = isDark ? "#2b3547" : "#f1f3fa";
  const labelColor = isDark ? "#94a3b8" : "#304758";

  const options: ApexCharts.ApexOptions = {
    chart: {
      height: 300,
      type: "bar",
      toolbar: { show: false },
      fontFamily: "Nunito, inherit",
      background: "transparent",
      animations: { enabled: true, speed: 600 },
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: "30%",
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val + "%",
      offsetY: -25,
      style: {
        fontSize: "12px",
        colors: [labelColor],
      },
    },
    colors: ["#604ae3"],
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      offsetX: 0,
      offsetY: -5,
      labels: {
        colors: isDark ? "#94a3b8" : "#98a6ad",
      },
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July"],
      position: "bottom",
      axisBorder: { show: true, color: isDark ? "#2b3547" : "#eef2f7" },
      axisTicks: { show: true, color: isDark ? "#2b3547" : "#eef2f7" },
      labels: {
        style: {
          colors: isDark ? "#94a3b8" : "#6c757d",
        },
      },
      tooltip: {
        enabled: true,
        offsetY: -10,
      },
    },
    yaxis: {
      axisBorder: { show: true, color: isDark ? "#2b3547" : "#eef2f7" },
      axisTicks: { show: true, color: isDark ? "#2b3547" : "#eef2f7" },
      labels: {
        show: true,
        formatter: (val: number) => val + "%",
        style: {
          colors: isDark ? "#94a3b8" : "#6c757d",
        },
      },
    },
    grid: {
      borderColor: gridColor,
      row: {
        colors: ["transparent", "transparent"],
        opacity: 0.2,
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val: number) => val + "%",
      },
    },
  };

  const series = [
    {
      name: "Invest Percentage",
      data: [12.3, 3.1, 4, 10.1, 6, 2.3, 19.4],
    },
  ];

  return (
    <Chart options={options} series={series} type="bar" height={300} width="100%" />
  );
}
