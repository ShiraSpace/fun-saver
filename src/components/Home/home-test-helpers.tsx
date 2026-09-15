import { fireEvent, render, screen } from '@/test-utils/render';
import { MENU_TEST_IDS } from '@/components/Menu/constants';
import { ACCOUNTS_SECTION_TEST_IDS } from '@/components/Menu/AccountsSection/constants';
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

export function tapEditChip(): void {
  fireEvent.click(screen.getByTestId(ACCOUNTS_SECTION_TEST_IDS.editChip));
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
