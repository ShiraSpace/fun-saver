import { JSX } from 'react';
import type { IconLine } from '../copy';
import { emphasize } from '../rich-text';
import { GOAL_OUTCOME_TEST_IDS } from './constants';
import { Icon, Note, Outcome, Text } from './GoalOutcome.styles';

export function GoalOutcome({ icon, body, note }: IconLine): JSX.Element {
  const maybeNote = note && (
    <Note data-testid={GOAL_OUTCOME_TEST_IDS.note}>{note}</Note>
  );

  return (
    <Outcome data-testid={GOAL_OUTCOME_TEST_IDS.outcome}>
      <Icon>{icon}</Icon>
      <Text>
        {emphasize(body)}
        {maybeNote}
      </Text>
    </Outcome>
  );
}
