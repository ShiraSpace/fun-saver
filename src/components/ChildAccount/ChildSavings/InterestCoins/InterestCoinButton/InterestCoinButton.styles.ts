import styled from '@emotion/styled';
import { PIGGY_BANK_COLORS } from '@/theme/piggy-bank-colors';
import { coinFace } from '../../coin-parts';

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

  &:disabled {
    z-index: 1;
  }
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
