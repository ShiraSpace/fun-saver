'use client';

import { JSX } from 'react';
import type { WalletName } from '@/lib/types';
import { Money } from '@/components/Money';
import { OVERVIEW_CARD_COPY, OVERVIEW_CARD_TEST_IDS } from '../constants';
import { Dot, Leader, List, Row, Share } from './Legend.styles';

export interface LegendEntry {
  id: string;
  name: WalletName;
  icon: string;
  balance: number;
  share: number;
}

interface LegendProps {
  entries: LegendEntry[];
}

export function Legend({ entries }: LegendProps): JSX.Element {
  const rows = entries.map((entry, index) => (
    <Row
      key={entry.id}
      rowIndex={index}
      data-testid={OVERVIEW_CARD_TEST_IDS.legendRow}
    >
      <Dot
        walletName={entry.name}
        data-testid={OVERVIEW_CARD_TEST_IDS.legendDot}
      >
        {entry.icon}
      </Dot>
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
