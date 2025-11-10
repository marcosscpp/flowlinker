import { isValidElement, useState } from "react";
import type { ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import Label from "../Label";
import InputIcon from "./InputIcon";
import clsx from "clsx";
import styles from "./Input.module.scss";

interface InputProps {
  error?: boolean;
  id: string;
  label: string;
  leftIcon?: ReactNode;
  name: string;
  placeholder?: string;
  rightIcon?: ReactNode;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  supportText?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search";
  value?: string;
}

const Input = ({
  error = false,
  id,
  label,
  leftIcon,
  name,
  placeholder,
  rightIcon,
  showLeftIcon,
  showRightIcon,
  supportText,
  type = "text",
  value,
}: InputProps) => {
  const shouldShowLeftIcon = showLeftIcon ?? !!leftIcon;
  const shouldShowRightIcon = showRightIcon ?? !!rightIcon;

  return (
    <div className={styles.field}>
      <Label htmlFor={id} error={error}>
        {label}
      </Label>

      <div className={clsx(styles.inputWrapper, { [styles.error]: error })}>
        {shouldShowLeftIcon && leftIcon && (
          <div className={styles.iconLeft}>
            {isValidElement(leftIcon) ? (
              <InputIcon position="left">{leftIcon}</InputIcon>
            ) : (
              leftIcon
            )}
          </div>
        )}

        <input
          className={clsx(styles.input, "placeholder", {
            [styles.inputError]: error,
            [styles.inputWithLeftIcon]: shouldShowLeftIcon,
            [styles.inputWithRightIcon]: shouldShowRightIcon,
          })}
          type={type}
          placeholder={placeholder || ""}
          id={id}
          name={name}
          value={value}
        />

        {shouldShowRightIcon && rightIcon && (
          <div className={styles.iconRight}>
            {isValidElement(rightIcon) ? (
              <InputIcon position="right">{rightIcon}</InputIcon>
            ) : (
              rightIcon
            )}
          </div>
        )}
      </div>

      {supportText && (
        <div
          className={clsx("support-text", { [styles.supportTextError]: error })}
        >
          {supportText}
        </div>
      )}
    </div>
  );
};

interface PasswordInputProps
  extends Omit<InputProps, "type" | "rightIcon" | "showRightIcon"> {
  showPasswordToggle?: boolean;
}

const PasswordInput = ({
  error = false,
  id,
  label,
  leftIcon,
  name,
  placeholder,
  showLeftIcon,
  showPasswordToggle = true,
  supportText,
  value,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const rightIcon = showPasswordToggle ? (
    <button
      className={styles.passwordToggle}
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
    >
      <HugeiconsIcon icon={showPassword ? ViewOffSlashIcon : ViewIcon} />
    </button>
  ) : undefined;

  return (
    <Input
      error={error}
      id={id}
      label={label}
      leftIcon={leftIcon}
      name={name}
      placeholder={placeholder}
      rightIcon={rightIcon}
      showLeftIcon={showLeftIcon}
      showRightIcon={showPasswordToggle}
      supportText={supportText}
      type={showPassword ? "text" : "password"}
      value={value}
    />
  );
};

Input.Password = PasswordInput;

export default Input;
