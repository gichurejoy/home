"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function CustomerInvestChart() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[182px] w-full animate-pulse bg-muted/20 rounded-md" />;
  }

  const isDark = theme === "dark";
  const gridColor = isDark ? "#2b3547" : "#eef2f7";

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      height: 182,
      parentHeightOffset: 0,
      toolbar: { show: false },
      fontFamily: "Nunito, inherit",
      background: "transparent",
      animations: { enabled: true, speed: 600 },
    },
    plotOptions: {
      bar: {
        barHeight: "100%",
        columnWidth: "30%",
        borderRadius: 4,
        distributed: true,
      },
    },
    grid: {
      show: true,
      borderColor: gridColor,
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: false } },
      padding: {
        top: -20,
        bottom: -10,
        left: 0,
        right: 0,
      },
    },
    colors: isDark
      ? ["#252d3c", "#604ae3", "#604ae3", "#252d3c"]
      : ["#efecfc", "#604ae3", "#604ae3", "#efecfc"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val: number) => (val !== undefined ? `$${val.toFixed(2)}k` : ""),
      },
    },
    responsive: [
      {
        breakpoint: 1025,
        options: {
          chart: {
            height: 199,
          },
        },
      },
    ],
  };

  const series = [
    {
      name: "Invest",
      data: [40, 50, 65, 45, 40, 70, 40, 50, 45, 20, 10, 29],
    },
  ];

  return (
    <Chart options={options} series={series} type="bar" height={182} width="100%" />
  );
}
