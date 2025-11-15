import clsx from "clsx";
import type {
  ButtonHTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from "react";
import styles from "./Toggler.module.scss";

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "onClick"
>;

type TogglerProps = NativeButtonProps & {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: ReactNode;
};

const Toggler = ({
  checked,
  onChange,
  label,
  disabled,
  className,
  ...props
}: TogglerProps) => {
  const handleToggle = (event?: MouseEvent | KeyboardEvent) => {
    event?.preventDefault();
    if (disabled) return;
    onChange?.(!checked);
  };

  return (
    <label
      className={clsx(styles.wrapper, className, {
        [styles.disabled]: disabled,
      })}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={typeof label === "string" ? label : undefined}
        className={clsx(styles.toggler, { [styles.checked]: checked })}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            handleToggle(event);
          }
        }}
        {...props}
      >
        <span className={styles.knob} />
      </button>

      {label ? (
        <span className={clsx("body-md", styles.label)}>{label}</span>
      ) : null}
    </label>
  );
};

export default Toggler;