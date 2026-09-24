import { render, screen } from '@/test-utils/render';
import { PrimaryButton } from './PrimaryButton';

describe('PrimaryButton', () => {
  const TEST_ID = 'primary-button';
  const label = 'פעולה';

  beforeEach(() => {
    render(
      <PrimaryButton type="button" data-testid={TEST_ID}>
        {label}
      </PrimaryButton>
    );
  });

  it('renders its label and forwards the test id to a button', () => {
    const button = screen.getByTestId(TEST_ID);

    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveTextContent(label);
  });
});
