import { render, screen } from '@testing-library/react';
import { ActionButton } from './ActionButton';

describe('ActionButton', () => {
  const TEST_ID = 'action';
  const action = 'פעולה';

  beforeEach(() => {
    render(
      <ActionButton type="button" data-testid={TEST_ID}>
        {action}
      </ActionButton>
    );
  });

  it('renders its label and forwards the test id to a button', () => {
    const button = screen.getByTestId(TEST_ID);

    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveTextContent(action);
  });
});
