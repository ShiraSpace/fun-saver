import { canAnimate, EASING } from '@/theme/motion';
import { PIGGY_BANK_WIGGLE } from './constants';

export function wiggle(piggyBank: Element | null): void {
  if (!piggyBank || !canAnimate()) {
    return;
  }

  const { durationMs, tiltDegrees, tiltLeftAt, tiltRightAt, upright } = PIGGY_BANK_WIGGLE;

  piggyBank.animate(
    [
      { rotate: upright },
      { rotate: `${-tiltDegrees}deg`, offset: tiltLeftAt },
      { rotate: `${tiltDegrees}deg`, offset: tiltRightAt },
      { rotate: upright },
    ],
    { duration: durationMs, easing: EASING.easeInOut }
  );
}
