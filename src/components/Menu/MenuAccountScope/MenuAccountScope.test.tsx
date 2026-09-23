import { render, screen } from '@/test-utils/render';
import { MenuAccountScope } from './MenuAccountScope';
import { MENU_ACCOUNT_SCOPE_TEST_IDS } from './constants';
import { type AccountsContextValue } from '@/components/Home/accounts-context';
import {
  mockDerivedAccount,
  mockSecondDerivedAccount,
} from '@/test-utils/fixtures';

const accountsValue: AccountsContextValue = {
  accounts: [mockDerivedAccount, mockSecondDerivedAccount],
  currentAccount: mockSecondDerivedAccount,
  selectAccount: () => {},
};

describe('MenuAccountScope', () => {
  beforeEach(() => {
    render(<MenuAccountScope>{null}</MenuAccountScope>, {
      accounts: accountsValue,
    });
  });

  it('heads the block with the account the settings belong to', () => {
    expect(
      screen.getByTestId(MENU_ACCOUNT_SCOPE_TEST_IDS.heading)
    ).toHaveTextContent(mockSecondDerivedAccount.name);
  });
});
