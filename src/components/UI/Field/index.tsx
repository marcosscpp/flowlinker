import { forwardRef, isValidElement, useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import Label from "../Label";
import InputIcon from "./InputIcon";
import clsx from "clsx";
import styles from "./Input.module.scss";

type AllowedInputType =
  | "email"
  | "number"
  | "password"
  | "search"
  | "tel"
  | "text"
  | "url";

export interface BaseInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "prefix" | "size" | "type"
  > {
  error?: boolean;
  label: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  supportText?: string;
  type?: AllowedInputType;
}

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  (
    {
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
      ...rest
    },
    ref
  ) => {
    const shouldShowLeftIcon = showLeftIcon ?? !!leftIcon;
    const shouldShowRightIcon = showRightIcon ?? !!rightIcon;

    return (
      <div className={styles.field}>
        <Label htmlFor={id ?? name ?? ""} error={error}>
          {label}
        </Label>

        <div className={clsx(styles.inputWrapper, { [styles.error]: error })}>
          {shouldShowLeftIcon && leftIcon ? (
            <div className={styles.iconLeft}>
              {isValidElement(leftIcon) ? (
                <InputIcon position="left">{leftIcon}</InputIcon>
              ) : (
                leftIcon
              )}
            </div>
          ) : null}

          <input
            ref={ref}
            className={clsx(styles.input, "placeholder", {
              [styles.inputError]: error,
              [styles.inputWithLeftIcon]: shouldShowLeftIcon,
              [styles.inputWithRightIcon]: shouldShowRightIcon,
            })}
            id={id ?? name ?? undefined}
            name={name}
            placeholder={placeholder ?? ""}
            type={type}
            {...rest}
          />

          {shouldShowRightIcon && rightIcon ? (
            <div className={styles.iconRight}>
              {isValidElement(rightIcon) ? (
                <InputIcon position="right">{rightIcon}</InputIcon>
              ) : (
                rightIcon
              )}
            </div>
          ) : null}
        </div>

        {supportText ? (
          <div
            className={clsx("support-text", {
              [styles.supportTextError]: error,
            })}
          >
            {supportText}
          </div>
        ) : null}
      </div>
    );
  }
);

BaseInput.displayName = "Input";

interface PasswordInputProps
  extends Omit<BaseInputProps, "type" | "rightIcon" | "showRightIcon"> {
  showPasswordToggle?: boolean;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      error = false,
      id,
      label,
      leftIcon,
      name,
      placeholder,
      showLeftIcon,
      showPasswordToggle = true,
      supportText,
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleButton = showPasswordToggle ? (
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
      <BaseInput
        ref={ref}
        error={error}
        id={id}
        label={label}
        leftIcon={leftIcon}
        name={name}
        placeholder={placeholder}
        rightIcon={toggleButton}
        showLeftIcon={showLeftIcon}
        showRightIcon={showPasswordToggle}
        supportText={supportText}
        type={showPassword ? "text" : "password"}
        {...rest}
      />
    );
  }
);

PasswordInput.displayName = "InputPassword";

const Input = Object.assign(BaseInput, { Password: PasswordInput });

export default Input;
