'use client';

import { JSX, ReactNode } from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { REVEAL_ANIMATION, REVEAL_TEST_IDS } from './constants';

interface RevealProps {
  children: ReactNode;
}

const revealIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(${REVEAL_ANIMATION.liftPx}px)
      scale(${REVEAL_ANIMATION.startScale});
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const Container = styled.div`
  animation: ${revealIn} ${REVEAL_ANIMATION.durationMs}ms
    ${REVEAL_ANIMATION.easing} both;
`;

export function Reveal({ children }: RevealProps): JSX.Element {
  return <Container data-testid={REVEAL_TEST_IDS.reveal}>{children}</Container>;
}
