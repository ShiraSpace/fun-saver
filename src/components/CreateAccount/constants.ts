export const CREATE_ACCOUNT_TEST_IDS = {
  container: 'create-account',
  title: 'create-account-title',
  submit: 'create-account-submit',
} as const;

export const CREATE_ACCOUNT_COPY = {
  title: 'צור חשבון',
  submit: '✓ יצירת חשבון',
} as const;

export const CREATE_ACCOUNT_PARAM = 'create';

export const CREATE_ACCOUNT_HREF = `/?${CREATE_ACCOUNT_PARAM}=1`;
