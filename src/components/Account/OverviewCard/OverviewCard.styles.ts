import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { EASING, entrance } from '@/theme/motion';
import { DONUT_STYLE, OVERVIEW_CARD_STYLE, TOTAL_ANIMATION } from './constants';

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
  border-radius: ${OVERVIEW_CARD_STYLE.radius}px;
  padding: ${OVERVIEW_CARD_STYLE.padding}px;
  box-shadow: ${OVERVIEW_CARD_STYLE.shadow};
  color: ${({ theme }): string => theme.colors.textStrong};
  display: flex;
  align-items: center;
  gap: ${OVERVIEW_CARD_STYLE.rowGap}px;
`;

export const Ring = styled.div`
  flex-shrink: 0;
  position: relative;
`;

export const Hole = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const HoleLabel = styled.span`
  font-size: ${OVERVIEW_CARD_STYLE.holeLabelSize}px;
  font-weight: 600;
  letter-spacing: ${OVERVIEW_CARD_STYLE.holeLabelSpacing}px;
  color: ${({ theme }): string => theme.colors.textMuted};
`;

export const HoleAmount = styled.span<{ fontSize: number }>`
  font-size: ${({ fontSize }): number => fontSize}px;
  max-width: ${HOLE_DIAMETER}px;
  ${entrance({
    keyframes: fadeIn,
    durationMs: TOTAL_ANIMATION.fadeMs,
    delayMs: TOTAL_ANIMATION.startDelayMs,
    easing: EASING.easeOut,
  })}
`;
