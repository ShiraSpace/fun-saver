import { Fragment, JSX } from 'react';
import type { MethodBlock } from '../copy';
import { EvidenceQuote } from '../EvidenceQuote';
import { SourceMarker } from '../SourceMarker';
import { TalkBubble } from '../TalkBubble';
import { emphasize, paragraphs } from '../rich-text';

interface MethodBlocksProps {
  blocks: readonly MethodBlock[];
}

function blockContent(block: MethodBlock): JSX.Element {
  if (block.kind === 'heading') {
    return <h3>{emphasize(block.body)}</h3>;
  }

  if (block.kind === 'quote') {
    return (
      <EvidenceQuote
        body={block.body}
        citation={block.citation}
        sources={block.sources}
      />
    );
  }

  if (block.kind === 'talk') {
    return <TalkBubble label={block.label} lines={block.lines} />;
  }

  const lines = paragraphs(block.body);
  const rendered = lines.map((line, index) => (
    <p key={index} data-muted={block.muted}>
      {emphasize(line)}
      {index === lines.length - 1 && block.sources && (
        <SourceMarker sources={block.sources} />
      )}
    </p>
  ));

  return <>{rendered}</>;
}

export function MethodBlocks({ blocks }: MethodBlocksProps): JSX.Element {
  const rendered = blocks.map((block, index) => (
    <Fragment key={index}>{blockContent(block)}</Fragment>
  ));

  return <>{rendered}</>;
}
