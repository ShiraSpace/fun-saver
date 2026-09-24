'use client';

import { JSX } from 'react';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Header } from '@/components/Header';
import { PIG_EMOJI } from '@/components/Pig/constants';
import { Column, Screen } from '@/components/Screen';
import { useOinkThenRun } from './use-oink-then-run';
import {
  EMPTY_STATE_COPY,
  EMPTY_STATE_LAYOUT,
  EMPTY_STATE_TEST_IDS,
} from './constants';
import { Centre, Pig } from './EmptyState.styles';

interface EmptyStateProps {
  onCreate: () => void;
}

export function EmptyState({ onCreate }: EmptyStateProps): JSX.Element {
  const { isOinking, onCtaClick, onPigDoneOinking } = useOinkThenRun(onCreate);

  return (
    <Screen align="top" data-testid={EMPTY_STATE_TEST_IDS.container}>
      <Column>
        <Header title={EMPTY_STATE_COPY.greeting} />
      </Column>
      <Centre>
        <Pig
          size={EMPTY_STATE_LAYOUT.emojiSize}
          data-testid={EMPTY_STATE_TEST_IDS.pig}
          data-oinking={isOinking}
          onAnimationEnd={onPigDoneOinking}
        >
          {PIG_EMOJI}
        </Pig>
        <PrimaryButton
          type="button"
          data-testid={EMPTY_STATE_TEST_IDS.createAccount}
          onClick={onCtaClick}
        >
          {EMPTY_STATE_COPY.createAccount}
        </PrimaryButton>
      </Centre>
    </Screen>
  );
}
