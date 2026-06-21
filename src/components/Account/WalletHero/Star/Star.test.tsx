import { render } from '@testing-library/react';
import { Star } from './Star';

describe('Star', () => {
  it('renders a star svg path', () => {
    const { container } = render(<Star />);
    expect(container.querySelector('svg path')).not.toBeNull();
  });
});
