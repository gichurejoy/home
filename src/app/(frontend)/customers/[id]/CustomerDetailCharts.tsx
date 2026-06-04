"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function WeeklyInquiryChart() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[220px] w-full animate-pulse bg-muted/20 rounded-md" />;
  }

  const isDark = theme === "dark";
  const gridColor = isDark ? "#2b3547" : "#eef2f7";

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      height: 220,
      parentHeightOffset: 0,
      toolbar: { show: false },
      fontFamily: "Nunito, inherit",
      background: "transparent",
      animations: { enabled: true, speed: 600 },
    },
    plotOptions: {
      bar: {
        columnWidth: "35%",
        borderRadius: 4,
      },
    },
    grid: {
      show: true,
      borderColor: gridColor,
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: {
        top: -10,
        bottom: 0,
        left: 10,
        right: 10,
      },
    },
    colors: ["#604ae3"],
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: isDark ? "#94a3b8" : "#98a6ad",
          fontSize: "11px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: isDark ? "#94a3b8" : "#98a6ad",
          fontSize: "11px",
        },
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val: number) => `${val} Inquiries`,
      },
    },
  };

  const series = [
    {
      name: "Inquiry",
      data: [35, 45, 60, 48, 52, 70, 58, 65, 40, 30, 25, 37],
    },
  ];

  return (
    <Chart options={options} series={series} type="bar" height={220} width="100%" />
  );
}

export function OwnPropertyChart() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[200px] w-full animate-pulse bg-muted/20 rounded-md" />;
  }

  const isDark = theme === "dark";

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
      height: 200,
      background: "transparent",
      fontFamily: "Nunito, inherit",
    },
    labels: ["Residential", "Commercial", "Industrial"],
    colors: ["#604ae3", "#39afd1", "#ff5b5b"],
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "12px",
      labels: {
        colors: isDark ? "#f3f4f6" : "#313a46",
      },
      markers: {
        strokeWidth: 0,
      },
    },
    stroke: {
      width: 2,
      colors: isDark ? ["#1b2332"] : ["#ffffff"],
    },
    plotOptions: {
      pie: {
        donut: {
          size: "68%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              fontWeight: 600,
              color: isDark ? "#94a3b8" : "#98a6ad",
            },
            value: {
              show: true,
              fontSize: "20px",
              fontWeight: 700,
              color: isDark ? "#f3f4f6" : "#313a46",
              formatter: (val: string) => `${val}%`,
            },
            total: {
              show: true,
              label: "Portfolio",
              color: isDark ? "#94a3b8" : "#98a6ad",
              formatter: () => "100%",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val: number) => `${val}%`,
      },
    },
  };

  const series = [55, 30, 15]; // Residential, Commercial, Industrial

  return (
    <Chart options={options} series={series} type="donut" height={200} width="100%" />
  );
}
