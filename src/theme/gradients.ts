import { COLORS } from './palette';

export const GRADIENTS = {
  screen: `linear-gradient(160deg, ${COLORS.screenGradientStart}, ${COLORS.screenGradientMid}, ${COLORS.screenGradientEnd})`,
  actionButton: `linear-gradient(${COLORS.primaryGradientTop}, ${COLORS.primary})`,
} as const;
