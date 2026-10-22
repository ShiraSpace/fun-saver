import { createRef } from 'react';
import { render, screen } from '@/test-utils/render';
import { SavingsBalance } from './SavingsBalance';
import { moves } from '@/test-utils/motion';
import { SAVINGS_BALANCE_TEST_IDS } from './constants';
import { BALANCE_TWINKLES_TEST_IDS, TWINKLE_PLACES } from './BalanceTwinkles/constants';

describe('SavingsBalance of ₪148', () => {
  beforeEach(() => {
    render(<SavingsBalance balance={14800} />);
  });

  it('hides the drawn total from a screen reader, so the total is read once', () => {
    expect(
      screen.getByTestId(SAVINGS_BALANCE_TEST_IDS.balance).closest('[aria-hidden="true"]')
    ).not.toBeNull();
  });

  it('leaves the announced total where a screen reader can read it', () => {
    expect(
      screen.getByTestId(SAVINGS_BALANCE_TEST_IDS.announcedBalance).closest('[aria-hidden="true"]')
    ).toBeNull();
  });

  it('announces the total', () => {
    expect(screen.getByTestId(SAVINGS_BALANCE_TEST_IDS.announcedBalance)).toHaveTextContent('₪148');
  });

  it('announces the whole total, currency sign included, when only its number changes', () => {
    expect(
      screen.getByTestId(SAVINGS_BALANCE_TEST_IDS.announcedBalance).closest('[aria-atomic="true"]')
    ).not.toBeNull();
  });

  it('announces a new total politely', () => {
    expect(
      screen.getByTestId(SAVINGS_BALANCE_TEST_IDS.announcedBalance).closest('[aria-live="polite"]')
    ).not.toBeNull();
  });

  it('holds the total still', () => {
    expect(moves(screen.getByTestId(SAVINGS_BALANCE_TEST_IDS.shown))).toBe(false);
  });

  it('shows no twinkles', () => {
    expect(screen.queryByTestId(BALANCE_TWINKLES_TEST_IDS.twinkles)).not.toBeInTheDocument();
  });
});

describe('SavingsBalance celebrating a reached goal', () => {
  beforeEach(() => {
    render(<SavingsBalance balance={14800} celebrating />);
  });

  it('bumps the total and flashes it gold', () => {
    expect(moves(screen.getByTestId(SAVINGS_BALANCE_TEST_IDS.shown))).toBe(true);
  });

  it('twinkles all round the total', () => {
    expect(screen.getAllByTestId(BALANCE_TWINKLES_TEST_IDS.twinkle)).toHaveLength(
      TWINKLE_PLACES.length
    );
  });
});

it('can be focused through its ref, for the last coin to hand focus to', () => {
  const mockBalanceElement = createRef<HTMLDivElement>();
  render(<SavingsBalance balance={14800} ref={mockBalanceElement} />);

  mockBalanceElement.current?.focus();

  expect(mockBalanceElement.current).toHaveFocus();
});
