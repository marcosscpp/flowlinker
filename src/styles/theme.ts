import { colors } from "@/styles/colors";

export const theme = {
  colors: {
    ...colors,
  },
  background: {
    primary: colors.white,
    secondary: colors.gray[50],
    tertiary: colors.gray[100],
  },
  text: {
    primary: colors.gray[900],
    secondary: colors.gray[700],
    tertiary: colors.gray[600],
    disabled: colors.gray[400],
  },
  border: {
    default: colors.gray[300],
    light: colors.gray[100],
    dark: colors.gray[600],
  },
  gradients: {
    facebook: colors.gradients.facebook,
    instagram: colors.gradients.instagram,
  },
};

export type Theme = typeof theme;
