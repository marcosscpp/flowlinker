import clsx from "clsx";
import type { HTMLAttributes } from "react";
import styles from "./Status.module.scss";

export type StatusVariant = "success" | "warning" | "danger";

type StatusProps = HTMLAttributes<HTMLSpanElement> & {
  label: string;
  variant?: StatusVariant;
};

const Status = ({
  label,
  variant = "success",
  className,
  ...props
}: StatusProps) => {
  return (
    <span
      className={clsx(styles.status, styles[variant], className)}
      {...props}
    >
      <span className={styles.dot} aria-hidden />
      <span className={clsx("support-text", styles.label)}>{label}</span>
    </span>
  );
};

export default Status;
