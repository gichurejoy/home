"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface MiniSparkChartProps {
  data: number[];
  color: string;
  height?: number;
  tooltipLabel?: string;
}

export function MiniSparkChart({ data, color, height = 72, tooltipLabel = "Value" }: MiniSparkChartProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  if (!mounted) {
    return <div style={{ height }} className="animate-pulse rounded bg-muted/20 w-full" />;
  }

  const isDark = theme === "dark";
  const mutedColor = isDark ? "#2b3547" : "#e4e6ef";
  const labelColor = isDark ? "#94a3b8" : "#8a94a6";

  // Highlight the max bar with the active color, rest get muted
  const maxIdx = data.indexOf(Math.max(...data));
  const colors = data.map((_, i) => (i === maxIdx ? color : mutedColor));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hoverFilter: any = {
    type: "darken",
    value: 0.85,
  };

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      height,
      toolbar: { show: false },
      background: "transparent",
      parentHeightOffset: 0,
      animations: { enabled: true, speed: 400 },
      sparkline: { enabled: false },
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
        borderRadius: 3,
        distributed: true,
        dataLabels: { position: "top" },
      },
    },
    states: {
      hover: {
        filter: hoverFilter,
      },
    },
    grid: {
      show: false,
      padding: { top: -12, bottom: -4, left: -2, right: -2 },
    },
    colors,
    dataLabels: { enabled: false },
    legend: { show: false },
    xaxis: {
      categories: ["S", "M", "T", "W", "T", "F", "S"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        show: true,
        style: {
          colors: Array(7).fill(labelColor),
          fontSize: "11px",
          fontWeight: 600,
          fontFamily: "Nunito, sans-serif",
        },
      },
    },
    yaxis: { labels: { show: false }, axisBorder: { show: false } },
    tooltip: {
      enabled: true,
      followCursor: false,
      intersect: true,
      theme: isDark ? "dark" : "light",
      style: {
        fontSize: "11px",
        fontFamily: "Nunito, sans-serif",
      },
      y: {
        formatter: (val: number) => `${val}`,
        title: {
          formatter: () => `${tooltipLabel}:`,
        },
      },
      marker: {
        show: true,
      },
      fixed: {
        enabled: true,
        position: "topRight",
        offsetX: 0,
        offsetY: -10,
      },
    },
  };

  return (
    <div style={{ height: height + 20 }} className="w-full mini-spark-chart">
      <Chart
        options={options}
        series={[{ name: tooltipLabel, data }]}
        type="bar"
        height={height + 20}
        width="100%"
      />
    </div>
  );
}
