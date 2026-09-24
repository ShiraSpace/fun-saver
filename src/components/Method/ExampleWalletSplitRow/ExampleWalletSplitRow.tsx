import { JSX } from 'react';
import type { ExampleRow } from '../copy';
import {
  EXAMPLE_WALLET_SPLIT_ROW_COPY,
  EXAMPLE_WALLET_SPLIT_ROW_TEST_IDS,
} from './constants';

export function ExampleWalletSplitRow({
  walletName,
  amounts,
}: ExampleRow): JSX.Element {
  const walletShare = EXAMPLE_WALLET_SPLIT_ROW_COPY.walletShare(walletName);
  const perPeriod = amounts.map((amount, period) => (
    <td key={period}>{amount}</td>
  ));

  return (
    <tr data-testid={EXAMPLE_WALLET_SPLIT_ROW_TEST_IDS.row}>
      <td data-testid={EXAMPLE_WALLET_SPLIT_ROW_TEST_IDS.wallet}>
        {walletShare}
      </td>
      {perPeriod}
    </tr>
  );
}
