import { ReactNode } from 'react';

const EMPHASIS = /\*\*(.+?)\*\*/;

export function emphasize(body: string): ReactNode[] {
  return body
    .split(EMPHASIS)
    .map((run, index) =>
      index % 2 === 0 ? run : <strong key={index}>{run}</strong>
    );
}

export function paragraphs(body: string): string[] {
  return body.split('\n\n');
}
