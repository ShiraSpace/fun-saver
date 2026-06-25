import { render, screen } from '@/test-support/render';
import { Title } from './Title';
import { TITLE_TEST_IDS } from './constants';

describe('Title', () => {
  it('renders the given text', () => {
    render(<Title text="שלום" />);

    expect(screen.getByTestId(TITLE_TEST_IDS.title)).toHaveTextContent('שלום');
  });
});
