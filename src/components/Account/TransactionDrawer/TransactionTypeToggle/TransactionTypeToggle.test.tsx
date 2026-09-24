import { fireEvent, render, screen } from '@/test-utils/render';
import { hexToRgb } from '@/test-utils/css-color';
import { getThemeTokens, THEME_ID } from '@/theme/registry';
import { TransactionTypeToggle } from './TransactionTypeToggle';
import type { ThemeId } from '@/theme/registry';
import type { EnteredTransactionType } from '../constants';
import {
  TRANSACTION_TYPE_TOGGLE_COPY,
  TRANSACTION_TYPE_TOGGLE_TEST_IDS,
} from './constants';

const mockOnChange = jest.fn();

function renderToggle(
  transactionType: EnteredTransactionType,
  themeId?: ThemeId
): void {
  render(
    <TransactionTypeToggle
      transactionType={transactionType}
      onChange={mockOnChange}
    />,
    { themeId }
  );
}

describe('TransactionTypeToggle', () => {
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('marks the chosen transaction type as pressed', () => {
    renderToggle('withdrawal');

    expect(
      screen.getByTestId(TRANSACTION_TYPE_TOGGLE_TEST_IDS.withdrawal)
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByTestId(TRANSACTION_TYPE_TOGGLE_TEST_IDS.deposit)
    ).toHaveAttribute('aria-pressed', 'false');
  });

  it('reports the tapped transaction type through onChange', () => {
    renderToggle('deposit');

    fireEvent.click(
      screen.getByTestId(TRANSACTION_TYPE_TOGGLE_TEST_IDS.withdrawal)
    );

    expect(mockOnChange).toHaveBeenCalledWith('withdrawal');
  });

  describe('the arrows, which sit on the track and not on the surface', () => {
    const { alertText, gainText } = getThemeTokens(THEME_ID.jungleQuest).colors;

    beforeEach(() => {
      renderToggle('deposit', THEME_ID.jungleQuest);
    });

    it('paints the withdrawal arrow in the alert red', () => {
      const arrow = screen.getByText(
        TRANSACTION_TYPE_TOGGLE_COPY.withdrawalArrow
      );

      expect(getComputedStyle(arrow).color).toBe(hexToRgb(alertText));
    });

    it('paints the deposit arrow in the gain green', () => {
      const arrow = screen.getByText(TRANSACTION_TYPE_TOGGLE_COPY.depositArrow);

      expect(getComputedStyle(arrow).color).toBe(hexToRgb(gainText));
    });
  });
});
