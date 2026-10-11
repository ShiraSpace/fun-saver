import { createMockWallets } from '@/test-utils/mocks/wallet.mocks';
import { savingsFirst } from '../savings-first';

describe('savingsFirst', () => {
  const [mockSavings, mockSpending, mockGoodDeeds] = createMockWallets();

  describe('wallets with savings in the middle', () => {
    const mockWallets = [mockSpending, mockSavings, mockGoodDeeds];

    it('puts savings first', () => {
      expect(savingsFirst(mockWallets)[0]).toBe(mockSavings);
    });

    it('keeps the other wallets in their order', () => {
      const otherWallets = savingsFirst(mockWallets).filter(
        (wallet) => wallet !== mockSavings
      );

      expect(otherWallets).toEqual([mockSpending, mockGoodDeeds]);
    });
  });

  describe('wallets without savings', () => {
    it('keeps them in their order', () => {
      expect(savingsFirst([mockGoodDeeds, mockSpending])).toEqual([
        mockGoodDeeds,
        mockSpending,
      ]);
    });
  });
});
