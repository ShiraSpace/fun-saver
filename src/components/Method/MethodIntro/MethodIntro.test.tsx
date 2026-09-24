import { render, screen } from '@/test-utils/render';
import { KEY_POINT_TEST_IDS } from '../KeyPoint/constants';
import { METHOD_COPY } from '../copy';
import { MethodIntro } from './MethodIntro';
import { METHOD_INTRO_COPY, METHOD_INTRO_TEST_IDS } from './constants';

const EMPHASIS_MARKER = '**';

describe('the opener', () => {
  beforeEach(() => {
    render(<MethodIntro />);
  });

  it('shows an outcome for every one the copy carries, so a fourth needs no change here', () => {
    expect(screen.getAllByTestId(KEY_POINT_TEST_IDS.outcome)).toHaveLength(
      Object.keys(METHOD_COPY.goal.outcomes).length
    );
  });

  it('leads the brief with its eyebrow, so בקצרה introduces the line instead of floating above it', () => {
    expect(screen.getByTestId(METHOD_INTRO_TEST_IDS.brief)).toHaveTextContent(
      `${METHOD_COPY.brief.eyebrow}${METHOD_INTRO_COPY.briefSeparator}${METHOD_COPY.brief.body}`.replaceAll(
        EMPHASIS_MARKER,
        ''
      )
    );
  });

  it('lets no emphasis marker reach the page, whichever string the copy marks up next', () => {
    expect(
      screen.getByTestId(METHOD_INTRO_TEST_IDS.intro)
    ).not.toHaveTextContent(EMPHASIS_MARKER);
  });
});
