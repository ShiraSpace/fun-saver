export function findCurrentAccount<Account extends { id: string }>(
  accounts: Account[],
  currentAccountId: string
): Account | undefined {
  return (
    accounts.find((account) => account.id === currentAccountId) ?? accounts[0]
  );
}

export function otherAccounts<Account extends { id: string }>(
  accounts: Account[],
  currentAccount: Account
): Account[] {
  return accounts.filter((account) => account.id !== currentAccount.id);
}
