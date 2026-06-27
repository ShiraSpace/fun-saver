import { JSX, SVGProps } from 'react';
import { useTheme } from '@emotion/react';
import { STAR } from './constants';

export function Star(props: SVGProps<SVGSVGElement>): JSX.Element {
  const theme = useTheme();
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d={STAR.path} fill={theme.colors.star} stroke="none" />
    </svg>
  );
}
