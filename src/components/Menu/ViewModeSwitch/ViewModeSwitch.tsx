'use client';

import { JSX } from 'react';
import { VIEW_MODE } from '@/lib/account/view-mode';
import { useViewModeSwitch } from './use-view-mode-switch';
import { VIEW_MODE_SWITCH_COPY, VIEW_MODE_SWITCH_TEST_IDS } from './constants';
import { Knob, Row, Track } from './ViewModeSwitch.styles';

export function ViewModeSwitch(): JSX.Element {
  const { shownViewMode, isSwitching, switchViewMode } = useViewModeSwitch();
  const isChildMode = shownViewMode === VIEW_MODE.child;
  const knobFace = VIEW_MODE_SWITCH_COPY.knobFace[shownViewMode];

  return (
    <Row
      type="button"
      role="switch"
      aria-checked={isChildMode}
      disabled={isSwitching}
      data-testid={VIEW_MODE_SWITCH_TEST_IDS.switch}
      onClick={switchViewMode}
    >
      {VIEW_MODE_SWITCH_COPY.label}
      <Track data-on={isChildMode}>
        <Knob aria-hidden>{knobFace}</Knob>
      </Track>
    </Row>
  );
}
