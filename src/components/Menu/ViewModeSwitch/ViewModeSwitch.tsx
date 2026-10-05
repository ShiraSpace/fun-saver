'use client';

import { JSX } from 'react';
import { VIEW_MODE, type ViewMode } from '@/lib/account/view-mode';
import { useViewModeSwitch } from './use-view-mode-switch';
import { VIEW_MODE_SWITCH_COPY, VIEW_MODE_SWITCH_TEST_IDS } from './constants';
import { Icon, Label, Note, Row, Track } from './ViewModeSwitch.styles';

interface ViewModeSwitchProps {
  viewMode: ViewMode;
}

export function ViewModeSwitch({ viewMode }: ViewModeSwitchProps): JSX.Element {
  const { shownViewMode, switchViewMode } = useViewModeSwitch();
  const isOn = shownViewMode === viewMode;
  const isCompact = viewMode === VIEW_MODE.parent;
  const icon = VIEW_MODE_SWITCH_COPY.icon[viewMode];
  const label = VIEW_MODE_SWITCH_COPY.label[viewMode];
  const childNote = viewMode === VIEW_MODE.child && (
    <Note>{VIEW_MODE_SWITCH_COPY.childNote}</Note>
  );
  const switchToThisViewMode = (): void => switchViewMode(viewMode);

  return (
    <Row
      type="button"
      role="switch"
      aria-checked={isOn}
      data-compact={isCompact}
      data-testid={VIEW_MODE_SWITCH_TEST_IDS.switch}
      onClick={switchToThisViewMode}
    >
      <Icon aria-hidden>{icon}</Icon>
      <Label>
        {label}
        {childNote}
      </Label>
      <Track data-on={isOn} />
    </Row>
  );
}
