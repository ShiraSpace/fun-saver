import type { AccountRouteParams } from '../../with-account-access';

export interface GoalRouteParams extends AccountRouteParams {
  goalId: string;
}
