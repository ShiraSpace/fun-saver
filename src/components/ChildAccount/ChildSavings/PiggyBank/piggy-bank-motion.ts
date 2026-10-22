import { canAnimate } from '@/theme/motion';
import { PIGGY_BANK_WIGGLE } from './constants';

export function wiggle(piggyBank: Element | null): void {
  if (!piggyBank || !canAnimate()) {
    return;
  }

  const { durationMs, tiltDegrees, tiltLeftAt, tiltRightAt } = PIGGY_BANK_WIGGLE;

  piggyBank.animate(
    [
      { rotate: '0deg' },
      { rotate: `${-tiltDegrees}deg`, offset: tiltLeftAt },
      { rotate: `${tiltDegrees}deg`, offset: tiltRightAt },
      { rotate: '0deg' },
    ],
    { duration: durationMs, easing: 'ease-in-out' }
  );
}
