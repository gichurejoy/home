"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface RadialChartProps {
  value: number;
  color?: string;
  height?: number;
}

export function RadialChart({ value = 70, color = "#604ae3", height = 220 }: RadialChartProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ height }} className="animate-pulse bg-muted/20 rounded-full mx-auto w-[180px]" />;
  }

  const isDark = theme === "dark";
  const trackColor = isDark ? "#2b3547" : "#eef2f7";

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "radialBar",
      height,
      background: "transparent",
      toolbar: { show: false },
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          size: "65%",
          background: "transparent",
        },
        track: {
          background: trackColor,
          strokeWidth: "100%",
          margin: 0,
        },
        dataLabels: {
          name: {
            show: true,
            offsetY: -5,
            fontSize: "13px",
            color: isDark ? "#94a3b8" : "#98a6ad",
            fontFamily: "Nunito, inherit",
          },
          value: {
            show: true,
            offsetY: 5,
            fontSize: "28px",
            fontWeight: "700",
            color: isDark ? "#f3f4f6" : "#313a46",
            fontFamily: "Nunito, inherit",
            formatter: (val: number) => `${val}`,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: ["#39afd1"],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: { lineCap: "round" },
    labels: ["Total Buyer"],
    theme: { mode: isDark ? "dark" : "light" },
  };

  return (
    <Chart
      options={options}
      series={[value]}
      type="radialBar"
      height={height}
      width="100%"
    />
  );
}
