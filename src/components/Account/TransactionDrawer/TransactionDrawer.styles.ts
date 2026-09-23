import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { LAYERS } from '@/theme/layers';
import { SWIPE_TO_CLOSE, TRANSACTION_DRAWER_STYLE } from './constants';

export const Scrim = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }): string => theme.tints.shade};
  z-index: ${LAYERS.modal};
`;

export const Sheet = styled.div<{ offset: number; dragging: boolean }>`
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: ${LAYERS.modalForeground};
  width: 100%;
  max-width: ${TRANSACTION_DRAWER_STYLE.maxWidth}px;
  max-height: ${TRANSACTION_DRAWER_STYLE.maxHeight};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${TRANSACTION_DRAWER_STYLE.gap}px;
  padding: ${TRANSACTION_DRAWER_STYLE.padding};
  background: ${({ theme }): string => theme.colors.surface};
  border-radius: ${TRANSACTION_DRAWER_STYLE.sheetRadius}px
    ${TRANSACTION_DRAWER_STYLE.sheetRadius}px 0 0;
  box-shadow: 0 -10px 30px ${({ theme }): string => theme.shadows.deep};
  transform: translateY(${({ offset }): number => offset}px);
  transition: ${({ dragging }): string =>
    dragging ? 'none' : `transform ${SWIPE_TO_CLOSE.snapMs}ms ease`};
`;

export const Handle = styled.div`
  width: 44px;
  height: 8px;
  flex-shrink: 0;
  padding-bottom: ${TRANSACTION_DRAWER_STYLE.handlePaddingBottom}px;
  border-radius: 999px;
  background: ${({ theme }): string => theme.colors.divider};
  margin: 2px auto;
  cursor: grab;
  touch-action: none;
  &:active {
    cursor: grabbing;
  }
`;

const swapIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Body = styled.div`
  display: flex;
  padding-bottom: ${TRANSACTION_DRAWER_STYLE.bodyPaddingBottom}px;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  animation: ${swapIn} 0.2s ease;
`;
