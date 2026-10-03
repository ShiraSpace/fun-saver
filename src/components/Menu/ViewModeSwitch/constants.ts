import { APP_VIEW_MODE, type AppViewMode } from '@/lib/account/view-mode';

export const VIEW_MODE_SWITCH_TEST_IDS = {
  switch: 'menu-view-mode-switch',
  saveError: 'menu-view-mode-save-error',
} as const;

export const VIEW_MODE_SWITCH_COPY = {
  icon: {
    [APP_VIEW_MODE.child]: '🧒',
    [APP_VIEW_MODE.parent]: '👤',
  } satisfies Record<AppViewMode, string>,
  label: {
    [APP_VIEW_MODE.child]: 'מצב ילד',
    [APP_VIEW_MODE.parent]: 'מצב הורה',
  } satisfies Record<AppViewMode, string>,
  childNote: (accountName: string): string =>
    `מסך פשוט ל${accountName}, רק לצפייה`,
  saveError: 'לא הצלחנו להחליף מסך, נסו שוב',
} as const;
