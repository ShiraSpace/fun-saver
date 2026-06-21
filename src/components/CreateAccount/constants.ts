export const CREATE_ACCOUNT_TEST_IDS = {
  container: 'create-account',
  title: 'create-account-title',
  nameField: 'account-name-field',
  nameLabel: 'account-name-label',
  nameInput: 'account-name-input',
} as const;

export const CREATE_ACCOUNT_COPY = {
  title: 'צור חשבון',
  nameLabel: 'שם:',
} as const;

export const CREATE_ACCOUNT_PARAM = 'create';

export const CREATE_ACCOUNT_HREF = `/?${CREATE_ACCOUNT_PARAM}=1`;
