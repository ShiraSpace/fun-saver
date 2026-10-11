export const VIEW_GOAL_TEST_IDS = {
  container: 'view-goal',
  reachedHeading: 'view-goal-reached-heading',
  back: 'view-goal-back',
} as const;

export const VIEW_GOAL_COPY = {
  titleIcon: '🎯',
  title: (accountName: string): string => `היעד של ${accountName}`,
  reachedHeading: '🎉 הגעת ליעד! 🎉',
  back: 'חזרה',
} as const;
