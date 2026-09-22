import { JSX } from 'react';
import type { ExampleTable, MethodBlock } from '../copy';
import { ExampleWalletSplitRow } from '../ExampleWalletSplitRow';
import { MethodBlocks } from '../MethodBlocks';
import { emphasize } from '../rich-text';
import { EXAMPLE_WALLET_SPLIT_TABLE_TEST_IDS } from './constants';
import { Caption, Scroller, Table } from './ExampleWalletSplitTable.styles';

interface ExampleWalletSplitTableProps {
  title: string;
  table: ExampleTable;
  note: MethodBlock;
}

export function ExampleWalletSplitTable({
  title,
  table,
  note,
}: ExampleWalletSplitTableProps): JSX.Element {
  const heading = emphasize(title);
  const periods = table.headers.map((header) => (
    <th key={header} scope="col">
      {header}
    </th>
  ));
  const walletRows = table.rows.map((row) => (
    <ExampleWalletSplitRow key={row.wallet} {...row} />
  ));

  return (
    <>
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
      <MethodBlocks blocks={[note]} />
    </>
  );
}
