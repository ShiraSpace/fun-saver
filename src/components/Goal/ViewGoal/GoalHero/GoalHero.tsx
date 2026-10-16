import { JSX, ReactNode } from 'react';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { Money } from '@/components/Money';
import { GoalProgressBar } from '../../GoalProgressBar';
import { StillToSave } from '../../StillToSave';
import { GOAL_HERO_COPY, GOAL_HERO_TEST_IDS } from './constants';
import {
  Amount,
  Encouragement,
  Hero,
  Legend,
  Name,
  Picture,
  Saved,
  SavedSuffix,
} from './GoalHero.styles';

interface GoalHeroProps {
  savedTowardGoal: SavedTowardGoal;
}

function encouragementFor({ goal, stillToSave, isGoalReached }: SavedTowardGoal): ReactNode {
  return isGoalReached ? (
    GOAL_HERO_COPY.canBuy(goal.name, goal.picture.emoji)
  ) : (
    <StillToSave stillToSave={stillToSave} cheer={GOAL_HERO_COPY.cheer} />
  );
}

export function GoalHero({ savedTowardGoal }: GoalHeroProps): JSX.Element {
  const { goal, saved, isGoalReached } = savedTowardGoal;
  const encouragement = encouragementFor(savedTowardGoal);

  return (
    <Hero isGoalReached={isGoalReached} data-testid={GOAL_HERO_TEST_IDS.hero}>
      <Picture aria-hidden="true" data-testid={GOAL_HERO_TEST_IDS.picture}>
        {goal.picture.emoji}
      </Picture>
      <Name data-testid={GOAL_HERO_TEST_IDS.name}>{goal.name}</Name>
      <GoalProgressBar savedTowardGoal={savedTowardGoal} />
      <Legend>
        <Saved>
          <Money amountAgorot={saved} testId={GOAL_HERO_TEST_IDS.saved} />
          <SavedSuffix>{GOAL_HERO_COPY.savedSuffix}</SavedSuffix>
        </Saved>
        <Amount>
          {GOAL_HERO_COPY.amountPrefix}
          <Money amountAgorot={goal.amount} testId={GOAL_HERO_TEST_IDS.amount} />
        </Amount>
      </Legend>
      <Encouragement isGoalReached={isGoalReached} data-testid={GOAL_HERO_TEST_IDS.encouragement}>
        {encouragement}
      </Encouragement>
    </Hero>
  );
}
