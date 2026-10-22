import { css, keyframes, type SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';
import { LAYERS } from '@/theme/layers';
import { REDUCED_MOTION } from '@/theme/motion';
import { PIGGY_BANK_COLORS } from '@/theme/piggy-bank-colors';
import { coinFace } from '../coin-parts';
import { FLYING_COIN_SIZE, SLOT_CENTRE_PERCENT, type CoinFlight } from './constants';

const fly = keyframes`
  0% {
    transform: translate(0, 0) scale(0.4);
    opacity: 0;
  }
  10% {
    transform: translate(calc(var(--drift) * 0.1), calc(var(--rise) * -0.5)) scale(0.9)
      rotateY(180deg);
    opacity: 1;
  }
  35% {
    transform: translate(calc(var(--drift) * 0.45), calc(var(--rise) * -1)) scale(1)
      rotateY(360deg);
    opacity: 1;
  }
  85% {
    transform: translate(calc(var(--drift) * 0.9), calc(var(--fall) * 0.8)) scale(0.95)
      rotateY(760deg);
    opacity: 1;
  }
  100% {
    transform: translate(var(--drift), var(--fall)) scale(0.9) rotateY(900deg);
    opacity: 0;
  }
`;

export const Fountain = styled.div`
  position: absolute;
  left: ${SLOT_CENTRE_PERCENT.left}%;
  top: ${SLOT_CENTRE_PERCENT.top}%;
  z-index: ${LAYERS.celebration};
  pointer-events: none;

  @media ${REDUCED_MOTION} {
    display: none;
  }
`;

function flightOf({ coin }: { coin: CoinFlight }): SerializedStyles {
  const [driftPx, risePx, fallPx, flightMs, delayMs] = coin;

  return css`
    --drift: ${driftPx}px;
    --rise: ${risePx}px;
    --fall: ${fallPx}px;
    animation-duration: ${flightMs}ms;
    animation-delay: ${delayMs}ms;
  `;
}

export const FlyingCoin = styled.i<{ coin: CoinFlight }>`
  position: absolute;
  left: ${-FLYING_COIN_SIZE / 2}px;
  top: ${-FLYING_COIN_SIZE / 2}px;
  width: ${FLYING_COIN_SIZE}px;
  height: ${FLYING_COIN_SIZE}px;
  border-radius: 50%;
  background: ${coinFace};
  box-shadow: inset 0 0 0 2px ${PIGGY_BANK_COLORS.coinRim};
  animation-name: ${fly};
  animation-timing-function: cubic-bezier(0.3, 0.6, 0.5, 1);
  animation-fill-mode: both;
  ${flightOf}
`;
