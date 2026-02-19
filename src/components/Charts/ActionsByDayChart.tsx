import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Chart from "react-apexcharts";
import { metricsService } from "@/services";
import { QUERY_KEYS } from "@/constants";
import { colors } from "@/styles";
import { remToPx } from "@/utils";
import { SkeletonChart } from "@/components/UI/Skeleton";
import type { ApexOptions } from "apexcharts";
import chartStyles from "./Chart.module.scss";

interface ActionsByDayChartProps {
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

const ActionsByDayChart = ({ days = 7 }: ActionsByDayChartProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.metrics.heatmap, days],
    queryFn: () => metricsService.getHeatmap({ days }),
  });

  const actionsByDay = useMemo(() => {
    if (!data || data.length === 0) {
      return Array(7).fill(0);
    }

    const aggregated = data.reduce(
      (acc, item) => {
        const dayIndex = item.dayOfWeek;
        acc[dayIndex] = (acc[dayIndex] || 0) + item.count;
        return acc;
      },
      {} as Record<number, number>
    );

    const orderedDays = [
      aggregated[1] || 0,
      aggregated[2] || 0,
      aggregated[3] || 0,
      aggregated[4] || 0,
      aggregated[5] || 0,
      aggregated[6] || 0,
      aggregated[0] || 0,
    ];

    return orderedDays;
  }, [data]);

  if (isLoading) {
    return <SkeletonChart variant="bar" height={350} />;
  }

  if (error) {
    return (
      <div className={chartStyles.container}>
        <p className="body-sm">
          Não foi possível carregar os dados. Tente novamente em instantes.
        </p>
      </div>
    );
  }

  const colorPalette = [
    colors.indigo[900],
    colors.indigo[600],
    colors.indigo[500],
    colors.indigo[400],
    colors.indigo[300],
    colors.indigo[200],
    colors.indigo[100],
  ];

  const series = [
    {
      name: "Ações",
      data: actionsByDay,
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
      fontFamily: "var(--font-montserrat)",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        dataLabels: {
          position: "center",
        },
        distributed: true,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["var(--color-gray-900)"],
        fontSize: `${remToPx(0.75)}px`,
        fontFamily: "var(--font-montserrat)",
        fontWeight: 600,
      },
      formatter: function (val: number) {
        return `${val}`;
      },
      textAnchor: "middle",
      offsetY: 0,
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
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
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
      title: {
        text: "Número de Ações",
        style: {
          color: "var(--color-gray-700)",
          fontSize: `${remToPx(0.75)}px`,
          fontFamily: "var(--font-montserrat)",
        },
      },
    },
    grid: {
      borderColor: "var(--color-gray-100)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    colors: colorPalette,
    tooltip: {
      theme: "light",
      y: {
        formatter: function (val: number) {
          return `${val} ${val === 1 ? "ação" : "ações"}`;
        },
      },
    },
  };

  return (
    <div className={chartStyles.container}>
      <div className={chartStyles.header}>
        <h3 className="body-lg-semibold">Ações por Dia da Semana</h3>
        <p className="body-sm">Qual dia da semana teve mais atividade</p>
      </div>
      <div className={chartStyles.chartWrapper}>
        <Chart
          options={options}
          series={series}
          type="bar"
          height={350}
          width="100%"
        />
      </div>
    </div>
  );
};

export default ActionsByDayChart;

