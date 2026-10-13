'use client';

import { JSX } from 'react';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import type { WalletSummary } from '@/lib/wallet/types';
import { WALLET_NAMES } from '@/lib/wallet/constants';
import { GoalProgress } from '@/components/Goal/GoalProgress';
import { APP_MODE, useAppMode } from '@/components/AccountManagement/app-mode-context';
import { GOAL_LINE_COPY, GOAL_LINE_TEST_IDS } from './constants';
import { Line, SetGoalPrompt } from './GoalLine.styles';

interface GoalLineProps {
  wallet: WalletSummary;
  savedTowardGoal?: SavedTowardGoal;
}

export function GoalLine({ wallet, savedTowardGoal }: GoalLineProps): JSX.Element | null {
  const { setMode } = useAppMode();

  const setGoal = (): void => setMode(APP_MODE.settingGoal);
  const viewGoal = (): void => setMode(APP_MODE.viewingGoal);

  if (wallet.name !== WALLET_NAMES.savings) {
    return null;
  }

  if (!savedTowardGoal) {
    return (
      <Line type="button" data-testid={GOAL_LINE_TEST_IDS.setGoal} onClick={setGoal}>
        <SetGoalPrompt>{GOAL_LINE_COPY.setGoal}</SetGoalPrompt>
      </Line>
    );
  }

  return (
    <Line type="button" data-testid={GOAL_LINE_TEST_IDS.line} onClick={viewGoal}>
      <GoalProgress savedTowardGoal={savedTowardGoal} />
    </Line>
  );
}
