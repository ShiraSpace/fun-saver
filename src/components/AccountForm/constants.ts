import { SCREEN_LAYOUT } from '@/components/Screen/constants';

export const ACCOUNT_FORM_TEST_IDS = {
  title: 'account-form-title',
  titleIcon: 'account-form-title-icon',
  submit: 'account-form-submit',
  cancel: 'account-form-cancel',
  saveError: 'account-form-save-error',
} as const;

export const ACCOUNT_FORM_LAYOUT = {
  gap: SCREEN_LAYOUT.gap - 2,
  titleGap: 8,
  cancelSize: 40,
  cancelInset: 16,
} as const;

export const ACCOUNT_FORM_COPY = {
  cancel: '✕',
  cancelLabel: 'סגירה',
  saveError: 'לא הצלחנו לשמור את החשבון, נסו שוב',
} as const;
