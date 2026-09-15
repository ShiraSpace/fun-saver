import { render, screen } from '@/test-utils/render';
import { TITLE_TEST_IDS } from '@/components/Header/CrossfadeTitle/constants';
import { HEADER_TEST_IDS } from '@/components/Header/constants';
import { Method } from './Method';
import { METHOD_COPY } from './copy';

describe('the method page', () => {
  beforeEach(() => {
    render(<Method />);
  });

  it('names itself in the header, so the parent knows what they opened', () => {
    expect(screen.getByTestId(TITLE_TEST_IDS.title)).toHaveTextContent(
      METHOD_COPY.title
    );
  });

  it('carries no avatar, because the page belongs to no child', () => {
    expect(
      screen.queryByTestId(HEADER_TEST_IDS.avatar)
    ).not.toBeInTheDocument();
  });
});
