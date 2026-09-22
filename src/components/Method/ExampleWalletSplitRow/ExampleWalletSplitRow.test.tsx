import { render, screen } from '@/test-utils/render';
import { METHOD_COPY } from '../copy';
import { ExampleWalletSplitRow } from './ExampleWalletSplitRow';
import { EXAMPLE_WALLET_SPLIT_ROW_TEST_IDS } from './constants';

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
    const shown = screen
      .getByTestId(EXAMPLE_WALLET_SPLIT_ROW_TEST_IDS.row)
      .querySelectorAll('td');

    expect(shown).toHaveLength(headers.length);
  });

  it('keeps each amount under the period it belongs to, so a week never reads as a year', () => {
    const cells = screen
      .getByTestId(EXAMPLE_WALLET_SPLIT_ROW_TEST_IDS.row)
      .querySelectorAll('td');
    const perPeriod = Array.from(cells)
      .slice(1)
      .map((cell) => cell.textContent);

    expect(perPeriod).toEqual(Array.from(wallet.amounts));
  });
});
