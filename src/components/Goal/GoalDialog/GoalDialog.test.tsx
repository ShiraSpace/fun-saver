import { render, screen } from '@/test-utils/render';
import { GoalDialog } from './GoalDialog';

const mockTitle = 'יעד חיסכון';
const mockDialogTestId = 'goal-dialog-under-test';

describe('GoalDialog', () => {
  beforeEach(() => {
    render(
      <GoalDialog title={mockTitle} onClose={jest.fn()} data-testid={mockDialogTestId}>
        <span />
      </GoalDialog>
    );
  });

  it('is a modal dialog named by its title', () => {
    expect(screen.getByRole('dialog', { name: mockTitle })).toHaveAttribute('aria-modal', 'true');
  });

  it('takes the focus when it opens', () => {
    expect(document.activeElement).toBe(screen.getByTestId(mockDialogTestId));
  });
});
