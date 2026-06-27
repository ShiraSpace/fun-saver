import { COLORS } from './palette';

export const GRADIENTS = {
  screen: `linear-gradient(160deg, ${COLORS.screenGradientStart}, ${COLORS.screenGradientMid}, ${COLORS.screenGradientEnd})`,
  actionButton: `linear-gradient(${COLORS.primaryGradientTop}, ${COLORS.primary})`,
  sunnyTile: `linear-gradient(135deg, ${COLORS.sunnyTileSoft}, ${COLORS.screenGradientStart})`,
  potSavings: 'linear-gradient(135deg,#FFE6B0,#FFC34D)',
  potSpending: 'linear-gradient(135deg,#FFD8C7,#FF8A4C)',
  potGood: 'linear-gradient(135deg,#FBC4DA,#E94E89)',
} as const;
