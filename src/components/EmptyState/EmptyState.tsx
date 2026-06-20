'use client';

import { JSX } from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import { ActionButton } from '@/components/ActionButton';
import { Screen } from '@/components/Screen';
import {
  EMPTY_STATE_COPY,
  EMPTY_STATE_LAYOUT,
  EMPTY_STATE_TEST_IDS,
} from './constants';

const Emoji = styled.span`
  font-size: ${EMPTY_STATE_LAYOUT.emojiSize}px;
  line-height: 1;
`;

const CreateAccountLink = ActionButton.withComponent(Link);

interface EmptyStateProps {
  createAccountHref: string;
}

export function EmptyState({
  createAccountHref,
}: EmptyStateProps): JSX.Element {
  return (
    <Screen data-testid={EMPTY_STATE_TEST_IDS.container}>
      <Emoji data-testid={EMPTY_STATE_TEST_IDS.brand}>
        {EMPTY_STATE_COPY.brandEmoji}
      </Emoji>
      <CreateAccountLink
        href={createAccountHref}
        data-testid={EMPTY_STATE_TEST_IDS.createAccount}
      >
        {EMPTY_STATE_COPY.createAccount}
      </CreateAccountLink>
    </Screen>
  );
}
