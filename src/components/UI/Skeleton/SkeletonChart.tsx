import Skeleton from "./index";
import chartStyles from "@/components/Charts/Chart.module.scss";
import styles from "./SkeletonPages.module.scss";

interface SkeletonChartProps {
  /** Altura do gráfico em pixels */
  height?: number;
  /** Tipo de visualização do skeleton */
  variant?: "bar" | "donut" | "heatmap" | "ranking";
}

const SkeletonChart = ({ height = 350, variant = "bar" }: SkeletonChartProps) => {
  return (
    <div className={chartStyles.container}>
      <div className={chartStyles.header}>
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="text" width="40%" height={14} />
      </div>
      <div className={styles.chartSkeleton} style={{ height }}>
        {variant === "bar" && <SkeletonBarChart />}
        {variant === "ranking" && <SkeletonRankingChart />}
        {variant === "donut" && <SkeletonDonutChart />}
        {variant === "heatmap" && <SkeletonHeatmapChart />}
      </div>
    </div>
  );
};

const SkeletonBarChart = () => (
  <div className={styles.barChart}>
    {[65, 85, 45, 70, 55, 90, 40].map((h, i) => (
      <div key={i} className={styles.barColumn}>
        <Skeleton variant="rounded" width="100%" height={`${h}%`} />
        <Skeleton variant="text" width="100%" height={12} />
      </div>
    ))}
  </div>
);

const SkeletonRankingChart = () => (
  <div className={styles.rankingChart}>
    {[90, 75, 60, 45, 30].map((w, i) => (
      <div key={i} className={styles.rankingRow}>
        <Skeleton variant="text" width={80} height={14} />
        <Skeleton variant="rounded" width={`${w}%`} height={24} />
      </div>
    ))}
  </div>
);

const SkeletonDonutChart = () => (
  <div className={styles.donutChart}>
    <Skeleton variant="circular" width={200} height={200} />
    <div className={styles.donutLegend}>
      <div className={styles.legendItem}>
        <Skeleton variant="circular" width={12} height={12} />
        <Skeleton variant="text" width={80} height={14} />
      </div>
      <div className={styles.legendItem}>
        <Skeleton variant="circular" width={12} height={12} />
        <Skeleton variant="text" width={80} height={14} />
      </div>
    </div>
  </div>
);

const SkeletonHeatmapChart = () => (
  <div className={styles.heatmapChart}>
    {Array.from({ length: 8 }).map((_, rowIndex) => (
      <div key={rowIndex} className={styles.heatmapRow}>
        <Skeleton variant="text" width={60} height={12} />
        {Array.from({ length: 7 }).map((_, colIndex) => (
          <Skeleton key={colIndex} variant="rounded" width="100%" height={32} />
        ))}
      </div>
    ))}
  </div>
);

export default SkeletonChart;
