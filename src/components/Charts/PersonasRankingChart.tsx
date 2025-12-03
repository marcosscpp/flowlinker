import { useQuery } from "@tanstack/react-query";
import Chart from "react-apexcharts";
import { metricsService } from "@/services";
import { colors } from "@/styles";
import { remToPx } from "@/utils";
import type { ApexOptions } from "apexcharts";
import chartStyles from "./Chart.module.scss";

interface PersonasRankingChartProps {
  hours?: number;
  limit?: number;
}

const PersonasRankingChart = ({
  hours = 24,
  limit = 10,
}: PersonasRankingChartProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["personasRanking", hours, limit],
    queryFn: () => metricsService.getPersonasRanking({ hours, limit }),
  });

  if (isLoading) {
    return (
      <div className={chartStyles.container}>
        <p className="body-sm">Carregando ranking...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={chartStyles.container}>
        <p className="body-sm">
          Não foi possível carregar o ranking. Tente novamente em instantes.
        </p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={chartStyles.container}>
        <p className="body-sm">Nenhum dado disponível para o ranking.</p>
      </div>
    );
  }

  const sortedData = [...data]
    .sort((a, b) => b.actions - a.actions)
    .slice(0, 5);

  const categories = sortedData.map((item) => item.account);
  
  const colorPalette = [
    colors.indigo[900],
    colors.indigo[600],
    colors.indigo[500],
    colors.indigo[400],
    colors.indigo[300],
  ];

  const barColors = sortedData.map((_, index) => {
    return colorPalette[index];
  });

  const series = [
    {
      name: "Ações",
      data: sortedData.map((item) => item.actions),
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
        horizontal: true,
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
      textAnchor: "middle",
      style: {
        colors: ["var(--color-gray-900)"],
        fontSize: `${remToPx(0.75)}px`,
        fontFamily: "var(--font-montserrat)",
        fontWeight: 600,
      },
      formatter: function (val: number) {
        return `${val}`;
      },
      offsetX: 0,
      offsetY: 0,
    },
    xaxis: {
      categories: categories,
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
    },
    grid: {
      borderColor: "var(--color-gray-100)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    colors: barColors,
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
        <h3 className="body-lg-semibold">Ranking de Personas Mais Ativas</h3>
        <p className="body-sm">Total de ações executadas por cada persona</p>
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

export default PersonasRankingChart;

