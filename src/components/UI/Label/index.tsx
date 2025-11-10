import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "./Label.module.scss";

interface LabelProps {
  children: ReactNode;
  error?: boolean;
  htmlFor?: string;
}

const Label = ({ children, error = false, htmlFor }: LabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx("label", styles.label, {
        [styles.labelError]: error,
      })}
    >
      {children}
    </label>
  );
};

export default Label;
