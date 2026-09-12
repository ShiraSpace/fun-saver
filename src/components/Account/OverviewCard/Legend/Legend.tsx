'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import type { WalletName } from '@/lib/types';
import { Money } from '@/components/Money';
import {
  OVERVIEW_CARD_COPY,
  OVERVIEW_CARD_STYLE,
  OVERVIEW_CARD_TEST_IDS,
  WALLET_ARC_COLOR,
} from '../constants';

const List = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${OVERVIEW_CARD_STYLE.legendGap}px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${OVERVIEW_CARD_STYLE.legendRowGap}px;
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 600;
`;

const Dot = styled.span<{ name: WalletName }>`
  flex-shrink: 0;
  width: ${OVERVIEW_CARD_STYLE.dotSize}px;
  height: ${OVERVIEW_CARD_STYLE.dotSize}px;
  border-radius: ${OVERVIEW_CARD_STYLE.dotRadius}px;
  background: ${({ name, theme }): string =>
    theme.colors[WALLET_ARC_COLOR[name]]};
`;

const Share = styled.span`
  font-size: ${OVERVIEW_CARD_STYLE.shareSize}px;
  font-weight: 500;
  color: ${({ theme }): string => theme.colors.textMuted};
`;

const Leader = styled.span`
  flex: 1;
  border-bottom: ${OVERVIEW_CARD_STYLE.leaderWidth}px dotted
    ${({ theme }): string => theme.colors.divider};
  margin-bottom: ${OVERVIEW_CARD_STYLE.leaderOffset}px;
`;

export interface LegendEntry {
  id: string;
  name: WalletName;
  balance: number;
  share: number;
}

interface LegendProps {
  entries: LegendEntry[];
}

export function Legend({ entries }: LegendProps): JSX.Element {
  const rows = entries.map((entry) => (
    <Row key={entry.id} data-testid={OVERVIEW_CARD_TEST_IDS.legendRow}>
      <Dot name={entry.name} />
      {OVERVIEW_CARD_COPY.name[entry.name]}
      <Share data-testid={OVERVIEW_CARD_TEST_IDS.legendShare}>
        {OVERVIEW_CARD_COPY.share(entry.share)}
      </Share>
      <Leader />
      <Money
        amountAgorot={entry.balance}
        testId={OVERVIEW_CARD_TEST_IDS.legendAmount}
      />
    </Row>
  ));

  return <List>{rows}</List>;
}
