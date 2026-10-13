import { fireEvent, render, screen } from '@/test-utils/render';
import { GoalField } from './GoalField';

const mockInputTestId = 'goal-field-under-test';
const mockErrorTestId = 'goal-field-under-test-error';
const mockError = 'צריך לכתוב משהו';

function renderGoalField(error?: string, onChange = jest.fn()): void {
  render(
    <GoalField
      label="תווית"
      value=""
      onChange={onChange}
      maxLength={10}
      error={error}
      errorTestId={mockErrorTestId}
      data-testid={mockInputTestId}
    />
  );
}

describe('GoalField', () => {
  it('passes what the parent types', () => {
    const mockOnChange = jest.fn();
    renderGoalField(undefined, mockOnChange);

    fireEvent.change(screen.getByTestId(mockInputTestId), { target: { value: 'אופניים' } });

    expect(mockOnChange).toHaveBeenCalledWith('אופניים');
  });

  it('shows no message while the field is fine', () => {
    renderGoalField();

    expect(screen.queryByTestId(mockErrorTestId)).not.toBeInTheDocument();
  });

  describe('with an error', () => {
    beforeEach(() => {
      renderGoalField(mockError);
    });

    it('shows the message', () => {
      expect(screen.getByTestId(mockErrorTestId)).toHaveTextContent(mockError);
    });

    it('marks the input invalid', () => {
      expect(screen.getByTestId(mockInputTestId)).toHaveAttribute('aria-invalid', 'true');
    });

    it('describes the input by the message', () => {
      expect(screen.getByTestId(mockInputTestId)).toHaveAccessibleDescription(mockError);
    });
  });
});
