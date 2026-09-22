import { JSX } from 'react';
import { METHOD_COPY, type SourceId } from '../copy';
import { SOURCE_MARKER_COPY, SOURCE_MARKER_TEST_IDS } from './constants';
import { Marker } from './SourceMarker.styles';

interface SourceMarkerProps {
  sources: readonly SourceId[];
}

function sourceNumber(id: SourceId): number {
  return METHOD_COPY.sources.list.findIndex((source) => source.id === id) + 1;
}

function spokenLabel(numbers: readonly number[]): string {
  const noun =
    numbers.length > 1 ? SOURCE_MARKER_COPY.several : SOURCE_MARKER_COPY.one;

  return `${noun} ${numbers.join(SOURCE_MARKER_COPY.labelSeparator)}`;
}

export function SourceMarker({ sources }: SourceMarkerProps): JSX.Element {
  const numbers = sources.map(sourceNumber);

  return (
    <Marker
      dir="ltr"
      role="img"
      aria-label={spokenLabel(numbers)}
      data-testid={SOURCE_MARKER_TEST_IDS.marker}
    >
      {numbers.join(SOURCE_MARKER_COPY.separator)}
    </Marker>
  );
}
