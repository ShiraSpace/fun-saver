import { render, screen } from '@/test-utils/render';
import { MenuAccountScope } from './MenuAccountScope';
import { MENU_ACCOUNT_SCOPE_TEST_IDS } from './constants';
import {
  mockAccountsContext,
  mockSecondDerivedAccount,
} from '@/test-utils/fixtures';

describe('MenuAccountScope', () => {
  beforeEach(() => {
    render(<MenuAccountScope>{null}</MenuAccountScope>, {
      accounts: {
        ...mockAccountsContext,
        currentAccount: mockSecondDerivedAccount,
      },
    });
  });

  it('heads the block with the account the settings belong to', () => {
    expect(
      screen.getByTestId(MENU_ACCOUNT_SCOPE_TEST_IDS.heading)
    ).toHaveTextContent(mockSecondDerivedAccount.name);
  });
});
