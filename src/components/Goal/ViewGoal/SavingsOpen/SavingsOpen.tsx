import { JSX } from 'react';
import { SAVINGS_OPEN_COPY, SAVINGS_OPEN_TEST_IDS } from './constants';
import { Label } from './SavingsOpen.styles';

export function SavingsOpen(): JSX.Element {
  return <Label data-testid={SAVINGS_OPEN_TEST_IDS.label}>{SAVINGS_OPEN_COPY.label}</Label>;
}
