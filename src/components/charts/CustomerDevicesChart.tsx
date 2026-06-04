"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function CustomerDevicesChart() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[150px] w-full animate-pulse bg-muted/20 rounded-md" />;
  }

  const isDark = theme === "dark";

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      height: 150,
      sparkline: { enabled: true },
      toolbar: { show: false },
      fontFamily: "Nunito, inherit",
      background: "transparent",
      animations: { enabled: true, speed: 600 },
    },
    stroke: {
      width: 2,
      curve: "smooth",
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: isDark ? "dark" : "light",
        type: "vertical",
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    markers: {
      size: 0,
    },
    colors: ["#604ae3"],
    tooltip: {
      fixed: { enabled: false },
      x: { show: false },
      y: {
        title: {
          formatter: () => "",
        },
      },
      marker: { show: false },
      theme: isDark ? "dark" : "light",
    },
  };

  const series = [
    {
      name: "Devices Activity",
      data: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54],
    },
  ];

  return (
    <Chart options={options} series={series} type="area" height={150} width="100%" />
  );
}
