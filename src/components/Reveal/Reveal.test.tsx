import { render, screen } from '@/test-support/render';
import { Reveal } from './Reveal';
import { REVEAL_TEST_IDS } from './constants';

describe('Reveal', () => {
  it('renders its children inside the reveal wrapper', () => {
    render(
      <Reveal>
        <span data-testid="child">hi</span>
      </Reveal>
    );

    expect(screen.getByTestId(REVEAL_TEST_IDS.reveal)).toContainElement(
      screen.getByTestId('child')
    );
  });
});
