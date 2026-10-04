import { createMockWallets } from '@/test-utils/mocks/wallet.mocks';
import { walletNamed } from '../wallet-named';

describe('walletNamed', () => {
  describe("an account's three wallets", () => {
    const mockWallets = createMockWallets();

    it('finds the spending wallet by its name', () => {
      expect(walletNamed(mockWallets, 'spending')?.name).toBe('spending');
    });
  });

  describe('an account with no wallets yet', () => {
    it('finds nothing', () => {
      expect(walletNamed([], 'savings')).toBeUndefined();
    });
  });
});
