import { VIEW_MODE, type ViewMode } from '@/lib/account/view-mode';

export const VIEW_MODE_SWITCH_TEST_IDS = {
  switch: 'menu-view-mode-switch',
} as const;

export const VIEW_MODE_SWITCH_COPY = {
  label: 'מצב הורה/ילד',
  knobFace: {
    [VIEW_MODE.child]: '🧒🏼',
    [VIEW_MODE.parent]: '👵🏼',
  } satisfies Record<ViewMode, string>,
} as const;

export const VIEW_MODE_SWITCH_MOTION = {
  slideMs: 220,
} as const;
