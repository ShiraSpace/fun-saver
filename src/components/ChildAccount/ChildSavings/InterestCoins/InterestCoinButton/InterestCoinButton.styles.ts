import styled from '@emotion/styled';
import { PIGGY_BANK_COLORS, PIGGY_BANK_GRADIENT_STOPS } from '@/theme/piggy-bank-colors';

const coinFace = `radial-gradient(circle at 35% 30%, ${PIGGY_BANK_GRADIENT_STOPS.coinFace
  .map(({ offset, color }) => `${color} ${offset * 100}%`)
  .join(', ')})`;

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
  left: 0;
  right: 0;
  width: max-content;
  margin: 4px auto 0;
  padding: 1px 6px;
  border-radius: 999px;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 800;
  white-space: nowrap;
  color: ${({ theme }): string => theme.colors.gainText};
  background: ${({ theme }): string => theme.colors.gainSoftBg};
`;
