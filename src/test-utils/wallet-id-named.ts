import type { Account } from '@/lib/account/types';
import type { WalletName } from '@/lib/wallet/types';
import { walletNamed } from '@/lib/wallet/wallet-named';

export function walletIdNamed(account: Account, name: WalletName): string {
  const wallet = walletNamed(account.wallets, name);

  if (!wallet) {
    throw new Error(`the account has no ${name} wallet`);
  }

  return wallet.id;
}
