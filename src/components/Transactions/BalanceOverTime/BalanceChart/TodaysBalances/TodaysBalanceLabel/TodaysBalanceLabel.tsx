'use client';

import { JSX } from 'react';
import { useTheme } from '@emotion/react';
import { agorotToWholeShekels } from '@/lib/money';
import { MONEY_COPY } from '@/components/Money/constants';
import { shownBalanceLabel } from '../../../constants';
import type { PlacedTodaysBalance } from '../../chart-geometry';
import { shownBalanceColor } from '../../chart-parts';
import { ANCHOR_RIGHTWARD, TODAY_X } from '../../constants';
import {
  LABEL_OFFSET,
  SWATCH,
  TODAYS_BALANCE_LABEL_TEST_IDS,
} from './constants';
import { LabelText } from './TodaysBalanceLabel.styles';

export function TodaysBalanceLabel({
  shownBalance,
  todaysBalance,
  y,
}: PlacedTodaysBalance): JSX.Element {
  const theme = useTheme();

  return (
    <g data-testid={TODAYS_BALANCE_LABEL_TEST_IDS.label}>
      <rect
        x={TODAY_X + SWATCH.x}
        y={y - SWATCH.size / 2}
        width={SWATCH.size}
        height={SWATCH.size}
        rx={SWATCH.cornerRadius}
        fill={shownBalanceColor(theme.colors, shownBalance)}
      />
      <LabelText
        x={TODAY_X + LABEL_OFFSET.x}
        y={y + LABEL_OFFSET.y}
        textAnchor={ANCHOR_RIGHTWARD}
      >
        {shownBalanceLabel(shownBalance)} {MONEY_COPY.currencySign}
        {agorotToWholeShekels(todaysBalance)}
      </LabelText>
    </g>
  );
}
