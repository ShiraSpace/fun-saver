import { renderHook } from '@/test-utils/render';
import { prefersReducedMotion } from '@/test-utils/motion';
import { useAnimatedWalletTotal } from './use-animated-wallet-total';

const WALLET_TOTAL = 35900;

describe('useAnimatedWalletTotal when the browser asks for reduced motion', () => {
  let animatedWalletTotal: number;

  beforeEach(() => {
    prefersReducedMotion();
    animatedWalletTotal = renderHook(() => useAnimatedWalletTotal(WALLET_TOTAL))
      .result.current;
  });

  it('shows the whole total straight away', () => {
    expect(animatedWalletTotal).toBe(WALLET_TOTAL);
  });
});
