import { render, screen } from '@testing-library/react';
import { Screen } from './Screen';

describe('Screen', () => {
  it('renders its children within a tagged surface', () => {
    render(<Screen data-testid="surface">content</Screen>);
    expect(screen.getByTestId('surface')).toHaveTextContent('content');
  });
});
