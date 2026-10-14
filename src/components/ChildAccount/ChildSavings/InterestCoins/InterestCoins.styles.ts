import styled from '@emotion/styled';
import { PIGGY_BANK_COLORS, PIGGY_BANK_GRADIENT_STOPS } from '@/theme/piggy-bank-colors';

const coinFace = `radial-gradient(circle at 35% 30%, ${PIGGY_BANK_GRADIENT_STOPS.coinFace
  .map(({ offset, color }) => `${color} ${offset * 100}%`)
  .join(', ')})`;

export const TapTheCoins = styled.p`
  min-height: 20px;
  margin: 0;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.gainText};
`;

export const CoinRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: end;
  gap: 6px;
  height: 58px;
  padding-bottom: 16px;
`;

export const CoinButton = styled.button`
  position: relative;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font: inherit;
  font-size: ${({ theme }): number => theme.typography.heading}px;
  font-weight: 800;
  color: ${PIGGY_BANK_COLORS.coinEdge};
  background: ${coinFace};
  box-shadow:
    inset 0 0 0 3px ${PIGGY_BANK_COLORS.coinRim},
    inset 0 -4px 0 ${PIGGY_BANK_COLORS.coinEdge},
    0 4px 8px ${({ theme }): string => theme.shadows.soft};
`;

export const CoinAmount = styled.span`
  position: absolute;
  top: 100%;
  left: 50%;
  translate: -50% 4px;
  padding: 1px 6px;
  border-radius: 999px;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 800;
  white-space: nowrap;
  color: ${({ theme }): string => theme.colors.gainText};
  background: ${({ theme }): string => theme.colors.gainSoftBg};
`;
