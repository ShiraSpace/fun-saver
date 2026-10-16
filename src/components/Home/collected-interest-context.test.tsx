import { JSX } from 'react';
import { renderToString } from 'react-dom/server';
import { fireEvent, render, screen } from '@testing-library/react';
import { captureCookies } from '@/test-utils/cookies';
import { mockAccountId } from '@/test-utils/mocks/account.mocks';
import { collectedInterestCookie } from '@/lib/cookies';
import { CollectedInterestProvider, useCollectedInterest } from './collected-interest-context';
import { COLLECTED_INTEREST_PROBE_TEST_IDS } from './constants';

const mockServerCollectedInterest = '300';
const mockSavedCollectedInterest = 700;

interface CollectedInterestProbeProps {
  onRead?: (storedCollectedInterest: string | undefined) => void;
}

function CollectedInterestProbe({ onRead }: CollectedInterestProbeProps): JSX.Element {
  const { storedCollectedInterest, readStoredCollectedInterest, saveCollectedInterest } =
    useCollectedInterest(mockAccountId);
  const save = (): void => saveCollectedInterest(mockSavedCollectedInterest);
  const read = (): void => onRead?.(readStoredCollectedInterest());

  return (
    <>
      <button type="button" data-testid={COLLECTED_INTEREST_PROBE_TEST_IDS.save} onClick={save}>
        <span data-testid={COLLECTED_INTEREST_PROBE_TEST_IDS.storedCollectedInterest}>
          {storedCollectedInterest}
        </span>
      </button>
      <button type="button" data-testid={COLLECTED_INTEREST_PROBE_TEST_IDS.read} onClick={read} />
    </>
  );
}

function pageRenderedWithServerMark(onRead?: CollectedInterestProbeProps['onRead']): JSX.Element {
  return (
    <CollectedInterestProvider value={{ [mockAccountId]: mockServerCollectedInterest }}>
      <CollectedInterestProbe onRead={onRead} />
    </CollectedInterestProvider>
  );
}

function shownStoredCollectedInterest(): HTMLElement {
  return screen.getByTestId(COLLECTED_INTEREST_PROBE_TEST_IDS.storedCollectedInterest);
}

describe('useCollectedInterest', () => {
  captureCookies();

  describe('with a cookie that differs from the mark the server read', () => {
    const mockCookieCollectedInterest = '500';

    beforeEach(() => {
      document.cookie = `${collectedInterestCookie(mockAccountId)}=${mockCookieCollectedInterest}`;
    });

    it('paints the server’s mark first, so the page matches the server', () => {
      const html = renderToString(pageRenderedWithServerMark());

      expect(html).toContain(`>${mockServerCollectedInterest}<`);
    });

    it('reads the cookie once the page is running', () => {
      render(pageRenderedWithServerMark());

      expect(shownStoredCollectedInterest()).toHaveTextContent(mockCookieCollectedInterest);
    });
  });

  it('reads the saved mark on a remount, not the one the page loaded with', () => {
    const { unmount } = render(pageRenderedWithServerMark());
    fireEvent.click(screen.getByTestId(COLLECTED_INTEREST_PROBE_TEST_IDS.save));
    unmount();

    render(pageRenderedWithServerMark());

    expect(shownStoredCollectedInterest()).toHaveTextContent(String(mockSavedCollectedInterest));
  });

  it('reads a mark another tab saved since the last render', () => {
    const mockOtherTabCollectedInterest = '900';
    const mockOnRead = jest.fn();
    render(pageRenderedWithServerMark(mockOnRead));
    document.cookie = `${collectedInterestCookie(mockAccountId)}=${mockOtherTabCollectedInterest}`;

    fireEvent.click(screen.getByTestId(COLLECTED_INTEREST_PROBE_TEST_IDS.read));

    expect(mockOnRead).toHaveBeenCalledWith(mockOtherTabCollectedInterest);
  });
});
