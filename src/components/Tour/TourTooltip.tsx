import type { TooltipRenderProps } from "react-joyride";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components";
import styles from "./Tour.module.scss";

const TourTooltip = ({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  tooltipProps,
  size,
  isLastStep,
}: TooltipRenderProps) => {
  return (
    <div className={styles.tooltip} {...tooltipProps}>
      <button
        className={styles.closeButton}
        {...closeProps}
        aria-label="Fechar tour"
      >
        <HugeiconsIcon icon={Cancel01Icon} size="1.25rem" />
      </button>

      {step.title && <h3 className={styles.title}>{step.title}</h3>}

      <div className={styles.content}>{step.content}</div>

      <div className={styles.footer}>
        <div className={styles.progress}>
          <span>
            {index + 1} de {size}
          </span>
        </div>

        <div className={styles.actions}>
          {index > 0 && (
            <button className={styles.backButton} {...backProps}>
              Anterior
            </button>
          )}

          {!isLastStep && (
            <button className={styles.skipButton} {...skipProps}>
              Pular
            </button>
          )}

          {continuous && (
            <Button {...primaryProps} className={styles.nextButton}>
              {isLastStep ? "Finalizar" : "Próximo"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourTooltip;


