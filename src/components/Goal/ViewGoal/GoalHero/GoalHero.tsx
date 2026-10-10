import { JSX } from 'react';
import { agorotToShekels } from '@/lib/money';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { Money } from '@/components/Money';
import { GoalProgressBar } from '../../GoalProgressBar';
import { GOAL_HERO_COPY, GOAL_HERO_TEST_IDS } from '../constants';
import {
  Amount,
  Hero,
  Legend,
  Name,
  Picture,
  Saved,
  SavedSuffix,
  StillToSave,
} from './GoalHero.styles';

interface GoalHeroProps {
  savedTowardGoal: SavedTowardGoal;
}

function stillToSaveText({
  goal,
  stillToSave,
  reached,
}: SavedTowardGoal): string {
  return reached
    ? GOAL_HERO_COPY.canBuy(goal.name, goal.picture.emoji)
    : GOAL_HERO_COPY.stillToSave(agorotToShekels(stillToSave));
}

export function GoalHero({ savedTowardGoal }: GoalHeroProps): JSX.Element {
  const { goal, saved, reached } = savedTowardGoal;

  return (
    <Hero reached={reached} data-testid={GOAL_HERO_TEST_IDS.hero}>
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
          <Money
            amountAgorot={goal.amount}
            testId={GOAL_HERO_TEST_IDS.amount}
          />
        </Amount>
      </Legend>
      <StillToSave
        reached={reached}
        data-testid={GOAL_HERO_TEST_IDS.stillToSave}
      >
        {stillToSaveText(savedTowardGoal)}
      </StillToSave>
    </Hero>
  );
}
