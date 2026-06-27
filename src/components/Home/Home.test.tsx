import { fireEvent, render, screen, waitFor } from '@/test-support/render';
import { Home } from './Home';
import { TITLE_TEST_IDS } from '@/components/Header/CrossfadeTitle/constants';
import { HEADER_TEST_IDS } from '@/components/Header/constants';
import { MENU_TEST_IDS } from '@/components/Menu/constants';
import { MENU_OVERLAY_TEST_IDS } from '@/components/Menu/MenuOverlay/constants';
import { ACCOUNTS_SECTION_TEST_IDS } from '@/components/Menu/AccountsSection/constants';
import { EMPTY_STATE_TEST_IDS } from '@/components/EmptyState/constants';
import { CREATE_ACCOUNT_TEST_IDS } from '@/components/CreateAccount/constants';
import { NAME_FIELD_TEST_IDS } from '@/components/CreateAccount/NameField/constants';
import { AVATAR_PICKER_TEST_IDS } from '@/components/AvatarPicker/constants';
import {
  createMockAccount,
  mockAccount,
  mockDerivedWallets,
  mockSecondAccount,
} from '@/test-support/fixtures';
import type { AccountWithDerivedWallets } from '@/lib/types';

const mockRefresh = jest.fn();
const mockPush = jest.fn();
const mockPersist = jest.fn();
const mockCreateAccount = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: (): { refresh: jest.Mock; push: jest.Mock } => ({
    refresh: mockRefresh,
    push: mockPush,
  }),
}));

jest.mock('./selected-account-cookie', () => ({
  persistSelectedAccount: (accountId: string): void => mockPersist(accountId),
}));

jest.mock('../CreateAccount/use-create-account', () => ({
  useCreateAccount: (): { createAccount: jest.Mock } => ({
    createAccount: mockCreateAccount,
  }),
}));

const accounts: AccountWithDerivedWallets[] = [
  { ...mockAccount, wallets: mockDerivedWallets },
  { ...mockSecondAccount, wallets: mockDerivedWallets },
];

const createdAccount = createMockAccount({ id: 'created-id', name: 'דנה' });

interface RenderHomeParams {
  accounts?: AccountWithDerivedWallets[];
  initialAccountId?: string;
}

function renderHome({
  accounts: accountsProp = accounts,
  initialAccountId = mockAccount.id,
}: RenderHomeParams = {}): void {
  render(<Home accounts={accountsProp} initialAccountId={initialAccountId} />);
}

function openMenu(): void {
  fireEvent.click(screen.getByTestId(MENU_TEST_IDS.menuButton));
}

function tapAddChip(): void {
  fireEvent.click(screen.getByTestId(ACCOUNTS_SECTION_TEST_IDS.addChip));
}

function submitCreateForm(): void {
  fireEvent.change(screen.getByTestId(NAME_FIELD_TEST_IDS.input), {
    target: { value: createdAccount.name },
  });
  fireEvent.click(screen.getAllByTestId(AVATAR_PICKER_TEST_IDS.option)[0]);
  fireEvent.click(screen.getByTestId(CREATE_ACCOUNT_TEST_IDS.submit));
}

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateAccount.mockResolvedValue(createdAccount);
  });

  describe('viewing mode', () => {
    it('renders the account named by initialAccountId', () => {
      renderHome({ initialAccountId: mockSecondAccount.id });

      expect(screen.getByTestId(TITLE_TEST_IDS.title)).toHaveTextContent(
        mockSecondAccount.name
      );
    });

    it('renders the empty state when there are no accounts', () => {
      renderHome({ accounts: [], initialAccountId: '' });

      expect(
        screen.getByTestId(EMPTY_STATE_TEST_IDS.container)
      ).toBeInTheDocument();
    });
  });

  describe('selecting an account', () => {
    beforeEach(() => {
      renderHome();
      openMenu();
    });

    it('switches to and persists the tapped account, then closes the menu', () => {
      fireEvent.click(screen.getAllByTestId(ACCOUNTS_SECTION_TEST_IDS.chip)[1]);

      expect(screen.getByTestId(TITLE_TEST_IDS.title)).toHaveTextContent(
        mockSecondAccount.name
      );
      expect(mockPersist).toHaveBeenCalledWith(mockSecondAccount.id);
      expect(screen.getByTestId(MENU_OVERLAY_TEST_IDS.overlay)).toHaveAttribute(
        'data-open',
        'false'
      );
    });
  });

  describe('creating an account', () => {
    it('opens the create overlay over the still-mounted account view', () => {
      renderHome();
      openMenu();
      tapAddChip();

      expect(
        screen.getByTestId(CREATE_ACCOUNT_TEST_IDS.container)
      ).toBeInTheDocument();
      expect(screen.getByTestId(HEADER_TEST_IDS.bar)).toBeInTheDocument();
    });

    it('closes the overlay without creating when cancelled', () => {
      renderHome();
      openMenu();
      tapAddChip();

      fireEvent.click(screen.getByTestId(CREATE_ACCOUNT_TEST_IDS.cancel));

      expect(
        screen.queryByTestId(CREATE_ACCOUNT_TEST_IDS.container)
      ).not.toBeInTheDocument();
      expect(mockPersist).not.toHaveBeenCalled();
    });

    it('selects the new account, persists it and refreshes on submit', async () => {
      renderHome();
      openMenu();
      tapAddChip();

      submitCreateForm();

      await waitFor(() =>
        expect(mockPersist).toHaveBeenCalledWith(createdAccount.id)
      );
      expect(mockRefresh).toHaveBeenCalled();
      await waitFor(() =>
        expect(
          screen.queryByTestId(CREATE_ACCOUNT_TEST_IDS.container)
        ).not.toBeInTheDocument()
      );
    });

    it('opens the create overlay from the empty-state call to action', () => {
      renderHome({ accounts: [], initialAccountId: '' });

      fireEvent.click(screen.getByTestId(EMPTY_STATE_TEST_IDS.createAccount));
      fireEvent.animationEnd(screen.getByTestId(EMPTY_STATE_TEST_IDS.pig));

      expect(
        screen.getByTestId(CREATE_ACCOUNT_TEST_IDS.container)
      ).toBeInTheDocument();
    });
  });
});
