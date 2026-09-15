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

function toArcs(segments: DonutSegment[]): Arc[] {
  let consumed = 0;
  let elapsedMs = 0;

  return segments.map((segment) => {
    const portion = segment.share / PERCENT_TOTAL;
    const length = portion * DONUT_CIRCUMFERENCE;
    const durationMs = portion * DONUT_ANIMATION.sweepMs;
    const arc = {
      ...segment,
      length,
      offset: -consumed,
      durationMs,
      delayMs: elapsedMs,
    };

    consumed += length;
    elapsedMs += durationMs;

    return arc;
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
