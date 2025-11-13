import type { ReactNode } from "react";
import styles from "./PageHeader.module.scss";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

const PageHeader = ({ title, subtitle, action }: PageHeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.titleSection}>
        <h1 className="title-lg">{title}</h1>
        {subtitle && <p className={`body-lg ${styles.subtitle}`}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </header>
  );
};

export default PageHeader;
