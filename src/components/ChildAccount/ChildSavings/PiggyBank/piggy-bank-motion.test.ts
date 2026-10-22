import { act } from '@testing-library/react';
import {
  elementsAnimate,
  finishAnimation,
  prefersMotion,
  prefersReducedMotion,
} from '@/test-utils/motion';
import { breathe, wiggleThenBreathe } from './piggy-bank-motion';
import { PIGGY_BANK_BREATHE, PIGGY_BANK_WIGGLE } from './constants';

describe("the piggy bank's motion", () => {
  const mockAnimate = jest.fn<Animation, [Keyframe[], KeyframeAnimationOptions?]>(
    () => ({}) as Animation
  );
  const aBreath = expect.objectContaining({ iterations: PIGGY_BANK_BREATHE.breaths });

  beforeEach(() => {
    mockAnimate.mockClear();
    prefersMotion();
    elementsAnimate(mockAnimate);
  });

  describe('wiggleThenBreathe where elements animate', () => {
    beforeEach(() => {
      wiggleThenBreathe(document.createElement('div'));
    });

    it('rocks the piggy bank around its middle', () => {
      const [wiggleKeyframes] = mockAnimate.mock.calls[0];

      expect(wiggleKeyframes.map((keyframe) => keyframe.transformOrigin)).toEqual(
        wiggleKeyframes.map(() => PIGGY_BANK_WIGGLE.fromItsMiddle)
      );
    });

    it('waits for the wiggle before breathing', () => {
      expect(mockAnimate).not.toHaveBeenCalledWith(expect.anything(), aBreath);
    });

    it('breathes once the wiggle has finished', () => {
      act(() => finishAnimation(mockAnimate.mock.results[0].value));

      expect(mockAnimate).toHaveBeenLastCalledWith(expect.anything(), aBreath);
    });
  });

  describe('breathe where elements animate', () => {
    beforeEach(() => {
      breathe(document.createElement('div'));
    });

    it('breathes a few times, then rests', () => {
      expect(mockAnimate).toHaveBeenCalledWith(expect.anything(), aBreath);
    });

    it('breathes wider and shorter', () => {
      const [breathKeyframes] = mockAnimate.mock.calls[0];

      expect(breathKeyframes[1].scale).toBe(
        `${PIGGY_BANK_BREATHE.wider} ${PIGGY_BANK_BREATHE.shorter}`
      );
    });

    it('breathes from its feet', () => {
      const [breathKeyframes] = mockAnimate.mock.calls[0];

      expect(breathKeyframes.map((keyframe) => keyframe.transformOrigin)).toEqual(
        breathKeyframes.map(() => PIGGY_BANK_BREATHE.fromItsFeet)
      );
    });
  });

  describe('when the browser asks for reduced motion', () => {
    beforeEach(() => {
      prefersReducedMotion();
    });

    it('never breathes', () => {
      breathe(document.createElement('div'));

      expect(mockAnimate).not.toHaveBeenCalled();
    });

    it('never wiggles', () => {
      wiggleThenBreathe(document.createElement('div'));

      expect(mockAnimate).not.toHaveBeenCalled();
    });
  });
});
