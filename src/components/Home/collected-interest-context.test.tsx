import { JSX } from 'react';
import { renderToString } from 'react-dom/server';
import { fireEvent, render, screen } from '@testing-library/react';
import { captureCookies } from '@/test-utils/cookies';
import { collectedInterestCookie } from '@/lib/cookies';
import { CollectedInterestProvider, useCollectedInterest } from './collected-interest-context';
import { COLLECTED_INTEREST_PROBE_TEST_IDS } from './constants';

const mockAccountId = 'a1';

function CollectedInterestProbe(): JSX.Element {
  const { storedCollectedInterest, saveCollectedInterest } = useCollectedInterest(mockAccountId);
  const saveSevenShekels = (): void => saveCollectedInterest(700);

  return (
    <button
      type="button"
      data-testid={COLLECTED_INTEREST_PROBE_TEST_IDS.save}
      onClick={saveSevenShekels}
    >
      <span data-testid={COLLECTED_INTEREST_PROBE_TEST_IDS.storedCollectedInterest}>
        {storedCollectedInterest}
      </span>
    </button>
  );
}

function pageRenderedWithThreeShekelsCollected(): JSX.Element {
  return (
    <CollectedInterestProvider value={{ [mockAccountId]: '300' }}>
      <CollectedInterestProbe />
    </CollectedInterestProvider>
  );
}

describe('useCollectedInterest', () => {
  captureCookies();

  describe('with a cookie of ₪5 and a server that read ₪3', () => {
    beforeEach(() => {
      document.cookie = `${collectedInterestCookie(mockAccountId)}=500`;
    });

    it('paints the server’s mark first, so the page matches the server', () => {
      const html = renderToString(pageRenderedWithThreeShekelsCollected());

      expect(html).toContain('>300<');
    });

    it('reads the cookie once the page is running', () => {
      render(pageRenderedWithThreeShekelsCollected());

      expect(
        screen.getByTestId(COLLECTED_INTEREST_PROBE_TEST_IDS.storedCollectedInterest)
      ).toHaveTextContent('500');
    });
  });

  it('reads the saved mark on a remount, not the one the page loaded with', () => {
    const { unmount } = render(pageRenderedWithThreeShekelsCollected());
    fireEvent.click(screen.getByTestId(COLLECTED_INTEREST_PROBE_TEST_IDS.save));
    unmount();

    render(pageRenderedWithThreeShekelsCollected());

    expect(
      screen.getByTestId(COLLECTED_INTEREST_PROBE_TEST_IDS.storedCollectedInterest)
    ).toHaveTextContent('700');
  });
});
