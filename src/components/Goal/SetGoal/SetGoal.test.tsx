import { StatusCodes } from 'http-status-codes';
import { fireEvent, render, screen, waitFor } from '@/test-utils/render';
import { mockAccountSummary } from '@/test-utils/mocks/account.mocks';
import { mockGoal } from '@/test-utils/mocks/goal.mocks';
import { restoreFetchAfterEach, stubFetch } from '@/test-utils/stub-fetch';
import { ESCAPE_KEY } from '@/hooks/constants';
import { CLOSE_BUTTON_TEST_IDS } from '@/components/CloseButton/constants';
import { GOAL_NAME_FIELD_TEST_IDS } from '../GoalFields/GoalNameField/constants';
import { GOAL_AMOUNT_FIELD_TEST_IDS } from '../GoalFields/GoalAmountField/constants';
import { SAVE_GOAL_BUTTON_TEST_IDS } from '../GoalFields/SaveGoalButton/constants';
import {
  SAVINGS_LOCK_NOTE_COPY,
  SAVINGS_LOCK_NOTE_TEST_IDS,
} from '../GoalFields/SavingsLockNote/constants';
import { SetGoal } from './SetGoal';
import { SET_GOAL_TEST_IDS } from './constants';

function fillGoal(amountShekels: string): void {
  fireEvent.change(screen.getByTestId(GOAL_NAME_FIELD_TEST_IDS.input), {
    target: { value: mockGoal.name },
  });
  fireEvent.change(screen.getByTestId(GOAL_AMOUNT_FIELD_TEST_IDS.input), {
    target: { value: amountShekels },
  });
}

function saveGoal(): void {
  fireEvent.click(screen.getByTestId(SAVE_GOAL_BUTTON_TEST_IDS.submit));
}

describe('SetGoal', () => {
  const mockOnClose = jest.fn();
  const mockOnFinished = jest.fn();

  restoreFetchAfterEach();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnFinished.mockClear();
    render(
      <SetGoal account={mockAccountSummary} onClose={mockOnClose} onFinished={mockOnFinished} />
    );
  });

  it('closes without saving when ✕ is tapped', () => {
    fireEvent.click(screen.getByTestId(CLOSE_BUTTON_TEST_IDS.button));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('closes without saving when ביטול is tapped', () => {
    fireEvent.click(screen.getByTestId(SET_GOAL_TEST_IDS.cancel));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("weighs the amount against the account's savings", () => {
    fillGoal('85');

    expect(screen.getByTestId(SAVINGS_LOCK_NOTE_TEST_IDS.note)).toHaveTextContent(
      SAVINGS_LOCK_NOTE_COPY.reached(mockGoal.name)
    );
  });

  it('finishes once the goal is set', async () => {
    stubFetch(jest.fn().mockResolvedValue({ ok: true, json: async () => mockGoal }));
    fillGoal('300');

    saveGoal();

    await waitFor(() => expect(mockOnFinished).toHaveBeenCalledTimes(1));
  });

  it('finishes when another parent already set a goal', async () => {
    stubFetch(jest.fn().mockResolvedValue({ ok: false, status: StatusCodes.CONFLICT }));
    fillGoal('300');

    saveGoal();

    await waitFor(() => expect(mockOnFinished).toHaveBeenCalledTimes(1));
  });

  it('stays open when saving fails', async () => {
    stubFetch(
      jest.fn().mockResolvedValue({ ok: false, status: StatusCodes.INTERNAL_SERVER_ERROR })
    );
    fillGoal('300');

    saveGoal();
    await screen.findByTestId(SAVE_GOAL_BUTTON_TEST_IDS.saveError);

    expect(mockOnFinished).not.toHaveBeenCalled();
  });

  describe('while the goal is being saved', () => {
    beforeEach(() => {
      stubFetch(jest.fn().mockReturnValue(new Promise(() => {})));
      fillGoal('300');
      saveGoal();
    });

    it('locks ✕', () => {
      expect(screen.getByTestId(CLOSE_BUTTON_TEST_IDS.button)).toBeDisabled();
    });

    it('locks ביטול', () => {
      expect(screen.getByTestId(SET_GOAL_TEST_IDS.cancel)).toBeDisabled();
    });

    it('stays open on escape', () => {
      fireEvent.keyDown(document.body, { key: ESCAPE_KEY });

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});
