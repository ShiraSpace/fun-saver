import { SCREEN_LAYOUT } from '@/components/Screen/constants';

export const ACCOUNT_FORM_TEST_IDS = {
  title: 'account-form-title',
  titleIcon: 'account-form-title-icon',
  submit: 'account-form-submit',
  cancel: 'account-form-cancel',
} as const;

export const ACCOUNT_FORM_LAYOUT = {
  gap: SCREEN_LAYOUT.gap - 2,
  titleGap: 8,
  closeButtonSize: 40,
  closeInset: 16,
} as const;

export const ACCOUNT_FORM_COPY = {
  cancel: '✕',
  cancelLabel: 'סגירה',
} as const;
