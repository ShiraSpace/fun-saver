import { JSX } from 'react';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { Money } from '@/components/Money';
import { GOAL_BEING_CANCELLED_COPY, GOAL_BEING_CANCELLED_TEST_IDS } from './constants';
import { Line, Picture, Title } from './GoalBeingCancelled.styles';

interface GoalBeingCancelledProps {
  savedTowardGoal: SavedTowardGoal;
  titleId: string;
}

export function GoalBeingCancelled({
  savedTowardGoal,
  titleId,
}: GoalBeingCancelledProps): JSX.Element {
  const { goal, saved, reached } = savedTowardGoal;

  return (
    <>
      <Picture aria-hidden="true">{goal.picture.emoji}</Picture>
      <Title id={titleId} data-testid={GOAL_BEING_CANCELLED_TEST_IDS.title}>
        {GOAL_BEING_CANCELLED_COPY.title(goal.name)}
      </Title>
      <Line>
        {GOAL_BEING_CANCELLED_COPY.savedSoFar}{' '}
        <Money amountAgorot={saved} testId={GOAL_BEING_CANCELLED_TEST_IDS.saved} />{' '}
        {GOAL_BEING_CANCELLED_COPY.outOf}{' '}
        <Money amountAgorot={goal.amount} testId={GOAL_BEING_CANCELLED_TEST_IDS.amount} />
        {GOAL_BEING_CANCELLED_COPY.sentenceEnd}
      </Line>
      <Line data-testid={GOAL_BEING_CANCELLED_TEST_IDS.moneyStays}>
        {reached
          ? GOAL_BEING_CANCELLED_COPY.moneyStays
          : GOAL_BEING_CANCELLED_COPY.moneyStaysAndSavingsOpens}
      </Line>
    </>
  );
}
