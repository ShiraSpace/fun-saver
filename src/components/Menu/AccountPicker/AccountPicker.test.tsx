import { fireEvent, screen } from '@/test-utils/render';
import { openAccountPicker } from '@/test-utils/account-picker';
import {
  mockAccountSummary,
  mockSiblingAccountSummary,
} from '@/test-utils/fixtures';
import { closeAndReopenMenu, renderInOpenMenu } from '@/test-utils/menu';
import { AccountPicker } from './AccountPicker';
import { ACCOUNT_LIST_TEST_IDS } from '../AccountList/constants';
import { ACCOUNT_PICKER_TEST_IDS } from './constants';

const accounts = [mockAccountSummary, mockSiblingAccountSummary];

describe('AccountPicker', () => {
  beforeEach(() => {
    renderInOpenMenu(
      <AccountPicker
        accounts={accounts}
        currentAccount={mockSiblingAccountSummary}
        onSelect={(): void => {}}
      />
    );
  });

  it('keeps the accounts out of sight until the current account is tapped', () => {
    expect(
      screen.queryByTestId(ACCOUNT_LIST_TEST_IDS.list)
    ).not.toBeInTheDocument();
  });

  it('shows the accounts when the current account is tapped', () => {
    openAccountPicker();

    expect(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.list)).toBeInTheDocument();
  });

  it('names the account in view on its button', () => {
    expect(
      screen.getByTestId(ACCOUNT_PICKER_TEST_IDS.trigger)
    ).toHaveTextContent(mockSiblingAccountSummary.name);
  });

  it('puts the accounts away again when the current account is tapped twice', () => {
    openAccountPicker();
    openAccountPicker();

    expect(
      screen.queryByTestId(ACCOUNT_LIST_TEST_IDS.list)
    ).not.toBeInTheDocument();
  });

  describe('with the accounts on show', () => {
    beforeEach(() => {
      openAccountPicker();
    });

    it('puts them away when something outside the picker is tapped', () => {
      fireEvent.mouseDown(document.body);

      expect(
        screen.queryByTestId(ACCOUNT_LIST_TEST_IDS.list)
      ).not.toBeInTheDocument();
    });

    it('puts them away on Escape, even with focus left outside the picker', () => {
      fireEvent.keyDown(document.body, { key: 'Escape' });

      expect(
        screen.queryByTestId(ACCOUNT_LIST_TEST_IDS.list)
      ).not.toBeInTheDocument();
    });

    it('puts them away when the menu closes', () => {
      closeAndReopenMenu();

      expect(
        screen.queryByTestId(ACCOUNT_LIST_TEST_IDS.list)
      ).not.toBeInTheDocument();
    });

    it('leaves them on show when the tap lands inside the picker', () => {
      fireEvent.mouseDown(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.list));

      expect(
        screen.getByTestId(ACCOUNT_LIST_TEST_IDS.list)
      ).toBeInTheDocument();
    });
  });
});
