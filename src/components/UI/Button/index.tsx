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
      {leftIcon ? <span className={styles.icon}>{leftIcon}</span> : null}

      <span className={styles.text}>{children}</span>

      {rightIcon ? <span className={styles.icon}>{rightIcon}</span> : null}

      {isLoading ? <Loader size="sm" aria-hidden /> : null}
    </button>
  );
};

export default Button;
