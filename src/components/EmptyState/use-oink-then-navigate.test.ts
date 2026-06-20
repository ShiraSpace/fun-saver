import { act, renderHook } from '@testing-library/react';
import { useOinkThenNavigate } from './use-oink-then-navigate';

const push = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: (): { push: jest.Mock } => ({ push }),
}));

type FakeClick = {
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  button: number;
  preventDefault: jest.Mock;
};

function clickEvent(overrides: Partial<FakeClick> = {}): FakeClick {
  return {
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    button: 0,
    preventDefault: jest.fn(),
    ...overrides,
  };
}

describe('useOinkThenNavigate', () => {
  beforeEach(() => push.mockClear());

  it('oinks on a plain click without navigating yet', () => {
    const { result } = renderHook(() => useOinkThenNavigate('/?create=1'));
    const event = clickEvent();

    act(() => result.current.onCtaClick(event as never));

    expect(event.preventDefault).toHaveBeenCalled();
    expect(result.current.isOinking).toBe(true);
    expect(push).not.toHaveBeenCalled();
  });

  it('navigates once the pig is done oinking', () => {
    const { result } = renderHook(() => useOinkThenNavigate('/?create=1'));

    act(() => result.current.onPigDoneOinking());

    expect(push).toHaveBeenCalledWith('/?create=1');
  });

  it('lets modified clicks navigate natively', () => {
    const { result } = renderHook(() => useOinkThenNavigate('/?create=1'));
    const event = clickEvent({ metaKey: true });

    act(() => result.current.onCtaClick(event as never));

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(result.current.isOinking).toBe(false);
  });
});
