import { render, screen } from '@/test-utils/render';
import { MenuAccountSettings } from './MenuAccountSettings';
import { MENU_ACCOUNT_SETTINGS_TEST_IDS } from './constants';
import {
  mockAccountsContext,
  mockSiblingAccountSummary,
} from '@/test-utils/mocks/account.mocks';

describe('MenuAccountSettings', () => {
  beforeEach(() => {
    render(<MenuAccountSettings>{null}</MenuAccountSettings>, {
      accounts: {
        ...mockAccountsContext,
        currentAccount: mockSiblingAccountSummary,
      },
    });
  });

  it('heads the block with the account the settings belong to', () => {
    expect(
      screen.getByTestId(MENU_ACCOUNT_SETTINGS_TEST_IDS.heading)
    ).toHaveTextContent(mockSiblingAccountSummary.name);
  });
});
