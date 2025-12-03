import { forwardRef } from "react";
import type { SelectHTMLAttributes, ReactNode } from "react";
import Label from "../Label";
import clsx from "clsx";
import styles from "./Select.module.scss";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: boolean;
  supportText?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error = false, supportText, className, id, name, children, ...rest },
    ref
  ) => {
    return (
      <div className={styles.field}>
        {label && (
          <Label htmlFor={id ?? name ?? ""} error={error}>
            {label}
          </Label>
        )}
        <div className={styles.selectWrapper}>
          <select
            ref={ref}
            id={id ?? name ?? undefined}
            name={name}
            className={clsx(styles.select, className, {
              [styles.error]: error,
            })}
            {...rest}
          >
            {children}
          </select>
        </div>
        {supportText && (
          <div
            className={clsx("support-text", {
              [styles.supportTextError]: error,
            })}
          >
            {supportText}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;

