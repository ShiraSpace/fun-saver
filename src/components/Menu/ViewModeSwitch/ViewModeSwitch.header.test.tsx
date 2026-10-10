import { fireEvent, render, screen } from '@/test-utils/render';
import {
  mockAccountsContext,
  mockAccountSummary,
} from '@/test-utils/mocks/account.mocks';
import { mockUser } from '@/test-utils/mocks/user.mocks';
import { Header } from '@/components/Header';
import { HEADER_TEST_IDS } from '@/components/Header/constants';
import { HOME_ROUTE } from '@/components/Home/constants';
import { MENU_TEST_IDS } from '../constants';
import { VIEW_MODE_SWITCH_TEST_IDS } from './constants';

describe('ViewModeSwitch in the header menu', () => {
  beforeEach(() => {
    render(
      <Header title={mockAccountSummary.name} account={mockAccountSummary} />,
      { route: HOME_ROUTE, accounts: mockAccountsContext, user: mockUser }
    );
    fireEvent.click(screen.getByTestId(MENU_TEST_IDS.menuButton));
    fireEvent.click(screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch));
  });

  it('runs the header loader while it switches', () => {
    expect(screen.getByTestId(HEADER_TEST_IDS.progress)).toBeInTheDocument();
  });
});
