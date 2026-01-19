import clsx from "clsx";
import styles from "./Skeleton.module.scss";

interface SkeletonProps {
  /** Largura do skeleton (ex: "100%", "200px", "10rem") */
  width?: string | number;
  /** Altura do skeleton (ex: "20px", "1rem") */
  height?: string | number;
  /** Formato do skeleton */
  variant?: "text" | "circular" | "rectangular" | "rounded";
  /** Classes CSS adicionais */
  className?: string;
  /** Quantidade de linhas (apenas para variant="text") */
  lines?: number;
}

/**
 * Componente Skeleton com animação de shimmer estilo Instagram.
 *
 * @example
 * // Texto simples
 * <Skeleton variant="text" width="80%" />
 *
 * // Avatar circular
 * <Skeleton variant="circular" width={48} height={48} />
 *
 * // Card retangular
 * <Skeleton variant="rounded" width="100%" height={120} />
 *
 * // Múltiplas linhas de texto
 * <Skeleton variant="text" lines={3} />
 */
const Skeleton = ({
  width,
  height,
  variant = "text",
  className,
  lines = 1,
}: SkeletonProps) => {
  const style = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  // Para múltiplas linhas de texto
  if (variant === "text" && lines > 1) {
    return (
      <div className={clsx(styles.textContainer, className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={clsx(styles.skeleton, styles.text)}
            style={{
              ...style,
              width: index === lines - 1 ? "60%" : style.width || "100%",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        styles.skeleton,
        styles[variant],
        className
      )}
      style={style}
    />
  );
};

/**
 * Skeleton pré-configurado para cards de perfil/persona
 */
export const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={clsx(styles.card, className)}>
    <div className={styles.cardHeader}>
      <Skeleton variant="circular" width={48} height={48} />
      <div className={styles.cardHeaderText}>
        <Skeleton variant="text" width="70%" height={16} />
        <Skeleton variant="text" width="40%" height={12} />
      </div>
    </div>
    <Skeleton variant="rounded" width="100%" height={80} />
    <div className={styles.cardFooter}>
      <Skeleton variant="rounded" width={80} height={32} />
      <Skeleton variant="rounded" width={80} height={32} />
    </div>
  </div>
);

/**
 * Skeleton pré-configurado para items de lista
 */
export const SkeletonListItem = ({ className }: { className?: string }) => (
  <div className={clsx(styles.listItem, className)}>
    <Skeleton variant="circular" width={40} height={40} />
    <div className={styles.listItemContent}>
      <Skeleton variant="text" width="60%" height={14} />
      <Skeleton variant="text" width="40%" height={12} />
    </div>
  </div>
);

/**
 * Skeleton pré-configurado para KPI cards
 */
export const SkeletonKpi = ({ className }: { className?: string }) => (
  <div className={clsx(styles.kpi, className)}>
    <Skeleton variant="text" width="50%" height={12} />
    <Skeleton variant="text" width="30%" height={28} />
  </div>
);

export { default as SkeletonProfiles } from "./SkeletonProfiles";
export { default as SkeletonDevices } from "./SkeletonDevices";
export { default as SkeletonCampaigns } from "./SkeletonCampaigns";

export default Skeleton;
