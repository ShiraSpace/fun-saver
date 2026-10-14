'use client';

import { useState } from 'react';
import { fetchJson, isConflict } from '@/lib/fetch-json';
import { REQUEST_STATE, type RequestState } from '@/lib/request-state';
import type { Goal } from '@/lib/goal/types';
import { useReportLoader } from '@/hooks/loader-context';
import type { CancelGoalProps } from './CancelGoal';

export interface GoalCancellation {
  requestState: RequestState;
  cancelGoal: () => void;
  keepGoal: () => void;
}

function goalUrl({ accountId, id }: Goal): string {
  return `/api/accounts/${accountId}/goals/${id}`;
}

export function useCancelGoal({
  savedTowardGoal,
  onKeep,
  onFinished,
}: CancelGoalProps): GoalCancellation {
  const [requestState, setRequestState] = useState<RequestState>(REQUEST_STATE.idle);

  const isCancelling = requestState === REQUEST_STATE.pending;

  useReportLoader(isCancelling);

  const cancelGoal = async (): Promise<void> => {
    setRequestState(REQUEST_STATE.pending);

    try {
      await fetchJson<Goal>({ url: goalUrl(savedTowardGoal.goal), method: 'DELETE' });
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
    cancelGoal: (): void => void cancelGoal(),
    keepGoal,
  };
}
