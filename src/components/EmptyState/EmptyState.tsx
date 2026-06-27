'use client';

import { JSX } from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { ActionButton } from '@/components/ActionButton';
import { Screen } from '@/components/Screen';
import { useOinkThenRun } from './use-oink-then-run';
import {
  EMPTY_STATE_ANIMATION,
  EMPTY_STATE_COPY,
  EMPTY_STATE_LAYOUT,
  EMPTY_STATE_TEST_IDS,
} from './constants';

const oink = keyframes`
  0% { transform: scale(1) rotate(0); }
  30% { transform: scale(1.15, 0.85) rotate(-6deg); }
  60% { transform: scale(0.95, 1.05) rotate(6deg); }
  100% { transform: scale(1) rotate(0); }
`;

const Pig = styled.span`
  font-size: ${EMPTY_STATE_LAYOUT.emojiSize}px;
  line-height: 1;
  display: inline-block;

  &[data-oinking='true'] {
    animation: ${oink} ${EMPTY_STATE_ANIMATION.oinkMs}ms ease-in-out;
  }
`;

interface EmptyStateProps {
  onCreate: () => void;
}

export function EmptyState({ onCreate }: EmptyStateProps): JSX.Element {
  const { isOinking, onCtaClick, onPigDoneOinking } = useOinkThenRun(onCreate);

  return (
    <Screen data-testid={EMPTY_STATE_TEST_IDS.container}>
      <Pig
        data-testid={EMPTY_STATE_TEST_IDS.pig}
        data-oinking={isOinking}
        onAnimationEnd={onPigDoneOinking}
      >
        {EMPTY_STATE_COPY.pig}
      </Pig>
      <ActionButton
        type="button"
        data-testid={EMPTY_STATE_TEST_IDS.createAccount}
        onClick={onCtaClick}
      >
        {EMPTY_STATE_COPY.createAccount}
      </ActionButton>
    </Screen>
  );
}
