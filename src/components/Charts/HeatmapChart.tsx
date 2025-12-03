import { useQuery } from "@tanstack/react-query";
import Chart from "react-apexcharts";
import { metricsService } from "@/services";
import { colors } from "@/styles";
import { remToPx } from "@/utils";
import type { ApexOptions } from "apexcharts";
import chartStyles from "./Chart.module.scss";
import { useMemo } from "react";

interface HeatmapChartProps {
  days?: number;
}

const DAYS_OF_WEEK = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

const TIME_RANGES = [
  "00h-03h",
  "03h-06h",
  "06h-09h",
  "09h-12h",
  "12h-15h",
  "15h-18h",
  "18h-21h",
  "21h-00h",
];

const HeatmapChart = ({ days = 7 }: HeatmapChartProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["heatmap", days],
    queryFn: () => metricsService.getHeatmap({ days }),
  });

  const heatmapData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    const matrix: number[][] = Array(8)
      .fill(null)
      .map(() => Array(7).fill(0));

    data.forEach((item) => {
      const hourIndex = item.hour;
      let rowIndex = -1;

      if (hourIndex >= 0 && hourIndex < 3) rowIndex = 0;
      else if (hourIndex >= 3 && hourIndex < 6) rowIndex = 1;
      else if (hourIndex >= 6 && hourIndex < 9) rowIndex = 2;
      else if (hourIndex >= 9 && hourIndex < 12) rowIndex = 3;
      else if (hourIndex >= 12 && hourIndex < 15) rowIndex = 4;
      else if (hourIndex >= 15 && hourIndex < 18) rowIndex = 5;
      else if (hourIndex >= 18 && hourIndex < 21) rowIndex = 6;
      else if (hourIndex >= 21 && hourIndex < 24) rowIndex = 7;

      const dayIndex = item.dayOfWeek === 0 ? 6 : item.dayOfWeek - 1;

      if (rowIndex >= 0 && dayIndex >= 0) {
        matrix[rowIndex][dayIndex] += item.count;
      }
    });

    return matrix;
  }, [data]);

  if (isLoading) {
    return (
      <div className={chartStyles.container}>
        <p className="body-sm">Carregando mapa de calor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={chartStyles.container}>
        <p className="body-sm">
          Não foi possível carregar o mapa de calor. Tente novamente em
          instantes.
        </p>
      </div>
    );
  }

  const maxValue = Math.max(
    ...heatmapData.flat(),
    1
  );

  const series = TIME_RANGES.map((timeRange, rowIndex) => ({
    name: timeRange,
    data: DAYS_OF_WEEK.map((_, dayIndex) => heatmapData[rowIndex]?.[dayIndex] || 0),
  }));

  const options: ApexOptions = {
    chart: {
      type: "heatmap",
      toolbar: {
        show: false,
      },
      fontFamily: "var(--font-montserrat)",
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 0,
        useFillColorAsStroke: false,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: maxValue * 0.2,
              color: colors.indigo[100],
            },
            {
              from: maxValue * 0.2,
              to: maxValue * 0.4,
              color: colors.indigo[200],
            },
            {
              from: maxValue * 0.4,
              to: maxValue * 0.6,
              color: colors.indigo[300],
            },
            {
              from: maxValue * 0.6,
              to: maxValue * 0.8,
              color: colors.indigo[400],
            },
            {
              from: maxValue * 0.8,
              to: maxValue,
              color: colors.indigo[600],
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["var(--color-gray-900)"],
        fontSize: `${remToPx(0.75)}px`,
        fontFamily: "var(--font-montserrat)",
        fontWeight: 600,
      },
    },
    xaxis: {
      categories: DAYS_OF_WEEK,
      labels: {
        style: {
          colors: ["var(--color-gray-700)"],
          fontSize: `${remToPx(0.75)}px`,
          fontFamily: "var(--font-montserrat)",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: ["var(--color-gray-700)"],
          fontSize: `${remToPx(0.75)}px`,
          fontFamily: "var(--font-montserrat)",
        },
      },
    },
    tooltip: {
      theme: "light",
    },
    legend: {
      show: false,
    },
  };

  return (
    <div className={chartStyles.container}>
      <div className={chartStyles.header}>
        <h3 className="body-lg-semibold">Mapa de Calor - Horários Mais Ativos</h3>
        <p className="body-sm">
          Distribuição de ações por hora e dia da semana
        </p>
      </div>
      <div className={chartStyles.chartWrapper}>
        <Chart
          options={options}
          series={series}
          type="heatmap"
          height={400}
          width="100%"
        />
      </div>
    </div>
  );
};

export default HeatmapChart;

