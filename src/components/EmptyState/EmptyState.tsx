'use client';

import { JSX } from 'react';
import { ActionButton } from '@/components/ActionButton';
import { PIG_EMOJI } from '@/components/Pig/constants';
import { Screen } from '@/components/Screen';
import { useOinkThenRun } from './use-oink-then-run';
import {
  EMPTY_STATE_COPY,
  EMPTY_STATE_LAYOUT,
  EMPTY_STATE_TEST_IDS,
} from './constants';
import { Pig } from './EmptyState.styles';

interface EmptyStateProps {
  onCreate: () => void;
}

export function EmptyState({ onCreate }: EmptyStateProps): JSX.Element {
  const { isOinking, onCtaClick, onPigDoneOinking } = useOinkThenRun(onCreate);

  return (
    <Screen data-testid={EMPTY_STATE_TEST_IDS.container}>
      <Pig
        pigSize={EMPTY_STATE_LAYOUT.emojiSize}
        data-testid={EMPTY_STATE_TEST_IDS.pig}
        data-oinking={isOinking}
        onAnimationEnd={onPigDoneOinking}
      >
        {PIG_EMOJI}
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
