import { Fragment, JSX } from 'react';
import type { MethodBlock } from '../copy';
import { EvidenceQuote } from '../EvidenceQuote';
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
    return <EvidenceQuote body={block.body} citation={block.citation} />;
  }

  if (block.kind === 'talk') {
    return <TalkBubble label={block.label} lines={block.lines} />;
  }

  const lines = paragraphs(block.body).map((line, index) => (
    <p key={index} data-muted={block.muted}>
      {emphasize(line)}
    </p>
  ));

  return <>{lines}</>;
}

export function MethodBlocks({ blocks }: MethodBlocksProps): JSX.Element {
  const rendered = blocks.map((block, index) => (
    <Fragment key={index}>{blockContent(block)}</Fragment>
  ));

  return <>{rendered}</>;
}
