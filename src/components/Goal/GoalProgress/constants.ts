export const GOAL_PROGRESS_TEST_IDS = {
  heading: 'goal-progress-heading',
  picture: 'goal-progress-picture',
} as const;

export const GOAL_PROGRESS_COPY = {
  reached: '🎉 הגעת ליעד!',
} as const;

export const GOAL_PROGRESS_SIZE = {
  small: 'small',
  large: 'large',
} as const;

export type GoalProgressSize = (typeof GOAL_PROGRESS_SIZE)[keyof typeof GOAL_PROGRESS_SIZE];
