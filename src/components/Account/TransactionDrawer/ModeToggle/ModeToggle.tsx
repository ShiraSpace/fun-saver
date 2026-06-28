'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import type { TransactionMode } from '../constants';
import { MODE_TOGGLE_COPY, MODE_TOGGLE_TEST_IDS } from './constants';

const Track = styled.div`
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  background: ${({ theme }): string => theme.colors.divider};
`;

const Pill = styled.button<{ active: boolean }>`
  flex: 1;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 700;
  padding: 9px 0;
  border-radius: 999px;
  background: ${({ theme, active }): string =>
    active ? theme.colors.surface : 'transparent'};
  color: ${({ theme, active }): string =>
    active ? theme.colors.textStrong : theme.colors.textMuted};
`;

const Arrow = styled.span<{ tone: 'in' | 'out' }>`
  margin-inline-start: 5px;
  font-size: ${({ theme }): number => theme.typography.heading}px;
  font-weight: 800;
  color: ${({ theme, tone }): string =>
    tone === 'in' ? theme.colors.gainText : theme.colors.alert};
`;

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
