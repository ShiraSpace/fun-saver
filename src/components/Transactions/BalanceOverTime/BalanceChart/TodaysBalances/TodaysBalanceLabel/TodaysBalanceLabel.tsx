'use client';

import { JSX } from 'react';
import { useTheme } from '@emotion/react';
import { MONEY_COPY, MONEY_ROUNDING } from '@/components/Money/constants';
import { shekelsText } from '@/components/Money/money-text';
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
  const todaysBalanceText = shekelsText(todaysBalance, MONEY_ROUNDING.floorToTenths);
  const labelText = `${shownBalanceLabel(shownBalance)} ${MONEY_COPY.currencySign}${todaysBalanceText}`;

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
