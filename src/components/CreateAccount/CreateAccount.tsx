'use client';

import { JSX } from 'react';
import { Screen } from '@/components/Screen';
import { CREATE_ACCOUNT_TEST_IDS } from './constants';

export function CreateAccount(): JSX.Element {
  return (
    <Screen data-testid={CREATE_ACCOUNT_TEST_IDS.container}>
      <input data-testid={CREATE_ACCOUNT_TEST_IDS.nameInput} />
    </Screen>
  );
}
