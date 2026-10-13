import { act, renderHook, type RenderHookResult } from '@testing-library/react';
import { DEFAULT_GOAL_PICTURE } from '@/lib/goal/constants';
import { REQUEST_STATE } from '@/lib/request-state';
import { createMockGoalPicture, mockGoal } from '@/test-utils/mocks/goal.mocks';
import { useGoalForm, type GoalFormState } from './use-goal-form';

const mockSubmitEvent = { preventDefault: (): void => {} };

describe('useGoalForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnRequestStateChange = jest.fn();

  function renderGoalForm(): RenderHookResult<GoalFormState, void> {
    return renderHook(() =>
      useGoalForm({ onSubmit: mockOnSubmit, onRequestStateChange: mockOnRequestStateChange })
    );
  }

  beforeEach(() => {
    mockOnSubmit.mockReset();
    mockOnRequestStateChange.mockReset();
  });

  it('starts showing no errors', () => {
    const { result } = renderGoalForm();

    expect(result.current.errors.nameMissing).toBe(false);
  });

  it('shows the errors once the parent tries to save', () => {
    const { result } = renderGoalForm();

    act(() => result.current.handleSubmit(mockSubmitEvent));

    expect(result.current.errors.nameMissing).toBe(true);
  });

  it('sends nothing while a field is wrong', () => {
    const { result } = renderGoalForm();

    act(() => result.current.handleSubmit(mockSubmitEvent));

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('keeps only the digits of a typed amount', () => {
    const { result } = renderGoalForm();

    act(() => result.current.setAmount('₪3,00'));

    expect(result.current.amountShekels).toBe(300);
  });

  describe('filled in', () => {
    const mockAmountShekels = 300;

    function renderFilledGoalForm(): ReturnType<typeof renderGoalForm> {
      const rendered = renderGoalForm();
      act(() => {
        rendered.result.current.setGoalName(`  ${mockGoal.name} `);
        rendered.result.current.setAmount(String(mockAmountShekels));
      });

      return rendered;
    }

    it('sends the trimmed name and the amount in shekels', () => {
      const { result } = renderFilledGoalForm();

      act(() => result.current.handleSubmit(mockSubmitEvent));

      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: mockGoal.name, amount: mockAmountShekels })
      );
    });

    it('sends 🎯 when no picture was chosen', () => {
      const { result } = renderFilledGoalForm();

      act(() => result.current.handleSubmit(mockSubmitEvent));

      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ picture: DEFAULT_GOAL_PICTURE })
      );
    });

    it('sends the chosen picture', () => {
      const mockPicture = createMockGoalPicture('🚲');
      const { result } = renderFilledGoalForm();
      act(() => result.current.setPicture(mockPicture));

      act(() => result.current.handleSubmit(mockSubmitEvent));

      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({ picture: mockPicture }));
    });

    it('reports the request pending while it is sent', () => {
      mockOnSubmit.mockReturnValue(new Promise(() => {}));
      const { result } = renderFilledGoalForm();

      act(() => result.current.handleSubmit(mockSubmitEvent));

      expect(mockOnRequestStateChange).toHaveBeenLastCalledWith(REQUEST_STATE.pending);
    });

    it('sends once when the parent taps save twice while it is pending', () => {
      mockOnSubmit.mockReturnValue(new Promise(() => {}));
      const { result } = renderFilledGoalForm();

      act(() => result.current.handleSubmit(mockSubmitEvent));
      act(() => result.current.handleSubmit(mockSubmitEvent));

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it('reports the request failed when sending it fails', async () => {
      mockOnSubmit.mockRejectedValue(new Error('mock failure'));
      const { result } = renderFilledGoalForm();

      await act(async () => result.current.handleSubmit(mockSubmitEvent));

      expect(mockOnRequestStateChange).toHaveBeenLastCalledWith(REQUEST_STATE.failed);
    });
  });
});
