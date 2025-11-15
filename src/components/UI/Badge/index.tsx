import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "./Badge.module.scss";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

const Badge = ({ children, className }: BadgeProps) => {
  return (
    <span className={clsx("body-sm-bold", styles.badge, className)}>
      {children}
    </span>
  );
};

export default Badge;
