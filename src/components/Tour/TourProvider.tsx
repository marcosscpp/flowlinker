import { useEffect, useCallback } from "react";
import Joyride, { CallBackProps, STATUS, EVENTS, ACTIONS } from "react-joyride";
import { useTour } from "@/context/TourContext";
import TourTooltip from "./TourTooltip";
import tourSteps from "./tourSteps";

const TourProvider = () => {
  const {
    isRunning,
    stepIndex,
    hasCompletedTour,
    startTour,
    stopTour,
    setStepIndex,
    completeTour,
  } = useTour();

  // Inicia o tour automaticamente na primeira visita
  useEffect(() => {
    if (!hasCompletedTour) {
      // Delay para garantir que os elementos estejam renderizados
      const timer = setTimeout(() => {
        startTour();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [hasCompletedTour, startTour]);

  const handleJoyrideCallback = useCallback(
    (data: CallBackProps) => {
      const { status, action, index, type } = data;

      // Atualiza o índice do step
      if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
        const nextIndex = index + (action === ACTIONS.PREV ? -1 : 1);
        setStepIndex(nextIndex);
      }

      // Finaliza o tour
      if (status === STATUS.FINISHED) {
        completeTour();
      }

      // Usuário pulou ou fechou o tour
      if (status === STATUS.SKIPPED || action === ACTIONS.CLOSE) {
        stopTour();
        // Mesmo pulando, marca como completo para não aparecer novamente
        completeTour();
      }
    },
    [setStepIndex, completeTour, stopTour]
  );

  return (
    <Joyride
      steps={tourSteps}
      run={isRunning}
      stepIndex={stepIndex}
      callback={handleJoyrideCallback}
      continuous
      showProgress
      showSkipButton
      spotlightClicks
      disableOverlayClose={false}
      tooltipComponent={TourTooltip}
      floaterProps={{
        disableAnimation: false,
      }}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: "#6e47ff",
          overlayColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    />
  );
};

export default TourProvider;


