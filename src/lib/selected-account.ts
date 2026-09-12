export function selectedAccount<Account extends { id: string }>(
  accounts: Account[],
  selectedAccountId: string
): Account {
  return (
    accounts.find((account) => account.id === selectedAccountId) ?? accounts[0]
  );
}
