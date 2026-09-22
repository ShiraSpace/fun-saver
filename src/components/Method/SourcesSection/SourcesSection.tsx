import { JSX } from 'react';
import { MethodBlocks } from '../MethodBlocks';
import { MethodSection } from '../MethodSection';
import { SourceList } from '../SourceList';
import { SOURCES_SECTION_ID } from '../constants';
import { METHOD_COPY } from '../copy';

const { sources } = METHOD_COPY;

export function SourcesSection(): JSX.Element {
  return (
    <MethodSection
      id={SOURCES_SECTION_ID}
      title={sources.title}
      hint={String(sources.list.length)}
    >
      <MethodBlocks blocks={[sources.intro]} />
      <SourceList sources={sources.list} />
      <MethodBlocks blocks={[sources.more]} />
    </MethodSection>
  );
}
