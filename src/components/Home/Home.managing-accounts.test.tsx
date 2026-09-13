import { screen, waitFor } from '@/test-utils/render';
import { HEADER_TEST_IDS } from '@/components/Header/constants';
import { CREATE_ACCOUNT_TEST_IDS } from '@/components/CreateAccount/constants';
import { EDIT_ACCOUNT_TEST_IDS } from '@/components/EditAccount/constants';
import { cancelForm, nameInput } from '@/test-utils/account-form';
import { mockAccount } from '@/test-utils/fixtures';
import {
  createdAccount,
  openMenu,
  renamedAccount,
  renderHome,
  submitCreateForm,
  submitEditForm,
  tapAddChip,
  tapEditChip,
} from './home-test-helpers';

const mockRefresh = jest.fn();
const mockPush = jest.fn();
const mockPersist = jest.fn();
const mockCreateAccount = jest.fn();
const mockUpdateAccount = jest.fn();

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

jest.mock('../EditAccount/use-update-account', () => ({
  useUpdateAccount: (): { updateAccount: jest.Mock } => ({
    updateAccount: mockUpdateAccount,
  }),
}));

describe('Home — managing accounts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateAccount.mockResolvedValue(createdAccount);
    mockUpdateAccount.mockResolvedValue(renamedAccount);
  });

  describe('creating an account from the menu', () => {
    beforeEach(() => {
      renderHome();
      openMenu();
      tapAddChip();
    });

    it('opens the create overlay over the still-mounted account view', () => {
      expect(
        screen.getByTestId(CREATE_ACCOUNT_TEST_IDS.container)
      ).toBeInTheDocument();
      expect(screen.getByTestId(HEADER_TEST_IDS.bar)).toBeInTheDocument();
    });

    it('closes the overlay without creating when cancelled', () => {
      cancelForm();

      expect(
        screen.queryByTestId(CREATE_ACCOUNT_TEST_IDS.container)
      ).not.toBeInTheDocument();
      expect(mockPersist).not.toHaveBeenCalled();
    });

    it('selects the new account, persists it and refreshes on submit', async () => {
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
  });

  describe('editing an account from the menu', () => {
    beforeEach(() => {
      renderHome();
      openMenu();
      tapEditChip();
    });

    it('opens the edit overlay', () => {
      expect(
        screen.getByTestId(EDIT_ACCOUNT_TEST_IDS.container)
      ).toBeInTheDocument();
    });

    it('opens it on the account currently selected', () => {
      expect(nameInput()).toHaveValue(mockAccount.name);
    });

    it('leaves the create overlay closed', () => {
      expect(
        screen.queryByTestId(CREATE_ACCOUNT_TEST_IDS.container)
      ).not.toBeInTheDocument();
    });

    it('closes the overlay when cancelled', () => {
      cancelForm();

      expect(
        screen.queryByTestId(EDIT_ACCOUNT_TEST_IDS.container)
      ).not.toBeInTheDocument();
    });

    it('saves nothing when cancelled', () => {
      cancelForm();

      expect(mockUpdateAccount).not.toHaveBeenCalled();
    });

    it('saves the edit against the selected account', () => {
      submitEditForm();

      expect(mockUpdateAccount).toHaveBeenCalledWith(mockAccount.id, {
        name: renamedAccount.name,
        avatarId: mockAccount.avatarId,
      });
    });

    it('refreshes so the saved name reaches the server components', async () => {
      submitEditForm();

      await waitFor(() => expect(mockRefresh).toHaveBeenCalled());
    });

    it('closes the overlay once the save lands', async () => {
      submitEditForm();

      await waitFor(() =>
        expect(
          screen.queryByTestId(EDIT_ACCOUNT_TEST_IDS.container)
        ).not.toBeInTheDocument()
      );
    });
  });

  describe('editing while the selected id is stale', () => {
    beforeEach(() => {
      renderHome({ initialAccountId: 'gone-from-this-list' });
      openMenu();
      tapEditChip();
    });

    it('edits the account the header is showing rather than nothing', () => {
      expect(
        screen.getByTestId(EDIT_ACCOUNT_TEST_IDS.container)
      ).toBeInTheDocument();
      expect(nameInput()).toHaveValue(mockAccount.name);
    });
  });
});
