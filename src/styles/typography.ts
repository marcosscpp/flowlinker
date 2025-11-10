export const typography = {
  spaceGrotesk: {
    titleLg: {
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: "2.25rem",
      lineHeight: "120%",
      fontWeight: 700, // Bold
    },
    titleMd: {
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: "1.5rem",
      lineHeight: "120%",
      fontWeight: 700, // Bold
    },
  },

  // Space Mono
  spaceMono: {
    monoSm: {
      fontFamily: "'Space Mono', monospace",
      fontSize: "1rem",
      lineHeight: "140%",
      fontWeight: 400, // Regular
    },
  },

  // Montserrat
  montserrat: {
    label: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: "1rem",
      lineHeight: "120%",
      fontWeight: 500, // Medium
      textTransform: "none" as const,
    },
    placeholder: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: "1rem",
      lineHeight: "120%",
      fontWeight: 400, // Regular
      textTransform: "none" as const,
    },
    supportText: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: "0.875rem",
      lineHeight: "130%",
      fontWeight: 400, // Regular
      textTransform: "none" as const,
    },
    bodySm: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: "1rem",
      lineHeight: "130%",
      fontWeight: 400, // Regular / Bold
      textTransform: "none" as const,
    },
    bodyMd: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: "1.125rem",
      lineHeight: "130%",
      fontWeight: 400, // Regular / Bold
      textTransform: "none" as const,
    },
    bodyLg: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: "1.375rem",
      lineHeight: "130%",
      fontWeight: 400, // Regular / SemiBold
      textTransform: "none" as const,
    },
  },
};

export type Typography = typeof typography;
