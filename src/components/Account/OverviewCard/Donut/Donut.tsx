'use client';

import { JSX } from 'react';
import { useTheme } from '@emotion/react';
import type { WalletName } from '@/lib/types';
import { PERCENT_TOTAL } from '@/lib/constants';
import {
  DONUT_ANIMATION,
  DONUT_CIRCUMFERENCE,
  DONUT_STYLE,
  OVERVIEW_CARD_TEST_IDS,
  WALLET_ARC_COLOR,
} from '../constants';
import { ArcCircle, Svg } from './Donut.styles';

export interface DonutSegment {
  name: WalletName;
  share: number;
}

interface DonutProps {
  segments: DonutSegment[];
}

interface Arc extends DonutSegment {
  length: number;
  offset: number;
  durationMs: number;
  delayMs: number;
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function toArcs(segments: DonutSegment[]): Arc[] {
  const portions = segments.map((segment) => segment.share / PERCENT_TOTAL);

  return segments.map((segment, index) => {
    const portionBefore = sum(portions.slice(0, index));

    return {
      ...segment,
      length: portions[index] * DONUT_CIRCUMFERENCE,
      offset: -portionBefore * DONUT_CIRCUMFERENCE,
      durationMs: portions[index] * DONUT_ANIMATION.sweepMs,
      delayMs: portionBefore * DONUT_ANIMATION.sweepMs,
    };
  });
}

export function Donut({ segments }: DonutProps): JSX.Element {
  const theme = useTheme();
  const arcs = toArcs(segments).map((arc) => (
    <ArcCircle
      key={arc.name}
      data-testid={OVERVIEW_CARD_TEST_IDS.arc}
      cx={DONUT_STYLE.center}
      cy={DONUT_STYLE.center}
      r={DONUT_STYLE.radius}
      stroke={theme.colors[WALLET_ARC_COLOR[arc.name]]}
      strokeDasharray={`${arc.length} ${DONUT_CIRCUMFERENCE - arc.length}`}
      strokeDashoffset={arc.offset}
      durationMs={arc.durationMs}
      delayMs={arc.delayMs}
    />
  ));

  return (
    <Svg
      width={DONUT_STYLE.size}
      height={DONUT_STYLE.size}
      viewBox={`0 0 ${DONUT_STYLE.viewBox} ${DONUT_STYLE.viewBox}`}
      data-testid={OVERVIEW_CARD_TEST_IDS.donut}
    >
      <circle
        cx={DONUT_STYLE.center}
        cy={DONUT_STYLE.center}
        r={DONUT_STYLE.radius}
        stroke={theme.colors.walletTrack}
      />
      {arcs}
    </Svg>
  );
}
