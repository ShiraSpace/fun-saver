import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { Pig as BarePig } from '@/components/Pig/Pig';
import { SCREEN_LAYOUT } from '@/components/Screen/constants';
import { EMPTY_STATE_ANIMATION } from './constants';

const oink = keyframes`
  0% { transform: scale(1) rotate(0); }
  30% { transform: scale(1.15, 0.85) rotate(-6deg); }
  60% { transform: scale(0.95, 1.05) rotate(6deg); }
  100% { transform: scale(1) rotate(0); }
`;

export const Pig = styled(BarePig)`
  &[data-oinking='true'] {
    animation: ${oink} ${EMPTY_STATE_ANIMATION.oinkMs}ms ease-in-out;
  }
`;

export const Centre = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${SCREEN_LAYOUT.gap}px;
`;
