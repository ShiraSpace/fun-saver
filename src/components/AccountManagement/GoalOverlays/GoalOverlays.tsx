'use client';

import { JSX } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import { savedTowardGoal } from '@/lib/goal/saved-toward-goal';
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

  const viewedGoal = savedTowardGoal(currentAccount);

  if (!viewedGoal) {
    return null;
  }

  return (
    <Overlay>
      <ViewGoal
        accountName={currentAccount.name}
        savedTowardGoal={viewedGoal}
        onClose={onClose}
      />
    </Overlay>
  );
}
