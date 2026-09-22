import { render, screen } from '@/test-utils/render';
import { EVIDENCE_QUOTE_TEST_IDS } from '../EvidenceQuote/constants';
import { METHOD_SECTION_TEST_IDS } from '../MethodSection/constants';
import { SECTION_NUMBER } from '../constants';
import { WhySection } from './WhySection';

describe('the section on why the money is split', () => {
  beforeEach(() => {
    render(<WhySection />);
  });

  it('carries the partitioning study, the strongest fact the page has', () => {
    expect(
      screen.getByTestId(EVIDENCE_QUOTE_TEST_IDS.quote)
    ).toBeInTheDocument();
  });

  it('takes the muted caveat from the copy rather than restating it here', () => {
    const section = screen.getByTestId(
      METHOD_SECTION_TEST_IDS.section(SECTION_NUMBER.why)
    );

    expect(section.querySelectorAll('[data-muted="true"]')).toHaveLength(1);
  });
});
