export const remToPx = (rem: number, baseFontSize: number = 16): number => {
  return rem * baseFontSize;
};


export const pxToRem = (px: number, baseFontSize: number = 16): number => {
  return px / baseFontSize;
};

