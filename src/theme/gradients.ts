import { COLORS } from './palette';

export const GRADIENTS = {
  screen: `linear-gradient(160deg, ${COLORS.screenGradientStart}, ${COLORS.screenGradientMid}, ${COLORS.screenGradientEnd})`,
} as const;
