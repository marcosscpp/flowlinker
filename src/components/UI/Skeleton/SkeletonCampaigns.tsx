import Skeleton from "./index";
import styles from "./SkeletonPages.module.scss";

interface SkeletonCampaignsProps {
  count?: number;
}

/**
 * Skeleton para a página de Campanhas - cards com progresso e detalhes
 */
const SkeletonCampaigns = ({ count = 3 }: SkeletonCampaignsProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.campaignCard}>
          {/* Header com ícone e título */}
          <div className={styles.campaignHeader}>
            <Skeleton variant="circular" width={44} height={44} />
            <div className={styles.campaignTexts}>
              <div className={styles.campaignTitleRow}>
                <Skeleton variant="text" width="40%" height={18} />
                <Skeleton variant="rounded" width={100} height={24} />
              </div>
              <Skeleton variant="text" width="60%" height={14} />
            </div>
          </div>

          {/* Barra de progresso */}
          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <Skeleton variant="text" width={70} height={14} />
              <Skeleton variant="text" width={100} height={14} />
            </div>
            <Skeleton variant="rounded" width="100%" height={8} />
          </div>

          {/* Detalhes */}
          <div className={styles.campaignDetails}>
            <div className={styles.detailItem}>
              <Skeleton variant="text" width={80} height={10} />
              <Skeleton variant="text" width={120} height={14} />
            </div>
            <div className={styles.detailItem}>
              <Skeleton variant="text" width={70} height={10} />
              <Skeleton variant="text" width={140} height={14} />
            </div>
            <div className={styles.detailItem}>
              <Skeleton variant="text" width={50} height={10} />
              <div className={styles.accountsBadges}>
                <Skeleton variant="rounded" width={60} height={20} />
                <Skeleton variant="rounded" width={60} height={20} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonCampaigns;
