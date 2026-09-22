import { render, screen } from '@/test-utils/render';
import { TITLE_TEST_IDS } from '@/components/Header/CrossfadeTitle/constants';
import { HEADER_TEST_IDS } from '@/components/Header/constants';
import { METHOD_SECTION_TEST_IDS } from './MethodSection/constants';
import { WALLETS_SECTION } from './WalletsSection/constants';
import { WHY_SECTION } from './WhySection/constants';
import { METHOD_INTRO_TEST_IDS } from './MethodIntro/constants';
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

  it('opens with the method itself, the one block that never collapses', () => {
    expect(screen.getByTestId(METHOD_INTRO_TEST_IDS.intro)).toBeInTheDocument();
  });

  it('follows the opener with the first section, closed like the rest', () => {
    expect(
      screen.getByTestId(METHOD_SECTION_TEST_IDS.section(WHY_SECTION.number))
    ).toBeInTheDocument();
  });

  it('lists the sections in the order the copy numbers them', () => {
    const numbered = screen
      .getAllByTestId(/^method-section-\d+$/)
      .map((section) => section.dataset.testid);

    expect(numbered).toEqual([
      METHOD_SECTION_TEST_IDS.section(WHY_SECTION.number),
      METHOD_SECTION_TEST_IDS.section(WALLETS_SECTION.number),
    ]);
  });
});
