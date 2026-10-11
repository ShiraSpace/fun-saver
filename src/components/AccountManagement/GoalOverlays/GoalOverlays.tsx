'use client';

import { JSX } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import { savedTowardGoalOf } from '@/lib/goal/saved-toward-goal';
import { ViewGoal } from '@/components/Goal/ViewGoal';
import { APP_MODE, type AppMode } from '../app-mode-context';
import { Overlay } from '../AccountManagement.styles';

interface GoalOverlaysProps {
  mode: AppMode;
  currentAccount?: AccountSummary;
  onClose: () => void;
}

export function GoalOverlays({
  mode,
  currentAccount,
  onClose,
}: GoalOverlaysProps): JSX.Element | null {
  if (mode !== APP_MODE.viewingGoal || !currentAccount) {
    return null;
  }

  const savedTowardGoal = savedTowardGoalOf(currentAccount);

  if (!savedTowardGoal) {
    return null;
  }

  return (
    <Overlay>
      <ViewGoal
        accountName={currentAccount.name}
        savedTowardGoal={savedTowardGoal}
        onClose={onClose}
      />
    </Overlay>
  );
}
