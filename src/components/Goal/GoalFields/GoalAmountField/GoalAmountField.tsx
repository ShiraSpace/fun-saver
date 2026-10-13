import { JSX } from 'react';
import type { GoalEntryErrors } from '../goal-entry';
import { GoalField } from '../GoalField';
import { GOAL_AMOUNT_FIELD_COPY, GOAL_AMOUNT_FIELD_TEST_IDS, GOAL_AMOUNT_ENTRY } from './constants';

interface GoalAmountFieldProps {
  amountShekels: number;
  errors: Pick<GoalEntryErrors, 'amountMissing' | 'amountTooHigh'>;
  onChange: (typed: string) => void;
}

function amountError({
  amountMissing,
  amountTooHigh,
}: GoalAmountFieldProps['errors']): string | undefined {
  if (amountMissing) {
    return GOAL_AMOUNT_FIELD_COPY.missing;
  }

  return amountTooHigh ? GOAL_AMOUNT_FIELD_COPY.tooHigh : undefined;
}

export function GoalAmountField({
  amountShekels,
  errors,
  onChange,
}: GoalAmountFieldProps): JSX.Element {
  const typedAmount = amountShekels ? String(amountShekels) : '';

  return (
    <GoalField
      label={GOAL_AMOUNT_FIELD_COPY.label}
      value={typedAmount}
      onChange={onChange}
      maxLength={GOAL_AMOUNT_ENTRY.maxDigits}
      inputMode="numeric"
      error={amountError(errors)}
      errorTestId={GOAL_AMOUNT_FIELD_TEST_IDS.error}
      data-testid={GOAL_AMOUNT_FIELD_TEST_IDS.input}
    />
  );
}
