import { render, screen } from '@/test-utils/render';
import { GOAL_COPY } from '../../constants';
import { SavingsLock } from './SavingsLock';
import { SAVINGS_LOCK_COPY, SAVINGS_LOCK_TEST_IDS } from './constants';

describe('SavingsLock', () => {
  describe('while locked', () => {
    beforeEach(() => {
      render(<SavingsLock reached={false} />);
    });

    it('says savings are kept', () => {
      expect(screen.getByTestId(SAVINGS_LOCK_TEST_IDS.label)).toHaveTextContent(
        GOAL_COPY.savingsLocked
      );
    });
  });

  describe('once reached', () => {
    beforeEach(() => {
      render(<SavingsLock reached />);
    });

    it('says savings are open', () => {
      expect(screen.getByTestId(SAVINGS_LOCK_TEST_IDS.label)).toHaveTextContent(
        SAVINGS_LOCK_COPY.savingsOpen
      );
    });
  });
});
