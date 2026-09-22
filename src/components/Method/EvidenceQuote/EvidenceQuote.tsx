import { JSX } from 'react';
import { emphasize } from '../rich-text';
import { EVIDENCE_QUOTE_TEST_IDS } from './constants';
import { Citation, Finding, Quote } from './EvidenceQuote.styles';

interface EvidenceQuoteProps {
  body: string;
  citation: string;
}

export function EvidenceQuote({
  body,
  citation,
}: EvidenceQuoteProps): JSX.Element {
  const finding = emphasize(body);

  return (
    <Quote data-testid={EVIDENCE_QUOTE_TEST_IDS.quote}>
      <Finding>{finding}</Finding>
      <Citation dir="ltr" data-testid={EVIDENCE_QUOTE_TEST_IDS.citation}>
        {citation}
      </Citation>
    </Quote>
  );
}
