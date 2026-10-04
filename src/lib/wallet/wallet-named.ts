import type { Wallet, WalletName } from './types';

type NamedWallet<Candidate, Name extends WalletName> = Candidate & {
  name: Name;
};

export function walletNamed<
  Candidate extends Pick<Wallet, 'name'>,
  Name extends WalletName,
>(
  wallets: readonly Candidate[],
  name: Name
): NamedWallet<Candidate, Name> | undefined {
  return wallets.find(
    (wallet): wallet is NamedWallet<Candidate, Name> => wallet.name === name
  );
}
