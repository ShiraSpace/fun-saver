import { REDUCED_MOTION } from '@/theme/motion';
import { CELEBRATION_WAIT } from '@/components/Goal/Celebration/celebration-parts';

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
}

function stillAnimation(): Animation {
  return { cancel: (): void => {} } as Animation;
}

export function elementsCanAnimate(): void {
  Element.prototype.animate = stillAnimation;
}

export function elementsDoNotAnimate(): void {
  Reflect.deleteProperty(Element.prototype, 'animate');
}

export function captureAnimations(): PlayedAnimation[] {
  const animationsPlayed: PlayedAnimation[] = [];

  beforeEach(() => {
    animationsPlayed.length = 0;
    elementsCanAnimate();
    Element.prototype.animate = function play(this: Element, keyframes, options): Animation {
      const animation = stillAnimation();
      const finishEvent = new Event('finish') as AnimationPlaybackEvent;

      animationsPlayed.push({
        element: this,
        keyframes: keyframes as Keyframe[],
        options: options as KeyframeAnimationOptions | undefined,
        finish: () => animation.onfinish?.call(animation, finishEvent),
      });

      return animation;
    };
  });

  return animationsPlayed;
}

export function animationsOn(
  animationsPlayed: PlayedAnimation[],
  element: Element
): PlayedAnimation[] {
  return animationsPlayed.filter((played) => played.element === element);
}

export function waitsForTheCelebration(element: Element): boolean {
  const { animation, animationDelay } = getComputedStyle(element);

  return `${animation} ${animationDelay}`.includes(`var(${CELEBRATION_WAIT}`);
}
