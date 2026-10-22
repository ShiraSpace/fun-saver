import { act } from '@testing-library/react';
import { captureAnimations, prefersMotion, prefersReducedMotion } from '@/test-utils/motion';
import { breathe, wiggleThenBreathe } from './piggy-bank-motion';
import { PIGGY_BANK_BREATHE, PIGGY_BANK_WIGGLE } from './constants';

describe("the piggy bank's motion", () => {
  const animationsPlayed = captureAnimations();
  const aBreath = expect.objectContaining({ iterations: PIGGY_BANK_BREATHE.breaths });

  beforeEach(() => {
    prefersMotion();
  });

  describe('wiggleThenBreathe where elements animate', () => {
    beforeEach(() => {
      wiggleThenBreathe(document.createElement('div'));
    });

    it('rocks the piggy bank around its middle', () => {
      const [wiggle] = animationsPlayed;

      expect(wiggle.keyframes).toEqual(
        wiggle.keyframes.map(() =>
          expect.objectContaining({ transformOrigin: PIGGY_BANK_WIGGLE.fromItsMiddle })
        )
      );
    });

    it('waits for the wiggle before breathing', () => {
      expect(animationsPlayed).toHaveLength(1);
    });

    it('breathes once the wiggle has finished', () => {
      const [wiggle] = animationsPlayed;

      act(() => wiggle.finish());

      expect(animationsPlayed.at(-1)?.options).toEqual(aBreath);
    });
  });

  describe('breathe where elements animate', () => {
    beforeEach(() => {
      breathe(document.createElement('div'));
    });

    it('breathes a few times, then rests', () => {
      const [breath] = animationsPlayed;

      expect(breath.options).toEqual(aBreath);
    });

    it('breathes wider and shorter', () => {
      const [breath] = animationsPlayed;

      expect(breath.keyframes[1].scale).toBe(
        `${PIGGY_BANK_BREATHE.wider} ${PIGGY_BANK_BREATHE.shorter}`
      );
    });

    it('breathes from its feet', () => {
      const [breath] = animationsPlayed;

      expect(breath.keyframes).toEqual(
        breath.keyframes.map(() =>
          expect.objectContaining({ transformOrigin: PIGGY_BANK_BREATHE.fromItsFeet })
        )
      );
    });
  });

  describe('when the browser asks for reduced motion', () => {
    beforeEach(() => {
      prefersReducedMotion();
    });

    it('never breathes', () => {
      breathe(document.createElement('div'));

      expect(animationsPlayed).toEqual([]);
    });

    it('never wiggles', () => {
      wiggleThenBreathe(document.createElement('div'));

      expect(animationsPlayed).toEqual([]);
    });
  });
});
