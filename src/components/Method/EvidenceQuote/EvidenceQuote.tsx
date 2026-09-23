import { JSX } from 'react';
import { SourceMarker } from '../SourceMarker';
import { emphasize } from '../rich-text';
import type { SourceId } from '../copy';
import { EVIDENCE_QUOTE_TEST_IDS } from './constants';
import { Citation, Finding, Quote } from './EvidenceQuote.styles';

interface EvidenceQuoteProps {
  body: string;
  citation: string;
  sources?: readonly SourceId[];
}

export function EvidenceQuote({
  body,
  citation,
  sources,
}: EvidenceQuoteProps): JSX.Element {
  const finding = emphasize(body);
  const marker = <SourceMarker sources={sources} />;

  return (
    <Quote data-testid={EVIDENCE_QUOTE_TEST_IDS.quote}>
      <Finding>
        {finding}
        {marker}
      </Finding>
      <Citation dir="ltr" data-testid={EVIDENCE_QUOTE_TEST_IDS.citation}>
        {citation}
      </Citation>
    </Quote>
  );
}
