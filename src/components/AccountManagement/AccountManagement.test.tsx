import { render, screen } from '@/test-utils/render';
import { mockDerivedAccount } from '@/test-utils/fixtures';
import type { AccountNavigation } from '@/hooks/use-account-navigation';
import { CREATE_ACCOUNT_TEST_IDS } from '@/components/CreateAccount/constants';
import { EDIT_ACCOUNT_TEST_IDS } from '@/components/EditAccount/constants';
import { NAME_FIELD_TEST_IDS } from '@/components/AccountForm/NameField/constants';
import { THEME_COOKIE } from '@/lib/cookies';
import { DEFAULT_THEME_ID, THEME_ID, type ThemeId } from '@/theme/registry';
import { AccountManagement } from './AccountManagement';
import { APP_MODE } from './app-mode-context';

const CHILD_TEST_ID = 'managed-screen';

function renderManagement(
  overrides: Partial<AccountNavigation> = {},
  themeId: ThemeId = DEFAULT_THEME_ID
): void {
  const navigation: AccountNavigation = {
    mode: APP_MODE.viewing,
    setMode: () => {},
    currentAccount: mockDerivedAccount,
    selectAccount: () => {},
    showNewAccount: () => {},
    finishEditing: () => {},
    cancel: () => {},
    isCreating: false,
    ...overrides,
  };

  render(
    <AccountManagement navigation={navigation}>
      <span data-testid={CHILD_TEST_ID} />
    </AccountManagement>,
    { themeId }
  );
}

describe('AccountManagement', () => {
  describe('while viewing', () => {
    beforeEach(() => {
      renderManagement();
    });

    it('shows the screen it wraps', () => {
      expect(screen.getByTestId(CHILD_TEST_ID)).toBeInTheDocument();
    });

    it('keeps both forms out of the way', () => {
      expect(
        screen.queryByTestId(CREATE_ACCOUNT_TEST_IDS.container)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId(EDIT_ACCOUNT_TEST_IDS.container)
      ).not.toBeInTheDocument();
    });
  });

  describe('while creating an account', () => {
    beforeEach(() => {
      renderManagement({ isCreating: true });
    });

    it('opens the create form', () => {
      expect(
        screen.getByTestId(CREATE_ACCOUNT_TEST_IDS.container)
      ).toBeInTheDocument();
    });

    it('leaves the screen behind it mounted', () => {
      expect(screen.getByTestId(CHILD_TEST_ID)).toBeInTheDocument();
    });
  });

  describe('while editing an account', () => {
    beforeEach(() => {
      renderManagement({ editingAccount: mockDerivedAccount });
    });

    it('opens the edit form', () => {
      expect(
        screen.getByTestId(EDIT_ACCOUNT_TEST_IDS.container)
      ).toBeInTheDocument();
    });

    it('fills it with the account being edited', () => {
      expect(screen.getByTestId(NAME_FIELD_TEST_IDS.input)).toHaveValue(
        mockDerivedAccount.name
      );
    });
  });

  describe('remembering the theme for the next cold load', () => {
    let written: string[];

    beforeEach(() => {
      written = [];
      Object.defineProperty(document, 'cookie', {
        configurable: true,
        set: (value: string) => {
          written.push(value);
        },
      });

      renderManagement({}, THEME_ID.midnightBlue);
    });

    afterEach(() => {
      Reflect.deleteProperty(document, 'cookie');
    });

    it('stores the theme of the account on screen', () => {
      expect(written).toContainEqual(
        expect.stringContaining(`${THEME_COOKIE}=${THEME_ID.midnightBlue}`)
      );
    });
  });
});
