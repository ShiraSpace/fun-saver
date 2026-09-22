import { JSX } from 'react';
import type { ExampleTable } from '../copy';
import { ExampleWalletSplitRow } from '../ExampleWalletSplitRow';
import { emphasize } from '../rich-text';
import { EXAMPLE_WALLET_SPLIT_TABLE_TEST_IDS } from './constants';
import { Caption, Scroller, Table } from './ExampleWalletSplitTable.styles';

interface ExampleWalletSplitTableProps extends ExampleTable {
  caption: string;
}

export function ExampleWalletSplitTable({
  caption,
  headers,
  rows,
}: ExampleWalletSplitTableProps): JSX.Element {
  const heading = emphasize(caption);
  const periods = headers.map((header) => (
    <th key={header} scope="col">
      {header}
    </th>
  ));
  const walletRows = rows.map((row) => (
    <ExampleWalletSplitRow key={row.wallet} {...row} />
  ));

  return (
    <Scroller>
      <Table data-testid={EXAMPLE_WALLET_SPLIT_TABLE_TEST_IDS.table}>
        <Caption data-testid={EXAMPLE_WALLET_SPLIT_TABLE_TEST_IDS.caption}>
          {heading}
        </Caption>
        <thead>
          <tr>{periods}</tr>
        </thead>
        <tbody>{walletRows}</tbody>
      </Table>
    </Scroller>
  );
}
