import { JSX } from 'react';
import type { ExampleRow } from '../copy';
import {
  EXAMPLE_WALLET_SPLIT_ROW_COPY,
  EXAMPLE_WALLET_SPLIT_ROW_TEST_IDS,
} from './constants';

export function ExampleWalletSplitRow({
  wallet,
  figures,
}: ExampleRow): JSX.Element {
  const cells = figures.map((figure, index) => <td key={index}>{figure}</td>);

  return (
    <tr data-testid={EXAMPLE_WALLET_SPLIT_ROW_TEST_IDS.row}>
      <td data-testid={EXAMPLE_WALLET_SPLIT_ROW_TEST_IDS.wallet}>
        {EXAMPLE_WALLET_SPLIT_ROW_COPY.wallet(wallet)}
      </td>
      {cells}
    </tr>
  );
}
