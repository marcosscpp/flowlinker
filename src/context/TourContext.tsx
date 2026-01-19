import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

const TOUR_STORAGE_KEY = "flowlinker-tour-completed";

interface TourContextValue {
  isRunning: boolean;
  stepIndex: number;
  hasCompletedTour: boolean;
  startTour: () => void;
  stopTour: () => void;
  resetTour: () => void;
  setStepIndex: (index: number) => void;
  completeTour: () => void;
}

const TourContext = createContext<TourContextValue | undefined>(undefined);

export const TourProvider = ({ children }: { children: ReactNode }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [hasCompletedTour, setHasCompletedTour] = useState(() => {
    return localStorage.getItem(TOUR_STORAGE_KEY) === "true";
  });

  const startTour = useCallback(() => {
    setStepIndex(0);
    setIsRunning(true);
  }, []);

  const stopTour = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTour = useCallback(() => {
    localStorage.removeItem(TOUR_STORAGE_KEY);
    setHasCompletedTour(false);
    setStepIndex(0);
    setIsRunning(true);
  }, []);

  const completeTour = useCallback(() => {
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
    setHasCompletedTour(true);
    setIsRunning(false);
  }, []);

  const value = useMemo<TourContextValue>(
    () => ({
      isRunning,
      stepIndex,
      hasCompletedTour,
      startTour,
      stopTour,
      resetTour,
      setStepIndex,
      completeTour,
    }),
    [isRunning, stepIndex, hasCompletedTour, startTour, stopTour, resetTour, completeTour]
  );

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour deve ser usado dentro de um TourProvider");
  }
  return context;
};


