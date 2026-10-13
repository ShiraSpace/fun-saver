import { JSX } from 'react';
import { MAX_GOAL_NAME_LENGTH } from '@/lib/goal/constants';
import { GoalField } from '../GoalField';
import { GOAL_NAME_FIELD_COPY, GOAL_NAME_FIELD_TEST_IDS } from './constants';

interface GoalNameFieldProps {
  goalName: string;
  missing: boolean;
  onChange: (goalName: string) => void;
}

export function GoalNameField({ goalName, missing, onChange }: GoalNameFieldProps): JSX.Element {
  return (
    <GoalField
      label={GOAL_NAME_FIELD_COPY.label}
      value={goalName}
      onChange={onChange}
      maxLength={MAX_GOAL_NAME_LENGTH}
      error={missing ? GOAL_NAME_FIELD_COPY.missing : undefined}
      errorTestId={GOAL_NAME_FIELD_TEST_IDS.error}
      data-testid={GOAL_NAME_FIELD_TEST_IDS.input}
    />
  );
}
