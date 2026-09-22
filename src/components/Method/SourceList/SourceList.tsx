import { JSX } from 'react';
import { emphasize } from '../rich-text';
import type { Source } from '../copy';
import { SOURCE_LIST_TEST_IDS } from './constants';
import { Citation, Entry, List } from './SourceList.styles';

interface SourceListProps {
  sources: readonly Source[];
}

export function SourceList({ sources }: SourceListProps): JSX.Element {
  const entries = sources.map((source) => (
    <Entry key={source.url} data-testid={SOURCE_LIST_TEST_IDS.entry}>
      {emphasize(source.claim)}
      <Citation
        dir="ltr"
        href={source.url}
        target="_blank"
        rel="noreferrer"
        data-testid={SOURCE_LIST_TEST_IDS.citation}
      >
        {emphasize(source.citation)}
      </Citation>
    </Entry>
  ));

  return <List data-testid={SOURCE_LIST_TEST_IDS.list}>{entries}</List>;
}
