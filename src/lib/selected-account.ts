export function selectedAccount<Account extends { id: string }>(
  accounts: Account[],
  selectedAccountId: string
): Account | undefined {
  return (
    accounts.find((account) => account.id === selectedAccountId) ?? accounts[0]
  );
}
