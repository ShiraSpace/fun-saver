'use client';

import { ChangeEvent, JSX } from 'react';
import { QUERY_FIELD_COPY, QUERY_FIELD_TEST_IDS } from './constants';
import { SearchBox } from './QueryField.styles';

interface QueryFieldProps {
  query: string;
  onChange: (query: string) => void;
}

export function QueryField({ query, onChange }: QueryFieldProps): JSX.Element {
  const editQuery = (event: ChangeEvent<HTMLInputElement>): void =>
    onChange(event.target.value);

  return (
    <SearchBox
      type="search"
      enterKeyHint="search"
      aria-label={QUERY_FIELD_COPY.label}
      data-testid={QUERY_FIELD_TEST_IDS.input}
      value={query}
      onChange={editQuery}
    />
  );
}
