import { render, screen } from '@/test-utils/render';
import { GOAL_COPY } from '../../constants';
import { SavingsLock } from './SavingsLock';
import { SAVINGS_LOCK_COPY, SAVINGS_LOCK_TEST_IDS } from './constants';

describe('SavingsLock', () => {
  it('says savings are kept while locked', () => {
    render(<SavingsLock reached={false} />);

    expect(screen.getByTestId(SAVINGS_LOCK_TEST_IDS.label)).toHaveTextContent(
      GOAL_COPY.savingsLocked
    );
  });

  it('says savings are open once reached', () => {
    render(<SavingsLock reached />);

    expect(screen.getByTestId(SAVINGS_LOCK_TEST_IDS.label)).toHaveTextContent(
      SAVINGS_LOCK_COPY.savingsOpen
    );
  });
});
