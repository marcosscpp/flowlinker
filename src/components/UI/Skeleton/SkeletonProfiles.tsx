import Skeleton from "./index";
import styles from "./SkeletonPages.module.scss";

interface SkeletonProfilesProps {
  count?: number;
}

/**
 * Skeleton para a página de Perfis - cards com avatar, info e ações
 */
const SkeletonProfiles = ({ count = 4 }: SkeletonProfilesProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.profileCard}>
          {/* Header com nome e badge de plataforma */}
          <div className={styles.profileHeader}>
            <Skeleton variant="text" width="50%" height={20} />
            <Skeleton variant="circular" width={48} height={48} />
          </div>

          {/* Info do perfil */}
          <div className={styles.profileInfo}>
            <div className={styles.infoRow}>
              <Skeleton variant="circular" width={20} height={20} />
              <Skeleton variant="text" width="70%" height={14} />
            </div>
            <div className={styles.infoRow}>
              <Skeleton variant="circular" width={20} height={20} />
              <Skeleton variant="text" width="50%" height={14} />
            </div>
            <div className={styles.infoRow}>
              <Skeleton variant="rounded" width={60} height={24} />
            </div>
          </div>

          {/* Ações */}
          <div className={styles.profileActions}>
            <Skeleton variant="rounded" width={80} height={32} />
            <Skeleton variant="rounded" width={80} height={32} />
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonProfiles;
