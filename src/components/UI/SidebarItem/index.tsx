import clsx from "clsx";
import styles from "./SidebarItem.module.scss";

import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface SidebarItemProps {
  badgeValue?: number;
  children: ReactNode;
  isExpanded?: boolean;
  status: "active" | "default";
  to: string;
  traillingIcon: ReactNode;
  "data-tourid"?: string;
}

const SidebarItem = ({
  badgeValue,
  children,
  status,
  to,
  traillingIcon,
  isExpanded = true,
  "data-tourid": dataTourid,
}: SidebarItemProps) => {
  return (
    <li
      className={clsx(styles.item, {
        [styles.expanded]: isExpanded,
        [styles.active]: status === "active",
      })}
      data-tourid={dataTourid}
    >
      <Link to={to} className={styles.content}>
        <div className={styles.contentWrapper}>
          {traillingIcon && (
            <div className={styles.traillingIcon}>{traillingIcon}</div>
          )}
          {isExpanded && <div className="body-lg">{children}</div>}
        </div>
        {isExpanded && badgeValue && (
          <div className={clsx(styles.badge, "mono-sm")}>{badgeValue}</div>
        )}
      </Link>
    </li>
  );
};

export default SidebarItem;
