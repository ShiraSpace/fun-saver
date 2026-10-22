import { css, keyframes, type SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';
import { REDUCED_MOTION } from '@/theme/motion';
import { afterTheCelebrationWait } from '@/components/Goal/Celebration/celebration-parts';
import { FIRST_TWINKLE_MS, TWINKLE_GAP_MS, type TwinklePlace } from './constants';

const twinkle = keyframes`
  0%,
  100% {
    transform: scale(0) rotate(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(90deg);
    opacity: 1;
  }
`;

const TWINKLE_SIZE = 20;
const TWINKLE_MS = 1200;
const TWINKLES_EACH = 2;

export const Twinkles = styled.span`
  position: absolute;
  inset: 0;
  pointer-events: none;

  @media ${REDUCED_MOTION} {
    display: none;
  }
`;

interface PlacedTwinkle {
  place: TwinklePlace;
  turn: number;
}

function placeOf({ place, turn }: PlacedTwinkle): SerializedStyles {
  const [xPx, yPx] = place;

  return css`
    left: calc(50% + ${xPx - TWINKLE_SIZE / 2}px);
    top: calc(50% + ${yPx - TWINKLE_SIZE / 2}px);
    animation-delay: ${afterTheCelebrationWait(FIRST_TWINKLE_MS + turn * TWINKLE_GAP_MS)};
  `;
}

export const Twinkle = styled.span<PlacedTwinkle>`
  position: absolute;
  font-size: ${TWINKLE_SIZE}px;
  line-height: 1;
  animation-name: ${twinkle};
  animation-duration: ${TWINKLE_MS}ms;
  animation-timing-function: ease-in-out;
  animation-iteration-count: ${TWINKLES_EACH};
  animation-fill-mode: both;
  ${placeOf}
`;
