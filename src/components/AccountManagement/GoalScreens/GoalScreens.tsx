'use client';

import { JSX } from 'react';
import type { AccountNavigation } from '@/hooks/use-account-navigation';
import { ViewGoal } from '@/components/Goal/ViewGoal';
import { SetGoal } from '@/components/Goal/SetGoal';
import { APP_MODE } from '../app-mode-context';
import { Overlay } from '../overlay-parts';

interface GoalScreensProps {
  navigation: AccountNavigation;
}

export function GoalScreens({ navigation }: GoalScreensProps): JSX.Element {
  const { mode, currentAccount, goalBeingViewed, cancel, finishEditing } = navigation;
  const accountSettingGoal = mode === APP_MODE.settingGoal ? currentAccount : undefined;

  const viewGoalScreen = goalBeingViewed && (
    <Overlay>
      <ViewGoal
        accountName={goalBeingViewed.accountName}
        savedTowardGoal={goalBeingViewed.savedTowardGoal}
        onClose={cancel}
      />
    </Overlay>
  );

  const setGoalScreen = accountSettingGoal && (
    <Overlay>
      <SetGoal account={accountSettingGoal} onClose={cancel} onFinished={finishEditing} />
    </Overlay>
  );

  return (
    <>
      {viewGoalScreen}
      {setGoalScreen}
    </>
  );
}
