import { JSX } from 'react';
import { MethodBlocks } from '../MethodBlocks';
import { MethodSection } from '../MethodSection';
import { SourceList } from '../SourceList';
import { SOURCES_SECTION_ID } from '../constants';
import { METHOD_COPY, type MethodBlock } from '../copy';

const { sources } = METHOD_COPY;

const INTRO_BLOCKS: readonly MethodBlock[] = [sources.intro];

const MORE_BLOCKS: readonly MethodBlock[] = [sources.more];

const SOURCE_COUNT = String(sources.list.length);

export function SourcesSection(): JSX.Element {
  return (
    <MethodSection
      id={SOURCES_SECTION_ID}
      title={sources.title}
      hint={SOURCE_COUNT}
    >
      <MethodBlocks blocks={INTRO_BLOCKS} />
      <SourceList sources={sources.list} />
      <MethodBlocks blocks={MORE_BLOCKS} />
    </MethodSection>
  );
}
