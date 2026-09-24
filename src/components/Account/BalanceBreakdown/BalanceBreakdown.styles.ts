import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { EASING, entrance } from '@/theme/motion';
import {
  DONUT_STYLE,
  BALANCE_BREAKDOWN_STYLE,
  TOTAL_ANIMATION,
} from './constants';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
`;

const HOLE_DIAMETER =
  (DONUT_STYLE.radius - DONUT_STYLE.strokeWidth / 2) *
  2 *
  (DONUT_STYLE.size / DONUT_STYLE.viewBox);

export const Card = styled.div`
  background: ${({ theme }): string => theme.colors.surface};
  border-radius: ${BALANCE_BREAKDOWN_STYLE.radius}px;
  padding: ${BALANCE_BREAKDOWN_STYLE.padding}px;
  box-shadow: 0 6px 0 ${({ theme }): string => theme.shadows.faint};
  color: ${({ theme }): string => theme.colors.textStrong};
  display: flex;
  align-items: center;
  gap: ${BALANCE_BREAKDOWN_STYLE.rowGap}px;
`;

export const Ring = styled.div`
  flex-shrink: 0;
  position: relative;
`;

export const TotalBalance = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const TotalBalanceLabel = styled.span`
  font-size: ${BALANCE_BREAKDOWN_STYLE.totalLabelSize}px;
  font-weight: 600;
  letter-spacing: ${BALANCE_BREAKDOWN_STYLE.totalLabelSpacing}px;
  color: ${({ theme }): string => theme.colors.textMuted};
`;

export const TotalBalanceAmount = styled.span<{ fontSize: number }>`
  font-size: ${({ fontSize }): number => fontSize}px;
  max-width: ${HOLE_DIAMETER}px;
  ${entrance({
    keyframes: fadeIn,
    durationMs: TOTAL_ANIMATION.fadeMs,
    delayMs: TOTAL_ANIMATION.startDelayMs,
    easing: EASING.easeOut,
  })}
`;
