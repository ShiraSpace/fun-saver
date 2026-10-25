'use client';

import { useState } from 'react';
import { isConflict } from '@/lib/fetch-json';
import { cancelGoal } from '@/lib/goal/goal-requests';
import { REQUEST_STATE, type RequestState } from '@/lib/request-state';
import { useReportLoader } from '@/hooks/loader-context';
import type { CancelGoalProps } from './CancelGoal';

export interface GoalCancellation {
  requestState: RequestState;
  cancelGoal: () => void;
  keepGoal: () => void;
}

export function useCancelGoal({
  savedTowardGoal,
  onKeep,
  onFinished,
}: CancelGoalProps): GoalCancellation {
  const [requestState, setRequestState] = useState<RequestState>(REQUEST_STATE.idle);

  const isCancelling = requestState === REQUEST_STATE.pending;

  useReportLoader(isCancelling);

  const submitCancellation = async (): Promise<void> => {
    setRequestState(REQUEST_STATE.pending);

    try {
      await cancelGoal(savedTowardGoal.goal);
      onFinished();
    } catch (error) {
      if (isConflict(error)) {
        onFinished();
        return;
      }

      setRequestState(REQUEST_STATE.failed);
    }
  };

  const keepGoal = (): void => {
    if (!isCancelling) {
      onKeep();
    }
  };

  return {
    requestState,
    cancelGoal: (): void => void submitCancellation(),
    keepGoal,
  };
}
