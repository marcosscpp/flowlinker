import { cloneElement, isValidElement } from "react";
import type { ReactNode } from "react";

interface InputIconProps {
  children: ReactNode;
  position: "left" | "right";
}

const InputIcon = ({ children, position }: InputIconProps) => {
  if (!isValidElement(children)) {
    return <>{children}</>;
  }

  const defaultProps: Record<string, unknown> = {
    color: "var(--color-gray-600)",
    strokeWidth: 1.5,
    size: position === "left" ? 24 : 32,
  };

  const existingProps = (children.props || {}) as Record<string, unknown>;
  return cloneElement(children, {
    ...defaultProps,
    ...existingProps,
  });
};

export default InputIcon;
