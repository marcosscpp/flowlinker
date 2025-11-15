import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import styles from "./ModalGhostButton.module.scss";

type ModalGhostButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

const ModalGhostButton = ({
  children,
  className,
  type = "button",
  ...props
}: ModalGhostButtonProps) => {
  return (
    <button type={type} className={clsx(styles.button, className)} {...props}>
      {children}
    </button>
  );
};

export default ModalGhostButton;
