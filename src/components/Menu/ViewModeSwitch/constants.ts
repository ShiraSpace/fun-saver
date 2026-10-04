import { VIEW_MODE, type ViewMode } from '@/lib/account/view-mode';

export const VIEW_MODE_SWITCH_TEST_IDS = {
  switch: 'menu-view-mode-switch',
  saveError: 'menu-view-mode-save-error',
} as const;

export const VIEW_MODE_SWITCH_COPY = {
  icon: {
    [VIEW_MODE.child]: '🧒',
    [VIEW_MODE.parent]: '👤',
  } satisfies Record<ViewMode, string>,
  label: {
    [VIEW_MODE.child]: 'מצב ילד',
    [VIEW_MODE.parent]: 'מצב הורה',
  } satisfies Record<ViewMode, string>,
  childNote: (accountName: string): string =>
    `מסך פשוט ל${accountName}, רק לצפייה`,
  saveError: 'לא הצלחנו להחליף מסך, נסו שוב',
} as const;

export const VIEW_MODE_SWITCH_MOTION = {
  slideMs: 220,
} as const;

export const SAVED_VIEW_MODE_SHOWN = {
  immediately: 'immediately',
  whenMenuCloses: 'whenMenuCloses',
} as const;

export type SavedViewModeShown =
  (typeof SAVED_VIEW_MODE_SHOWN)[keyof typeof SAVED_VIEW_MODE_SHOWN];
