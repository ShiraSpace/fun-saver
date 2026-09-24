import { render, screen } from '@/test-utils/render';
import { METHOD_COPY } from '../copy';
import { SOURCE_MARKER_TEST_IDS } from '../SourceMarker/constants';
import { EvidenceQuote } from './EvidenceQuote';
import { EVIDENCE_QUOTE_TEST_IDS } from './constants';

describe('an evidence quote', () => {
  const mockBody = 'אלה שקיבלו שתי מעטפות **חסכו 72% יותר**. אותו כסף.';
  const mockCitation = 'Soman & Cheema, Journal of Marketing Research, 2011';

  describe('with no source named', () => {
    beforeEach(() => {
      render(<EvidenceQuote body={mockBody} citation={mockCitation} />);
    });

    it('lifts the finding out of the sentence, because the number is the point', () => {
      expect(
        screen
          .getByTestId(EVIDENCE_QUOTE_TEST_IDS.quote)
          .querySelector('strong')
      ).toHaveTextContent('חסכו 72% יותר');
    });

    it('runs the citation left to right, so a Latin reference keeps its punctuation in an RTL card', () => {
      expect(
        screen.getByTestId(EVIDENCE_QUOTE_TEST_IDS.citation)
      ).toHaveAttribute('dir', 'ltr');
    });

    it('shows no number, because there is nothing for it to point at', () => {
      expect(
        screen.queryByTestId(SOURCE_MARKER_TEST_IDS.marker)
      ).not.toBeInTheDocument();
    });
  });

  describe('with the study behind it named', () => {
    beforeEach(() => {
      render(
        <EvidenceQuote
          body={mockBody}
          citation={mockCitation}
          sources={[METHOD_COPY.sources.list[0].id]}
        />
      );
    });

    it('puts the number on the finding, where the claim is, not on the reference beneath it', () => {
      const finding = screen
        .getByTestId(EVIDENCE_QUOTE_TEST_IDS.quote)
        .querySelector('p');

      expect(finding).toContainElement(
        screen.getByTestId(SOURCE_MARKER_TEST_IDS.marker)
      );
    });
  });
});
