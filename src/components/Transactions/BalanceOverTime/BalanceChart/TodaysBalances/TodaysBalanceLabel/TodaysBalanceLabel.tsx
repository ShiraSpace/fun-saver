'use client';

import { JSX } from 'react';
import { useTheme } from '@emotion/react';
import { agorotToWholeShekels } from '@/lib/money';
import { MONEY_COPY } from '@/components/Money/constants';
import { shownBalanceLabel } from '../../../constants';
import type { PlacedTodaysBalance } from '../../chart-geometry';
import { shownBalanceColor } from '../../chart-parts';
import { ANCHOR_RIGHTWARD } from '../../constants';
import {
  LABEL_OFFSET,
  LABEL_X,
  SWATCH,
  SWATCH_X,
  TODAYS_BALANCE_LABEL_TEST_IDS,
} from './constants';
import { LabelText } from './TodaysBalanceLabel.styles';

export function TodaysBalanceLabel({
  shownBalance,
  todaysBalance,
  y,
}: PlacedTodaysBalance): JSX.Element {
  const theme = useTheme();
  const swatchY = y - SWATCH.size / 2;
  const swatchColor = shownBalanceColor(theme.colors, shownBalance);
  const labelY = y + LABEL_OFFSET.y;
  const labelText = `${shownBalanceLabel(shownBalance)} ${MONEY_COPY.currencySign}${agorotToWholeShekels(todaysBalance)}`;

  return (
    <g data-testid={TODAYS_BALANCE_LABEL_TEST_IDS.label}>
      <rect
        x={SWATCH_X}
        y={swatchY}
        width={SWATCH.size}
        height={SWATCH.size}
        rx={SWATCH.cornerRadius}
        fill={swatchColor}
      />
      <LabelText x={LABEL_X} y={labelY} textAnchor={ANCHOR_RIGHTWARD}>
        {labelText}
      </LabelText>
    </g>
  );
}
