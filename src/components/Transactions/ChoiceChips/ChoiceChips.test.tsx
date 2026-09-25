import { fireEvent, render, screen } from '@/test-utils/render';
import { CHOICE_CHIPS_TEST_IDS, CHOICE_CHIPS_VARIANT } from './constants';
import { ChoiceChips } from './ChoiceChips';

const mockTestId = 'fruit';
const mockGroupName = 'fruits';
const mockLegend = 'פרי';
const mockChoices = [
  { id: 'apple', label: 'תפוח' },
  { id: 'pear', label: 'אגס' },
  { id: 'plum', label: 'שזיף' },
] as const;
const [mockOther, mockSelected] = mockChoices;

function option(choiceId: string): HTMLElement {
  return screen.getByTestId(CHOICE_CHIPS_TEST_IDS.option(mockTestId, choiceId));
}

describe('choice chips', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    render(
      <ChoiceChips
        groupName={mockGroupName}
        legend={mockLegend}
        choices={mockChoices}
        selected={mockSelected.id}
        onSelect={mockOnSelect}
        testId={mockTestId}
      />
    );
  });

  it('checks exactly the selected choice', () => {
    expect(screen.getAllByRole('radio', { checked: true })).toEqual([
      option(mockSelected.id),
    ]);
  });

  it('tells its parent which choice was picked', () => {
    fireEvent.click(option(mockOther.id));

    expect(mockOnSelect).toHaveBeenCalledWith(mockOther.id);
  });

  it('names the group for a screen reader', () => {
    expect(screen.getByRole('group')).toHaveAccessibleName(mockLegend);
  });
});

describe('choice chips drawn as one segmented control', () => {
  beforeEach(() => {
    render(
      <ChoiceChips
        variant={CHOICE_CHIPS_VARIANT.segmented}
        groupName={mockGroupName}
        legend={mockLegend}
        choices={mockChoices}
        selected={mockSelected.id}
        onSelect={jest.fn()}
        testId={mockTestId}
      />
    );
  });

  it('draws as one segmented control when asked', () => {
    expect(screen.getByRole('group')).toHaveAttribute(
      'data-variant',
      CHOICE_CHIPS_VARIANT.segmented
    );
  });
});
