'use client';

import { JSX } from 'react';
import { useTheme } from '@emotion/react';
import type { WalletName } from '@/lib/types';
import { PERCENT_TOTAL } from '@/lib/constants';
import {
  DONUT_STYLE,
  OVERVIEW_CARD_TEST_IDS,
  WALLET_ARC_COLOR,
} from '../constants';
import { Svg } from './Donut.styles';

const CIRCUMFERENCE = 2 * Math.PI * DONUT_STYLE.radius;

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
}

function toArcs(segments: DonutSegment[]): Arc[] {
  let consumed = 0;

  return segments.map((segment) => {
    const length = (segment.share / PERCENT_TOTAL) * CIRCUMFERENCE;
    const arc = { ...segment, length, offset: -consumed };

    consumed += length;

    return arc;
  });
}

export function Donut({ segments }: DonutProps): JSX.Element {
  const theme = useTheme();
  const arcs = toArcs(segments).map((arc) => (
    <circle
      key={arc.name}
      cx={DONUT_STYLE.center}
      cy={DONUT_STYLE.center}
      r={DONUT_STYLE.radius}
      stroke={theme.colors[WALLET_ARC_COLOR[arc.name]]}
      strokeDasharray={`${arc.length} ${CIRCUMFERENCE - arc.length}`}
      strokeDashoffset={arc.offset}
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
