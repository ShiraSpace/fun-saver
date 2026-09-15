import { render, screen } from '@/test-utils/render';
import { Pig } from './Pig';
import { PIG_EMOJI, PIG_SIZE } from './constants';

describe('Pig', () => {
  const TEST_ID = 'pig';

  it('renders the emoji at the default size', () => {
    render(<Pig data-testid={TEST_ID}>{PIG_EMOJI}</Pig>);

    const pig = screen.getByTestId(TEST_ID);

    expect(pig).toHaveTextContent(PIG_EMOJI);
    expect(pig).toHaveStyle(`font-size: ${PIG_SIZE.default}px`);
  });

  it('takes the size it is given', () => {
    render(
      <Pig pigSize={120} data-testid={TEST_ID}>
        {PIG_EMOJI}
      </Pig>
    );

    expect(screen.getByTestId(TEST_ID)).toHaveStyle('font-size: 120px');
  });
});
