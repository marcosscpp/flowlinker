import { cloneElement, isValidElement } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import clsx from "clsx";
import styles from "./Button.module.scss";
import { Loader } from "@/components";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode | string;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const BUTTON_ICON_SIZE = "1.75rem"; // 28px

const processIcon = (icon: ReactNode): ReactNode => {
  if (!isValidElement(icon)) {
    return icon;
  }

  const defaultProps: Record<string, unknown> = {
    size: BUTTON_ICON_SIZE,
  };

  const existingProps = (icon.props || {}) as Record<string, unknown>;
  return cloneElement(icon, {
    ...defaultProps,
    ...existingProps,
  });
};

const Button = ({
  children,
  className,
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  type = "button",
  ...props
}: ButtonProps) => {
  const processedLeftIcon = leftIcon ? processIcon(leftIcon) : null;
  const processedRightIcon = rightIcon ? processIcon(rightIcon) : null;

  return (
    <button
      type={type}
      className={clsx(
        styles.button,
        "body-sm",
        { [styles.fullWidth]: fullWidth },
        className
      )}
      {...props}
    >
      {processedLeftIcon ? (
        <span className={styles.icon}>{processedLeftIcon}</span>
      ) : null}

      <span className={styles.text}>{children}</span>

      {processedRightIcon ? (
        <span className={styles.icon}>{processedRightIcon}</span>
      ) : null}

      {isLoading ? <Loader size="sm" aria-hidden /> : null}
    </button>
  );
};

export default Button;
