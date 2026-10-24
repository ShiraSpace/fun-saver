'use client';

import { JSX, useState } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import type { GoalRequest } from '@/lib/goal/types';
import { setGoal, type GoalSetRequest } from '@/lib/goal/goal-requests';
import { savingsBalanceOf } from '@/lib/goal/saved-toward-goal';
import { isConflict } from '@/lib/fetch-json';
import { REQUEST_STATE, type RequestState } from '@/lib/request-state';
import { CloseButton } from '@/components/CloseButton';
import { ScreenTitle } from '@/components/ScreenTitle';
import { GoalDialog } from '../GoalDialog';
import { GoalFields } from '../GoalFields';
import { SET_GOAL_COPY, SET_GOAL_TEST_IDS } from './constants';
import { CancelButton } from './SetGoal.styles';

interface SetGoalProps {
  account: AccountSummary;
  onClose: () => void;
  onFinished: () => void;
}

async function setGoalUnlessStale(goalSetRequest: GoalSetRequest): Promise<void> {
  try {
    await setGoal(goalSetRequest);
  } catch (error) {
    if (!isConflict(error)) {
      throw error;
    }
  }
}

export function SetGoal({ account, onClose, onFinished }: SetGoalProps): JSX.Element {
  const [requestState, setRequestState] = useState<RequestState>(REQUEST_STATE.idle);
  const isRequestPending = requestState === REQUEST_STATE.pending;

  const closeSetGoal = (): void => {
    if (!isRequestPending) {
      onClose();
    }
  };

  const submitGoal = async (request: GoalRequest): Promise<void> => {
    await setGoalUnlessStale({ accountId: account.id, request });
    onFinished();
  };

  return (
    <GoalDialog
      title={SET_GOAL_COPY.title}
      onClose={closeSetGoal}
      data-testid={SET_GOAL_TEST_IDS.container}
    >
      <CloseButton onClose={closeSetGoal} disabled={isRequestPending} />
      <ScreenTitle title={SET_GOAL_COPY.title} titleIcon={SET_GOAL_COPY.titleIcon} />
      <GoalFields
        savingsBalance={savingsBalanceOf(account)}
        submitLabel={SET_GOAL_COPY.submit}
        requestState={requestState}
        onSubmit={submitGoal}
        onRequestStateChange={setRequestState}
      />
      <CancelButton
        type="button"
        disabled={isRequestPending}
        data-testid={SET_GOAL_TEST_IDS.cancel}
        onClick={closeSetGoal}
      >
        {SET_GOAL_COPY.cancel}
      </CancelButton>
    </GoalDialog>
  );
}
