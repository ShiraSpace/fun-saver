import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { LAYERS } from '@/theme/layers';
import { BottomSheet, BottomSheetScrim } from '@/components/BottomSheet';
import { SWIPE_TO_CLOSE, TRANSACTION_DRAWER_STYLE } from './constants';

export const Scrim = styled(BottomSheetScrim)`
  z-index: ${LAYERS.modal};
`;

export const Sheet = styled(BottomSheet)<{ offset: number; dragging: boolean }>`
  z-index: ${LAYERS.modalForeground};
  max-height: ${TRANSACTION_DRAWER_STYLE.maxHeight};
  gap: ${TRANSACTION_DRAWER_STYLE.gap}px;
  padding: ${TRANSACTION_DRAWER_STYLE.padding};
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
