import { savingsInWholeShekels } from '../savings-in-whole-shekels';

describe('savingsInWholeShekels', () => {
  describe('savings of ₪148.90, ₪6.40 of it interest', () => {
    const mockSavings = { balance: 14890, interestEarned: 640 };

    it('shows the balance without the agorot the child cannot count yet', () => {
      expect(savingsInWholeShekels(mockSavings).balance).toBe(14800);
    });

    it('shows what the money earned by itself in whole shekels', () => {
      expect(savingsInWholeShekels(mockSavings).interestEarned).toBe(600);
    });
  });

  describe('savings of ₪148.50, ₪6.90 of it interest', () => {
    it('shows what the child put in as the rest, so the two add up to the balance', () => {
      expect(
        savingsInWholeShekels({ balance: 14850, interestEarned: 690 }).principal
      ).toBe(14200);
    });
  });

  describe('withdrawals took more than was deposited, so interest is more than the balance', () => {
    const mockSavings = { balance: 300, interestEarned: 500 };

    it('never shows a negative amount put in', () => {
      expect(savingsInWholeShekels(mockSavings).principal).toBe(0);
    });

    it('counts the whole balance as earned, so the tiles still add up', () => {
      expect(savingsInWholeShekels(mockSavings).interestEarned).toBe(300);
    });
  });

  describe('savings that have not earned interest yet', () => {
    it('shows nothing earned', () => {
      expect(
        savingsInWholeShekels({ balance: 1200, interestEarned: 0 })
          .interestEarned
      ).toBe(0);
    });
  });
});
