import { JSX } from 'react';
import { METHOD_COPY, type SourceId } from '../copy';
import { SOURCE_MARKER_COPY, SOURCE_MARKER_TEST_IDS } from './constants';
import { Marker } from './SourceMarker.styles';

interface SourceMarkerProps {
  sources: readonly SourceId[];
}

export function sourceNumber(id: SourceId): number {
  return METHOD_COPY.sources.list.findIndex((source) => source.id === id) + 1;
}

export function SourceMarker({ sources }: SourceMarkerProps): JSX.Element {
  const numbers = sources.map(sourceNumber).join(SOURCE_MARKER_COPY.separator);

  return (
    <Marker dir="ltr" data-testid={SOURCE_MARKER_TEST_IDS.marker}>
      {numbers}
    </Marker>
  );
}
