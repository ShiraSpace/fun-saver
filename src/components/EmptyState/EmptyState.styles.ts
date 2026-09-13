import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { EMPTY_STATE_ANIMATION, EMPTY_STATE_LAYOUT } from './constants';

const oink = keyframes`
  0% { transform: scale(1) rotate(0); }
  30% { transform: scale(1.15, 0.85) rotate(-6deg); }
  60% { transform: scale(0.95, 1.05) rotate(6deg); }
  100% { transform: scale(1) rotate(0); }
`;

export const Pig = styled.span`
  font-size: ${EMPTY_STATE_LAYOUT.emojiSize}px;
  line-height: 1;
  display: inline-block;

  &[data-oinking='true'] {
    animation: ${oink} ${EMPTY_STATE_ANIMATION.oinkMs}ms ease-in-out;
  }
`;
