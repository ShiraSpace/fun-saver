'use client';

import { JSX } from 'react';
import type { AccountNavigation } from '@/hooks/use-account-navigation';
import { ViewGoal } from '@/components/Goal/ViewGoal';
import { SetGoal } from '@/components/Goal/SetGoal';
import { CancelGoal } from '@/components/Goal/CancelGoal';
import { Overlay } from '../overlay-parts';

interface GoalScreensProps {
  navigation: AccountNavigation;
}

export function GoalScreens({ navigation }: GoalScreensProps): JSX.Element {
  const { accountSettingGoal, goalBeingViewed, goalBeingCancelled, cancel, finishEditing } =
    navigation;

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

  const cancelGoalScreen = goalBeingCancelled && (
    <Overlay>
      <CancelGoal savedTowardGoal={goalBeingCancelled} onKeep={cancel} onFinished={finishEditing} />
    </Overlay>
  );

  return (
    <>
      {viewGoalScreen}
      {setGoalScreen}
      {cancelGoalScreen}
    </>
  );
}
