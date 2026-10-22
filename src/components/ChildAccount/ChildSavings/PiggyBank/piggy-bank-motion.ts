import { canAnimate, EASING } from '@/theme/motion';
import { PIGGY_BANK_BREATHE, PIGGY_BANK_WIGGLE } from './constants';

function wiggle(piggyBank: Element): Animation {
  const { durationMs, tiltDegrees, tiltLeftAt, tiltRightAt, upright, fromItsMiddle } =
    PIGGY_BANK_WIGGLE;

  return piggyBank.animate(
    [
      { rotate: upright, transformOrigin: fromItsMiddle },
      { rotate: `${-tiltDegrees}deg`, transformOrigin: fromItsMiddle, offset: tiltLeftAt },
      { rotate: `${tiltDegrees}deg`, transformOrigin: fromItsMiddle, offset: tiltRightAt },
      { rotate: upright, transformOrigin: fromItsMiddle },
    ],
    { duration: durationMs, easing: EASING.easeInOut }
  );
}

export function breathe(piggyBank: Element | null): void {
  if (!piggyBank || !canAnimate()) {
    return;
  }

  const { breaths, breathMs, wider, shorter, atRest, fromItsFeet } = PIGGY_BANK_BREATHE;

  piggyBank.animate(
    [
      { scale: atRest, transformOrigin: fromItsFeet },
      { scale: `${wider} ${shorter}`, transformOrigin: fromItsFeet },
      { scale: atRest, transformOrigin: fromItsFeet },
    ],
    { duration: breathMs, iterations: breaths, easing: EASING.easeInOut }
  );
}

export function wiggleThenBreathe(piggyBank: Element | null): void {
  if (!piggyBank || !canAnimate()) {
    return;
  }

  wiggle(piggyBank).onfinish = (): void => breathe(piggyBank);
}
