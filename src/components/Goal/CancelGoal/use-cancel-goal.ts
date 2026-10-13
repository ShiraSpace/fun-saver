'use client';

import { useState } from 'react';
import { fetchJson, isConflict } from '@/lib/fetch-json';
import { REQUEST_STATE, type RequestState } from '@/lib/request-state';
import type { Goal } from '@/lib/goal/types';
import { useReportLoader } from '@/hooks/loader-context';
import type { CancelGoalProps } from './CancelGoal';

interface CancelGoalRequest {
  requestState: RequestState;
  cancelGoal: () => void;
  keep: () => void;
}

function goalUrl({ accountId, id }: Goal): string {
  return `/api/accounts/${accountId}/goals/${id}`;
}

export function useCancelGoal({
  savedTowardGoal,
  onKeep,
  onFinished,
}: CancelGoalProps): CancelGoalRequest {
  const [requestState, setRequestState] = useState<RequestState>(REQUEST_STATE.idle);

  const isPending = requestState === REQUEST_STATE.pending;

  useReportLoader(isPending);

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

  const keep = (): void => {
    if (!isPending) {
      onKeep();
    }
  };

  return { requestState, cancelGoal: (): void => void cancelGoal(), keep };
}
