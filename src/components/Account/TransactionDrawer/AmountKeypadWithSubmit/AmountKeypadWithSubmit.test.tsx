import { render, screen } from '@/test-utils/render';
import { REQUEST_STATE } from '@/lib/request-state';
import { AmountKeypadWithSubmit } from './AmountKeypadWithSubmit';
import { AMOUNT_KEYPAD_WITH_SUBMIT_TEST_IDS } from './constants';
import { AMOUNT_KEYPAD_TEST_IDS } from '../AmountKeypad/constants';
import type { AmountEntry } from '../use-amount-entry';
import { WITHDRAWAL_FORM_COPY } from '../WithdrawalForm/constants';

const mockEntry: AmountEntry = {
  amountShekels: 0,
  requestState: REQUEST_STATE.idle,
  onDigit: jest.fn(),
  onClear: jest.fn(),
  onBackspace: jest.fn(),
  onSubmit: jest.fn(),
};

const keypadKey = (): HTMLElement =>
  screen.getByTestId(AMOUNT_KEYPAD_TEST_IDS.key('1'));

describe('AmountKeypadWithSubmit', () => {
  describe('with nothing in place of the keypad', () => {
    beforeEach(() => {
      render(
        <AmountKeypadWithSubmit
          entry={mockEntry}
          canSubmit
          submitLabel={WITHDRAWAL_FORM_COPY.submit}
        />
      );
    });

    it('shows the keypad', () => {
      expect(keypadKey()).toBeVisible();
    });
  });

  describe('with something in place of the keypad', () => {
    const mockInPlaceOfKeypad = 'החיסכון שמור ליעד';

    beforeEach(() => {
      render(
        <AmountKeypadWithSubmit
          entry={mockEntry}
          canSubmit={false}
          submitLabel={WITHDRAWAL_FORM_COPY.submit}
          inPlaceOfKeypad={mockInPlaceOfKeypad}
        />
      );
    });

    it('hides the keypad', () => {
      expect(keypadKey()).not.toBeVisible();
    });

    it('shows what it was given in place of the keypad', () => {
      expect(
        screen.getByTestId(AMOUNT_KEYPAD_WITH_SUBMIT_TEST_IDS.inPlaceOfKeypad)
      ).toHaveTextContent(mockInPlaceOfKeypad);
    });
  });
});
