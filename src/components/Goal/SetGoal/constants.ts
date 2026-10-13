export const SET_GOAL_TEST_IDS = {
  container: 'set-goal',
  cancel: 'set-goal-cancel',
} as const;

export const SET_GOAL_COPY = {
  titleIcon: '🎯',
  title: 'יעד חיסכון',
  submit: '✓ קובעים יעד',
  cancel: 'ביטול',
} as const;

export const goalsEndpoint = (accountId: string): string => `/api/accounts/${accountId}/goals`;
