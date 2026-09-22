import { render, screen } from '@/test-utils/render';
import { METHOD_COPY } from '../copy';
import { ExampleWalletSplitRow } from './ExampleWalletSplitRow';
import { EXAMPLE_WALLET_SPLIT_ROW_TEST_IDS } from './constants';

function columnsFilled(): HTMLTableCellElement[] {
  return Array.from(
    screen
      .getByTestId(EXAMPLE_WALLET_SPLIT_ROW_TEST_IDS.row)
      .querySelectorAll('td')
  );
}

function amountsPerPeriod(): (string | null)[] {
  return columnsFilled()
    .slice(1)
    .map((column) => column.textContent);
}

describe('what one wallet gets out of the weekly allowance', () => {
  const { headers, rows } = METHOD_COPY.actions.example.table;
  const [wallet] = rows;

  beforeEach(() => {
    render(
      <table>
        <tbody>
          <ExampleWalletSplitRow {...wallet} />
        </tbody>
      </table>
    );
  });

  it('gives the wallet an amount for every period the example promises', () => {
    expect(columnsFilled()).toHaveLength(headers.length);
  });

  it('keeps each amount under the period it belongs to, so a week never reads as a year', () => {
    expect(amountsPerPeriod()).toEqual(Array.from(wallet.amounts));
  });
});
