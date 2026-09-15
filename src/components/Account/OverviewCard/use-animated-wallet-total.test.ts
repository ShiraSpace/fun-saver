import { renderHook } from '@testing-library/react';
import { prefersMotion, prefersReducedMotion } from '@/test-utils/motion';
import { useAnimatedWalletTotal } from './use-animated-wallet-total';

const walletTotal = 35900;

describe('useAnimatedWalletTotal', () => {
  it('starts from nothing when the browser allows motion', () => {
    prefersMotion();

    const { result } = renderHook(() => useAnimatedWalletTotal(walletTotal));
    const nothing = 0;

    expect(result.current).toBe(nothing);
  });

  it('shows the whole total straight away when the browser asks for reduced motion', () => {
    prefersReducedMotion();

    const { result } = renderHook(() => useAnimatedWalletTotal(walletTotal));

    expect(result.current).toBe(walletTotal);
  });
});
