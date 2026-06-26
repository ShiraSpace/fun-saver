import { SCREEN_LAYOUT } from '@/components/Screen/constants';

export const CREATE_ACCOUNT_TEST_IDS = {
  container: 'create-account',
  title: 'create-account-title',
  submit: 'create-account-submit',
  cancel: 'create-account-cancel',
} as const;

export const CREATE_ACCOUNT_LAYOUT = {
  gap: SCREEN_LAYOUT.gap - 2,
  closeButtonSize: 40,
  closeInset: 16,
} as const;

export const CREATE_ACCOUNT_COPY = {
  title: 'צור חשבון',
  submit: '✓ יצירת חשבון',
  cancel: '✕',
  cancelLabel: 'סגירה',
} as const;
