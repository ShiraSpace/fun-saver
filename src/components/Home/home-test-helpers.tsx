import { fireEvent, render, screen } from '@/test-utils/render';
import { MENU_TEST_IDS } from '@/components/Menu/constants';
import { EDIT_ACCOUNT_BUTTON_TEST_IDS } from '@/components/Menu/EditAccountButton/constants';
import { ACCOUNT_LIST_TEST_IDS } from '@/components/Menu/AccountList/constants';
import {
  pickFirstAvatar,
  submitForm,
  typeName,
} from '@/test-utils/account-form';
import {
  createMockAccount,
  mockAccount,
  mockDerivedWallets,
  mockSecondAccount,
} from '@/test-utils/fixtures';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { Home } from './Home';

export const accounts: AccountWithDerivedWallets[] = [
  { ...mockAccount, wallets: mockDerivedWallets },
  { ...mockSecondAccount, wallets: mockDerivedWallets },
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
  accounts?: AccountWithDerivedWallets[];
  initialAccountId?: string;
}

export function renderHome({
  accounts: accountsProp = accounts,
  initialAccountId = mockAccount.id,
}: RenderHomeParams = {}): void {
  render(<Home accounts={accountsProp} initialAccountId={initialAccountId} />);
}

export function openMenu(): void {
  fireEvent.click(screen.getByTestId(MENU_TEST_IDS.menuButton));
}

export function tapAddRow(): void {
  fireEvent.click(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.addRow));
}

export function tapEditButton(): void {
  fireEvent.click(screen.getByTestId(EDIT_ACCOUNT_BUTTON_TEST_IDS.button));
}

export function submitEditForm(): void {
  typeName(renamedAccount.name);
  submitForm();
}

export function submitCreateForm(): void {
  typeName(createdAccount.name);
  pickFirstAvatar();
  submitForm();
}
