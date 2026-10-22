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
  window.matchMedia = (query: string): MediaQueryList => mediaQueryStub(query, false);
}

const STILL = ['', 'none'];

export function moves(element: Element): boolean {
  return !STILL.includes(getComputedStyle(element).animation);
}

export interface PlayedAnimation {
  element: Element;
  keyframes: Keyframe[];
  options?: KeyframeAnimationOptions;
  finish: () => void;
  cancel: () => void;
}

interface StillAnimation {
  cancel: () => void;
  onfinish: (() => void) | null;
  oncancel: (() => void) | null;
}

type Animate = (
  this: Element,
  keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
  options?: number | KeyframeAnimationOptions
) => StillAnimation;

function stillAnimation(): StillAnimation {
  return { cancel: (): void => {}, onfinish: null, oncancel: null };
}

function elementsAnimateWith(animate: Animate): void {
  Object.defineProperty(Element.prototype, 'animate', {
    value: animate,
    configurable: true,
    writable: true,
  });
}

function keyframeListOf(keyframes: Keyframe[] | PropertyIndexedKeyframes | null): Keyframe[] {
  if (!Array.isArray(keyframes)) {
    throw new Error('captureAnimations records keyframe lists only');
  }

  return keyframes;
}

function optionsOf(
  options?: number | KeyframeAnimationOptions
): KeyframeAnimationOptions | undefined {
  return typeof options === 'number' ? { duration: options } : options;
}

export function elementsCanAnimate(): void {
  elementsAnimateWith(stillAnimation);
}

export function elementsDoNotAnimate(): void {
  Reflect.deleteProperty(Element.prototype, 'animate');
}

export function captureAnimations(): PlayedAnimation[] {
  const animationsPlayed: PlayedAnimation[] = [];

  beforeEach(() => {
    animationsPlayed.length = 0;
    elementsAnimateWith(function play(keyframes, options): StillAnimation {
      const animation = stillAnimation();

      animationsPlayed.push({
        element: this,
        keyframes: keyframeListOf(keyframes),
        options: optionsOf(options),
        finish: () => animation.onfinish?.(),
        cancel: () => animation.oncancel?.(),
      });

      return animation;
    });
  });

  return animationsPlayed;
}

export function animationsOn(
  animationsPlayed: PlayedAnimation[],
  element: Element
): PlayedAnimation[] {
  return animationsPlayed.filter((played) => played.element === element);
}
