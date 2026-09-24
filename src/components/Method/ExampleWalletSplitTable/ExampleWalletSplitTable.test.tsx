import { render, screen } from '@/test-utils/render';
import { METHOD_COPY } from '../copy';
import { EXAMPLE_WALLET_SPLIT_ROW_TEST_IDS } from '../ExampleWalletSplitRow/constants';
import { ExampleWalletSplitTable } from './ExampleWalletSplitTable';
import { EXAMPLE_WALLET_SPLIT_TABLE_TEST_IDS } from './constants';

describe('the worked example of a week of allowance', () => {
  const { example } = METHOD_COPY.setup;

  beforeEach(() => {
    render(<ExampleWalletSplitTable {...example} />);
  });

  it('accounts for every pot the page splits the money into, leaving no share unexplained', () => {
    expect(
      screen.getAllByTestId(EXAMPLE_WALLET_SPLIT_ROW_TEST_IDS.row)
    ).toHaveLength(METHOD_COPY.wallets.pots.length);
  });

  it('states the weekly sum and the age it assumes, so ₪15 is not read as a recommendation', () => {
    expect(
      screen.getByTestId(EXAMPLE_WALLET_SPLIT_TABLE_TEST_IDS.caption)
    ).toHaveTextContent(example.title);
  });
});
