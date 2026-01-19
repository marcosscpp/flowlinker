import Skeleton from "./index";
import styles from "./SkeletonPages.module.scss";

interface SkeletonDevicesProps {
  count?: number;
}

/**
 * Skeleton para a página de Dispositivos - cards horizontais
 */
const SkeletonDevices = ({ count = 3 }: SkeletonDevicesProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.deviceCard}>
          {/* Status e info */}
          <div className={styles.deviceStatus}>
            <Skeleton variant="circular" width={16} height={16} />
            <div className={styles.deviceTexts}>
              <Skeleton variant="text" width={200} height={18} />
              <Skeleton variant="text" width={280} height={14} />
              <Skeleton variant="text" width={160} height={12} />
            </div>
          </div>

          {/* Ações */}
          <div className={styles.deviceActions}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="rounded" width={48} height={24} />
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonDevices;
