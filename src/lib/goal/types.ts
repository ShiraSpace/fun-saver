import type { GOAL_ENDING, GOAL_PICTURE_KIND } from './constants';

export type GoalEnding = (typeof GOAL_ENDING)[keyof typeof GOAL_ENDING];

export interface GoalPicture {
  kind: typeof GOAL_PICTURE_KIND.emoji;
  emoji: string;
}

export interface Goal {
  id: string;
  accountId: string;
  name: string;
  amount: number;
  picture: GoalPicture;
  startedAt: string;
  endedAt?: string;
  ending?: GoalEnding;
}

export interface GoalEndRequest {
  goalId: string;
  accountId: string;
  endedAt: string;
  ending: GoalEnding;
}
