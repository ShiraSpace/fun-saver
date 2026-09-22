import { JSX } from 'react';
import { EvidenceQuote } from '../EvidenceQuote';
import { MethodSection } from '../MethodSection';
import { METHOD_COPY } from '../copy';
import { emphasize, paragraphs } from '../rich-text';
import { WHY_SECTION } from './constants';

const { why } = METHOD_COPY;

export function WhySection(): JSX.Element {
  const lead = paragraphs(why.body.body).map((line, index) => (
    <p key={index}>{emphasize(line)}</p>
  ));

  const noTransfers = emphasize(why.noTransfers.body);
  const honest = emphasize(why.honest.body);

  return (
    <MethodSection number={WHY_SECTION.number} title={why.title}>
      {lead}
      <EvidenceQuote
        body={why.evidence.body}
        citation={why.evidence.citation}
      />
      <p>{noTransfers}</p>
      <p data-muted={why.honest.muted}>{honest}</p>
    </MethodSection>
  );
}
