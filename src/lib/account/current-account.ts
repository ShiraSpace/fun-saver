export function findCurrentAccount<Account extends { id: string }>(
  accounts: Account[],
  currentAccountId: string
): Account | undefined {
  return (
    accounts.find((account) => account.id === currentAccountId) ?? accounts[0]
  );
}
