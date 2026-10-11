import { SCREEN_LAYOUT } from '@/components/Screen/constants';

export const ACCOUNT_FORM_TEST_IDS = {
  submit: 'account-form-submit',
  saveError: 'account-form-save-error',
} as const;

export const ACCOUNT_FORM_LAYOUT = {
  gap: SCREEN_LAYOUT.gap - 2,
} as const;

export const ACCOUNT_FORM_COPY = {
  saveError: 'לא הצלחנו לשמור את החשבון, נסו שוב',
} as const;
