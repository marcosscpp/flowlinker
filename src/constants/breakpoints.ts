/**
 * Breakpoints responsivos do projeto.
 * Usar esses valores para consistência entre componentes e CSS.
 */
export const BREAKPOINTS = {
  /** Mobile: até 768px */
  mobile: 768,
  /** Tablet: até 1024px */
  tablet: 1024,
  /** Desktop: até 1280px */
  desktop: 1280,
  /** Wide: acima de 1280px */
  wide: 1440,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;
