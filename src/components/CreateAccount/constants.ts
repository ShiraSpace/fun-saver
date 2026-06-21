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

export const CREATE_ACCOUNT_FIELD = {
  radius: 14,
  paddingY: 12,
  paddingX: 14,
  gap: 6,
  maxWidth: 340,
  shadow: '0 4px 0 rgba(0, 0, 0, 0.06)',
} as const;

export const CREATE_ACCOUNT_PARAM = 'create';

export const CREATE_ACCOUNT_HREF = `/?${CREATE_ACCOUNT_PARAM}=1`;
