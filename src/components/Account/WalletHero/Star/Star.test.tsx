import { render } from '@/test-support/render';
import { Star } from './Star';

describe('Star', () => {
  it('renders a star svg path', () => {
    const { container } = render(<Star />);
    expect(container.querySelector('svg path')).not.toBeNull();
  });
});
