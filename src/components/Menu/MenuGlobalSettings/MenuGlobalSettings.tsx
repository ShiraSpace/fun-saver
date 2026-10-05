'use client';

import { JSX } from 'react';
import { ViewModeSwitch } from '../ViewModeSwitch';
import {
  SettingsSection,
  SettingsHeading,
  SettingsNote,
} from '../settings-parts';
import {
  MENU_GLOBAL_SETTINGS_COPY,
  MENU_GLOBAL_SETTINGS_TEST_IDS,
} from './constants';

export function MenuGlobalSettings(): JSX.Element {
  return (
    <SettingsSection data-testid={MENU_GLOBAL_SETTINGS_TEST_IDS.block}>
      <SettingsHeading data-testid={MENU_GLOBAL_SETTINGS_TEST_IDS.heading}>
        {MENU_GLOBAL_SETTINGS_COPY.heading}
      </SettingsHeading>
      <SettingsNote>{MENU_GLOBAL_SETTINGS_COPY.note}</SettingsNote>
      <ViewModeSwitch />
    </SettingsSection>
  );
}
