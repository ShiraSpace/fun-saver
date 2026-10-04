import { getStore } from '@/db';
import { GoalNotActiveError } from '@/lib/goal/errors';
import { cancelGoal } from '@/lib/goal/goals';
import { API_ERRORS } from '@/app/api/constants';
import { conflict } from '@/app/api/responses';
import {
  withAccountEditor,
  type AccountRouteParams,
} from '../../with-account-access';

interface GoalRouteParams extends AccountRouteParams {
  goalId: string;
}

export const DELETE = withAccountEditor<GoalRouteParams>(
  async (_request, accountId, { goalId }) => {
    try {
      const cancelledGoal = await cancelGoal({
        store: getStore(),
        accountId,
        goalId,
      });

      return Response.json(cancelledGoal);
    } catch (error) {
      if (error instanceof GoalNotActiveError) {
        return conflict(API_ERRORS.goalNotActive);
      }

      throw error;
    }
  }
);
