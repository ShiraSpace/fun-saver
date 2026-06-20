'use client';

import { JSX } from 'react';
import Link from 'next/link';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { ActionButton } from '@/components/ActionButton';
import { Screen } from '@/components/Screen';
import { useOinkThenNavigate } from './use-oink-then-navigate';
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

const CreateAccountLink = ActionButton.withComponent(Link);

interface EmptyStateProps {
  createAccountHref: string;
}

export function EmptyState({
  createAccountHref,
}: EmptyStateProps): JSX.Element {
  const { isOinking, onCtaClick, onPigDoneOinking } =
    useOinkThenNavigate(createAccountHref);

  return (
    <Screen data-testid={EMPTY_STATE_TEST_IDS.container}>
      <Pig
        data-testid={EMPTY_STATE_TEST_IDS.pig}
        data-oinking={isOinking}
        onAnimationEnd={onPigDoneOinking}
      >
        {EMPTY_STATE_COPY.pig}
      </Pig>
      <CreateAccountLink
        href={createAccountHref}
        data-testid={EMPTY_STATE_TEST_IDS.createAccount}
        onClick={onCtaClick}
      >
        {EMPTY_STATE_COPY.createAccount}
      </CreateAccountLink>
    </Screen>
  );
}
