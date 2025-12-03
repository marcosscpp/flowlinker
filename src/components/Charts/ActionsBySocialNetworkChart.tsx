import { useQuery } from "@tanstack/react-query";
import Chart from "react-apexcharts";
import { metricsService } from "@/services";
import { remToPx } from "@/utils";
import type { ApexOptions } from "apexcharts";
import chartStyles from "./Chart.module.scss";
import { useMemo } from "react";

interface ActionsBySocialNetworkChartProps {
  hours?: number;
}

const ActionsBySocialNetworkChart = ({
  hours = 24,
}: ActionsBySocialNetworkChartProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["distribution-social", hours],
    queryFn: () => metricsService.getDistributionSocial({ hours }),
  });

  const chartData = useMemo(() => {
    if (!data || Object.keys(data).length === 0) {
      return [
        { name: "Facebook", value: 0 },
        { name: "Instagram", value: 0 },
      ];
    }

    const facebookCount = data.FACEBOOK || data.facebook || 0;
    const instagramCount = data.INSTAGRAM || data.instagram || 0;

    return [
      { name: "Facebook", value: facebookCount },
      { name: "Instagram", value: instagramCount },
    ];
  }, [data]);

  if (isLoading) {
    return (
      <div className={chartStyles.container}>
        <p className="body-sm">Carregando gráfico...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={chartStyles.container}>
        <p className="body-sm">
          Não foi possível carregar o gráfico. Tente novamente em instantes.
        </p>
      </div>
    );
  }

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const series = chartData.map((item) => item.value);

  const options: ApexOptions = {
    chart: {
      type: "donut",
      toolbar: {
        show: false,
      },
      fontFamily: "var(--font-montserrat)",
    },
    labels: chartData.map((item) => item.name),
    colors: ["var(--color-blue-700)", "var(--color-pink-600)"],
    dataLabels: {
      enabled: true,
      formatter: (_val: number, opts: any) => {
        const value = chartData[opts.seriesIndex]?.value || 0;
        return `${value} ações`;
      },
      style: {
        colors: ["var(--color-gray-900)"],
        fontSize: `${remToPx(0.75)}px`,
        fontFamily: "var(--font-montserrat)",
        fontWeight: 600,
      },
      dropShadow: {
        enabled: false,
      },
    },
    legend: {
      position: "bottom",
      fontSize: `${remToPx(0.875)}px`,
      fontFamily: "var(--font-montserrat)",
      fontWeight: 500,
      labels: {
        colors: ["var(--color-gray-700)"],
      },
      markers: {
        size: 6,
      },
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (value: number) => {
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
          return `${value} ações (${percentage}%)`;
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: `${remToPx(0.875)}px`,
              fontFamily: "var(--font-montserrat)",
              fontWeight: 500,
              color: "var(--color-gray-700)",
            },
            value: {
              show: true,
              fontSize: `${remToPx(1.5)}px`,
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              color: "var(--color-gray-900)",
              formatter: () => {
                return total.toString();
              },
            },
            total: {
              show: true,
              label: "Total de ações",
              fontSize: `${remToPx(0.75)}px`,
              fontFamily: "var(--font-montserrat)",
              fontWeight: 500,
              color: "var(--color-gray-600)",
              formatter: () => {
                return total.toString();
              },
            },
          },
        },
        expandOnClick: false,
      },
    },
  };

  return (
    <div className={chartStyles.container}>
      <div className={chartStyles.header}>
        <h3 className="body-lg-semibold">Ações por Rede Social</h3>
        <p className="body-sm">Distribuição entre Facebook e Instagram</p>
      </div>
      <div className={chartStyles.chartWrapper}>
        <Chart
          options={options}
          series={series}
          type="donut"
          height={350}
          width="100%"
        />
      </div>
    </div>
  );
};

export default ActionsBySocialNetworkChart;

