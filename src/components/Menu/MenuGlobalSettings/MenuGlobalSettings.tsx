'use client';

import { JSX } from 'react';
import { ViewModeSwitch } from '../ViewModeSwitch';
import {
  ScopedSettingsBlock,
  SettingsHeading,
  SettingsNote,
} from '../settings-parts';
import {
  MENU_GLOBAL_SETTINGS_COPY,
  MENU_GLOBAL_SETTINGS_TEST_IDS,
} from './constants';

export function MenuGlobalSettings(): JSX.Element {
  return (
    <ScopedSettingsBlock data-testid={MENU_GLOBAL_SETTINGS_TEST_IDS.block}>
      <SettingsHeading>{MENU_GLOBAL_SETTINGS_COPY.heading}</SettingsHeading>
      <SettingsNote>{MENU_GLOBAL_SETTINGS_COPY.note}</SettingsNote>
      <ViewModeSwitch />
    </ScopedSettingsBlock>
  );
}
