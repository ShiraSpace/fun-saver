import { JSX } from 'react';
import type { IconLine } from '../copy';
import { emphasize } from '../rich-text';
import { GOAL_OUTCOME_TEST_IDS } from './constants';
import { Icon, Note, Outcome, Text } from './GoalOutcome.styles';

export function GoalOutcome({ icon, body, note }: IconLine): JSX.Element {
  const emphasizedBody = emphasize(body);
  const noteLine = note && (
    <Note data-testid={GOAL_OUTCOME_TEST_IDS.note}>{emphasize(note)}</Note>
  );

  return (
    <Outcome data-testid={GOAL_OUTCOME_TEST_IDS.outcome}>
      <Icon aria-hidden="true">{icon}</Icon>
      <Text>
        {emphasizedBody}
        {noteLine}
      </Text>
    </Outcome>
  );
}
