"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function AgentGoalsChart() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[300px] w-full animate-pulse bg-muted/20 rounded-md" />;
  }

  const isDark = theme === "dark";
  const nameColor = isDark ? "#94a3b8" : "#6c757d";
  const valueColor = isDark ? "#f3f4f6" : "#313a46";

  const options: ApexCharts.ApexOptions = {
    chart: {
      height: 300,
      type: "radialBar",
      fontFamily: "Nunito, inherit",
      background: "transparent",
      animations: { enabled: true, speed: 600 },
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          name: {
            fontSize: "16px",
            color: nameColor,
            offsetY: 100,
          },
          value: {
            offsetY: 55,
            fontSize: "22px",
            color: valueColor,
            formatter: (val: number) => val + "%",
          },
        },
        track: {
          background: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(170, 184, 197, 0.4)",
          margin: 0,
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        shadeIntensity: 0.2,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 65, 91],
      },
    },
    stroke: {
      dashArray: 4,
    },
    colors: ["#604ae3"],
    labels: ["Achieved"],
    responsive: [
      {
        breakpoint: 380,
        options: {
          chart: {
            height: 280,
          },
        },
      },
    ],
  };

  const series = [75];

  return (
    <Chart options={options} series={series} type="radialBar" height={300} width="100%" />
  );
}
