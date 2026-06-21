import { JSX, SVGProps } from 'react';
import { STAR } from './constants';

export function Star(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        d={STAR.path}
        fill={STAR.fill}
        stroke={STAR.stroke}
        strokeWidth={STAR.strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}
