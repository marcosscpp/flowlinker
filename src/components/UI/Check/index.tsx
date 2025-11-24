import type { InputHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import styles from "./Check.module.scss";

type Size = "sm" | "md" | "lg";

interface CheckProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: ReactNode;
  size?: Size;
  className?: string;
}

const Check = ({
  checked,
  defaultChecked,
  onChange,
  label,
  disabled,
  size = "md",
  className,
  id,
  ...props
}: CheckProps) => {
  const generatedId = id || `check-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <label
      htmlFor={generatedId}
      className={clsx(styles.check, styles[size], className)}
    >
      <span className={styles.checkboxWrapper}>
        <input
          id={generatedId}
          type="checkbox"
          className={clsx(styles.checkbox, {
            [styles.checkboxChecked]: checked,
          })}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
        {checked ?? defaultChecked ? (
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path
              fill="currentColor"
              d="M9 16.17l-3.88-3.88a1 1 0 10-1.41 1.41l4.59 4.59a1 1 0 001.41 0l10-10a1 1 0 10-1.41-1.41L9 16.17z"
            />
          </svg>
        ) : null}
      </span>
      {label ? (
        <span className={clsx("body-sm", styles.label)}>{label}</span>
      ) : null}
    </label>
  );
};

export default Check;
