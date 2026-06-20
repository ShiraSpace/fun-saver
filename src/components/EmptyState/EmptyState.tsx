'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import { ActionButton } from '@/components/ActionButton';
import {
  EMPTY_STATE_COPY,
  EMPTY_STATE_LAYOUT,
  EMPTY_STATE_TEST_IDS,
} from './constants';

const Screen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${EMPTY_STATE_LAYOUT.gap}px;
  min-height: 100vh;
  text-align: center;
`;

const Emoji = styled.span`
  font-size: ${EMPTY_STATE_LAYOUT.emojiSize}px;
  line-height: 1;
`;

export function EmptyState(): JSX.Element {
  return (
    <Screen data-testid={EMPTY_STATE_TEST_IDS.container}>
      <Emoji data-testid={EMPTY_STATE_TEST_IDS.brand}>
        {EMPTY_STATE_COPY.brandEmoji}
      </Emoji>
      <ActionButton
        type="button"
        data-testid={EMPTY_STATE_TEST_IDS.createAccount}
      >
        {EMPTY_STATE_COPY.createAccount}
      </ActionButton>
    </Screen>
  );
}
