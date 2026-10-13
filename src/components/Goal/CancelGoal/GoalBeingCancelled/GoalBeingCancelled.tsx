import { JSX } from 'react';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { Money } from '@/components/Money';
import { GOAL_BEING_CANCELLED_COPY, GOAL_BEING_CANCELLED_TEST_IDS } from './constants';
import { Line, Picture, Title } from './GoalBeingCancelled.styles';

interface GoalBeingCancelledProps {
  savedTowardGoal: SavedTowardGoal;
  titleId: string;
  descriptionId: string;
}

export function GoalBeingCancelled({
  savedTowardGoal,
  titleId,
  descriptionId,
}: GoalBeingCancelledProps): JSX.Element {
  const { goal, saved, reached } = savedTowardGoal;
  const title = GOAL_BEING_CANCELLED_COPY.title(goal.name);
  const savedSoFarLine = (
    <>
      {GOAL_BEING_CANCELLED_COPY.savedSoFar}{' '}
      <Money amountAgorot={saved} testId={GOAL_BEING_CANCELLED_TEST_IDS.saved} />{' '}
      {GOAL_BEING_CANCELLED_COPY.outOf}{' '}
      <Money amountAgorot={goal.amount} testId={GOAL_BEING_CANCELLED_TEST_IDS.amount} />
      {GOAL_BEING_CANCELLED_COPY.sentenceEnd}
    </>
  );
  const whereTheMoneyGoes = reached
    ? GOAL_BEING_CANCELLED_COPY.moneyStays
    : GOAL_BEING_CANCELLED_COPY.moneyStaysAndSavingsOpens;

  return (
    <>
      <Picture aria-hidden="true">{goal.picture.emoji}</Picture>
      <Title id={titleId} data-testid={GOAL_BEING_CANCELLED_TEST_IDS.title}>
        {title}
      </Title>
      <div id={descriptionId}>
        <Line>{savedSoFarLine}</Line>
        <Line data-testid={GOAL_BEING_CANCELLED_TEST_IDS.moneyStays}>{whereTheMoneyGoes}</Line>
      </div>
    </>
  );
}
