import { render, screen } from '@/test-utils/render';
import { EvidenceQuote } from './EvidenceQuote';
import { EVIDENCE_QUOTE_TEST_IDS } from './constants';

describe('an evidence quote', () => {
  const BODY = 'אלה שקיבלו שתי מעטפות **חסכו 72% יותר**. אותו כסף.';
  const CITATION = 'Soman & Cheema, Journal of Marketing Research, 2011';

  beforeEach(() => {
    render(<EvidenceQuote body={BODY} citation={CITATION} />);
  });

  it('lifts the finding out of the sentence, because the number is the point', () => {
    expect(
      screen.getByTestId(EVIDENCE_QUOTE_TEST_IDS.quote).querySelector('strong')
    ).toHaveTextContent('חסכו 72% יותר');
  });

  it('runs the citation left to right, so a Latin reference keeps its punctuation in an RTL card', () => {
    expect(
      screen.getByTestId(EVIDENCE_QUOTE_TEST_IDS.citation)
    ).toHaveAttribute('dir', 'ltr');
  });
});
