import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import styles from "./KpiCard.module.scss";
import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";

type KpiCardProps = {
  label: string;
  value: number | string;
  className?: string;
  animateNumbers?: boolean;
  tooltip?: string;
  loading?: boolean;
};

const KpiCard = ({
  label,
  value,
  className,
  animateNumbers = true,
  tooltip,
  loading = false,
}: KpiCardProps) => {
  const [displayValue, setDisplayValue] = useState<number | string>(value);
  const valueIsNumber = typeof value === "number";
  const formattedValue = useMemo(() => {
    if (!valueIsNumber) {
      return value;
    }

    const formatter = new Intl.NumberFormat("pt-BR");
    return formatter.format(displayValue as number);
  }, [displayValue, valueIsNumber, value]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!animateNumbers || typeof value !== "number") {
      setDisplayValue(value);
      return;
    }

    const duration = 1000;
    const start = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const currentValue = Math.round(value * progress);
      setDisplayValue(currentValue);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [animateNumbers, value, loading]);

  return (
    <article className={clsx(styles.card, className)}>
      {tooltip && (
        <div
          className={styles.tooltipTrigger}
          aria-label={tooltip}
          role="button"
        >
          <HugeiconsIcon
            icon={InformationCircleIcon}
            size={24}
            className={styles.infoIcon}
          />
          <span className={clsx("support-text", styles.tooltip)}>
            {tooltip}
          </span>
        </div>
      )}
      <div className={styles.labelWrapper}>
        <span className={clsx("body-sm-bold", styles.label)}>{label}</span>
      </div>
      <strong className={clsx("title-lg", styles.value)}>
        {loading ? <span className={styles.skeletonValue} /> : formattedValue}
      </strong>
    </article>
  );
};

export default KpiCard;
