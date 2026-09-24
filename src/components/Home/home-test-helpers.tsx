import { fireEvent, render, screen } from '@/test-utils/render';
import { MENU_TEST_IDS } from '@/components/Menu/constants';
import { EDIT_ACCOUNT_BUTTON_TEST_IDS } from '@/components/Menu/EditAccountButton/constants';
import { ACCOUNT_LIST_TEST_IDS } from '@/components/Menu/AccountList/constants';
import {
  selectFirstAvatar,
  submitForm,
  fillName,
} from '@/test-utils/account-form';
import {
  createMockAccount,
  mockAccount,
  mockWalletSummaries,
  mockSiblingAccount,
  mockUser,
} from '@/test-utils/fixtures';
import type { AccountSummary } from '@/lib/types';
import { Home } from './Home';

export const accounts: AccountSummary[] = [
  { ...mockAccount, wallets: mockWalletSummaries },
  { ...mockSiblingAccount, wallets: mockWalletSummaries },
];

export const createdAccount = createMockAccount({
  id: 'created-id',
  name: 'דנה',
});
export const renamedAccount = createMockAccount({
  id: mockAccount.id,
  name: 'רוני',
});

interface RenderHomeParams {
  accounts?: AccountSummary[];
  initialAccountId?: string;
}

export function renderHome({
  accounts: accountsProp = accounts,
  initialAccountId = mockAccount.id,
}: RenderHomeParams = {}): void {
  render(<Home accounts={accountsProp} initialAccountId={initialAccountId} />, {
    user: mockUser,
  });
}

export function openMenu(): void {
  fireEvent.click(screen.getByTestId(MENU_TEST_IDS.menuButton));
}

export function tapAddAccount(): void {
  fireEvent.click(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.addAccount));
}

export function tapEditButton(): void {
  fireEvent.click(screen.getByTestId(EDIT_ACCOUNT_BUTTON_TEST_IDS.button));
}

export function submitEditForm(): void {
  fillName(renamedAccount.name);
  submitForm();
}

export function submitCreateForm(): void {
  fillName(createdAccount.name);
  selectFirstAvatar();
  submitForm();
}
