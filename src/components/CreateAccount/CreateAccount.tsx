'use client';

import { JSX } from 'react';
import { CREATE_ACCOUNT_TEST_IDS } from './constants';

export function CreateAccount(): JSX.Element {
  return <input data-testid={CREATE_ACCOUNT_TEST_IDS.nameInput} />;
}
