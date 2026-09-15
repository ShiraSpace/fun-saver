import { REDUCED_MOTION } from '@/theme/motion';

function mediaQueryStub(query: string, matches: boolean): MediaQueryList {
  return {
    matches,
    media: query,
    onchange: null,
    addListener: (): void => {},
    removeListener: (): void => {},
    addEventListener: (): void => {},
    removeEventListener: (): void => {},
    dispatchEvent: (): boolean => false,
  } as MediaQueryList;
}

export function prefersReducedMotion(): void {
  window.matchMedia = (query: string): MediaQueryList =>
    mediaQueryStub(query, query === REDUCED_MOTION);
}

export function prefersMotion(): void {
  window.matchMedia = (query: string): MediaQueryList =>
    mediaQueryStub(query, false);
}
