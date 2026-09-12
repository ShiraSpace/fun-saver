'use client';

import { JSX } from 'react';
import type { TransactionMode } from '../constants';
import { MODE_TOGGLE_COPY, MODE_TOGGLE_TEST_IDS } from './constants';
import { Track, Pill, Arrow } from './ModeToggle.styles';

interface ModeToggleProps {
  mode: TransactionMode;
  onChange: (mode: TransactionMode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps): JSX.Element {
  return (
    <Track>
      <Pill
        type="button"
        data-testid={MODE_TOGGLE_TEST_IDS.deposit}
        aria-pressed={mode === 'deposit'}
        active={mode === 'deposit'}
        onClick={(): void => onChange('deposit')}
      >
        {MODE_TOGGLE_COPY.deposit}
        <Arrow tone="in">{MODE_TOGGLE_COPY.depositArrow}</Arrow>
      </Pill>
      <Pill
        type="button"
        data-testid={MODE_TOGGLE_TEST_IDS.withdraw}
        aria-pressed={mode === 'withdraw'}
        active={mode === 'withdraw'}
        onClick={(): void => onChange('withdraw')}
      >
        {MODE_TOGGLE_COPY.withdraw}
        <Arrow tone="out">{MODE_TOGGLE_COPY.withdrawArrow}</Arrow>
      </Pill>
    </Track>
  );
}
