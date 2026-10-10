import { fireEvent, render, screen } from '@/test-utils/render';
import { mockUser } from '@/test-utils/mocks/user.mocks';
import {
  createMockAccountsContext,
  mockAccountSummary,
  mockAccountsContext,
  mockSiblingAccountSummary,
} from '@/test-utils/mocks/account.mocks';
import { WithMenu } from '@/test-utils/menu';
import { HOME_ROUTE } from '@/components/Home/constants';
import { VIEW_MODE } from '@/lib/view-mode';
import { APPEARANCE_SECTION_TEST_IDS } from '../AppearanceSection/constants';
import { CHILD_MENU_ACCOUNT_LIST_TEST_IDS } from '../ChildMenuAccountList/constants';
import { VIEW_MODE_SWITCH_TEST_IDS } from '../ViewModeSwitch/constants';
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
      {
        user: mockUser,
        accounts: mockAccountsContext,
        viewMode: VIEW_MODE.child,
      }
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

  it('ends with the parent/child switch, for the parent to take back', () => {
    expect(
      screen.getByTestId(CHILD_MENU_CONTENT_TEST_IDS.menu).lastElementChild
    ).toContainElement(screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch));
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

describe('ChildMenuContent with siblings', () => {
  const mockOtherSibling = {
    ...mockSiblingAccountSummary,
    id: 'a3',
    name: 'יואב',
  };
  const mockSwitchAccount = jest.fn();
  const mockCloseMenu = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <WithMenu closeMenu={mockCloseMenu}>
        <ChildMenuContent />
      </WithMenu>,
      {
        user: mockUser,
        viewMode: VIEW_MODE.child,
        accounts: createMockAccountsContext({
          accounts: [
            mockAccountSummary,
            mockSiblingAccountSummary,
            mockOtherSibling,
          ],
          switchAccount: mockSwitchAccount,
        }),
      }
    );
  });

  it('lists every sibling', () => {
    const names = screen
      .getAllByTestId(CHILD_MENU_ACCOUNT_LIST_TEST_IDS.name)
      .map((name) => name.textContent);

    expect(names).toEqual([
      mockSiblingAccountSummary.name,
      mockOtherSibling.name,
    ]);
  });

  describe('the child taps a sibling', () => {
    beforeEach(() => {
      fireEvent.click(
        screen.getAllByTestId(CHILD_MENU_ACCOUNT_LIST_TEST_IDS.row)[0]
      );
    });

    it("switches to the sibling's account", () => {
      expect(mockSwitchAccount).toHaveBeenCalledWith(
        mockSiblingAccountSummary.id
      );
    });

    it('closes the menu', () => {
      expect(mockCloseMenu).toHaveBeenCalledTimes(1);
    });
  });
});

describe('ChildMenuContent for an only child', () => {
  beforeEach(() => {
    render(
      <WithMenu>
        <ChildMenuContent />
      </WithMenu>,
      {
        user: mockUser,
        viewMode: VIEW_MODE.child,
        accounts: createMockAccountsContext({ accounts: [mockAccountSummary] }),
      }
    );
  });

  it('shows no switch card', () => {
    expect(
      screen.queryByTestId(CHILD_MENU_ACCOUNT_LIST_TEST_IDS.list)
    ).not.toBeInTheDocument();
  });
});
