import { render, screen } from '@/test-utils/render';
import { HeaderTitle } from './HeaderTitle';
import { HEADER_TITLE_TEST_IDS } from './constants';

describe('HeaderTitle', () => {
  it('renders the given text', () => {
    render(<HeaderTitle text="שלום" />);

    expect(screen.getByTestId(HEADER_TITLE_TEST_IDS.title)).toHaveTextContent(
      'שלום'
    );
  });
});
