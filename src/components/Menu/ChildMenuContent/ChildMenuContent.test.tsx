import { fireEvent, render, screen } from '@/test-utils/render';
import { mockUser } from '@/test-utils/mocks/user.mocks';
import {
  mockAccountSummary,
  mockChildAccountsContext,
} from '@/test-utils/mocks/account.mocks';
import { WithMenu } from '@/test-utils/menu';
import { HOME_ROUTE } from '@/components/Home/constants';
import { APP_VIEW_MODE } from '@/lib/account/view-mode';
import { APPEARANCE_SECTION_TEST_IDS } from '../AppearanceSection/constants';
import {
  VIEW_MODE_SWITCH_COPY,
  VIEW_MODE_SWITCH_TEST_IDS,
} from '../ViewModeSwitch/constants';
import { ChildMenuContent } from './ChildMenuContent';
import { CHILD_MENU_CONTENT_TEST_IDS } from './constants';

describe('ChildMenuContent', () => {
  const mockCloseMenu = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <WithMenu closeMenu={mockCloseMenu}>
        <ChildMenuContent />
      </WithMenu>,
      { user: mockUser, accounts: mockChildAccountsContext }
    );
  });

  it('greets the child by name', () => {
    expect(
      screen.getByTestId(CHILD_MENU_CONTENT_TEST_IDS.menu)
    ).toHaveTextContent(mockAccountSummary.name);
  });

  it('takes the child home', () => {
    expect(
      screen.getByTestId(CHILD_MENU_CONTENT_TEST_IDS.home)
    ).toHaveAttribute('href', HOME_ROUTE);
  });

  it('lets the child pick colours', () => {
    expect(
      screen.getByTestId(APPEARANCE_SECTION_TEST_IDS.section)
    ).toBeInTheDocument();
  });

  it('offers the parent the way back', () => {
    expect(
      screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch)
    ).toHaveTextContent(VIEW_MODE_SWITCH_COPY.label[APP_VIEW_MODE.parent]);
  });

  describe('the child goes home', () => {
    beforeEach(() => {
      fireEvent.click(screen.getByTestId(CHILD_MENU_CONTENT_TEST_IDS.home));
    });

    it('closes the menu on the way', () => {
      expect(mockCloseMenu).toHaveBeenCalledTimes(1);
    });
  });
});
