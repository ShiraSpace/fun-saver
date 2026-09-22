import { render, screen } from '@/test-utils/render';
import { mockDerivedAccount } from '@/test-utils/fixtures';
import { totalBalance } from '@/lib/derivations';
import { agorotToWholeShekels } from '@/lib/money';
import { AccountTrigger } from './AccountTrigger';
import { ACCOUNT_PICKER_TEST_IDS } from './constants';

describe('AccountTrigger', () => {
  beforeEach(() => {
    render(
      <AccountTrigger
        account={mockDerivedAccount}
        isOpen={false}
        onToggle={(): void => {}}
      />
    );
  });

  it('shows what the account holds in total', () => {
    expect(
      screen.getByTestId(ACCOUNT_PICKER_TEST_IDS.triggerTotal)
    ).toHaveTextContent(
      String(agorotToWholeShekels(totalBalance(mockDerivedAccount.wallets)))
    );
  });
});
