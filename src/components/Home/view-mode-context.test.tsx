import { JSX } from 'react';
import { renderToString } from 'react-dom/server';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { captureCookies } from '@/test-utils/cookies';
import { VIEW_MODE_COOKIE } from '@/lib/cookies';
import { VIEW_MODE } from '@/lib/view-mode';
import { useViewMode, ViewModeProvider } from './view-mode-context';
import { VIEW_MODE_PROBE_TEST_IDS } from './constants';

function ChildModeChooser(): JSX.Element {
  const { viewMode, chooseViewMode } = useViewMode();
  const chooseChildMode = (): void => chooseViewMode(VIEW_MODE.child);

  return (
    <button
      type="button"
      data-testid={VIEW_MODE_PROBE_TEST_IDS.chooseChild}
      onClick={chooseChildMode}
    >
      <span data-testid={VIEW_MODE_PROBE_TEST_IDS.viewMode}>{viewMode}</span>
    </button>
  );
}

function ViewModeReader(): JSX.Element {
  const { viewMode } = useViewMode();

  return (
    <span data-testid={VIEW_MODE_PROBE_TEST_IDS.otherReader}>{viewMode}</span>
  );
}

function pageRenderedInParentMode(): JSX.Element {
  return (
    <ViewModeProvider value={VIEW_MODE.parent}>
      <ChildModeChooser />
    </ViewModeProvider>
  );
}

describe('useViewMode', () => {
  const written = captureCookies();

  describe('with a cookie that says child and a server that said parent', () => {
    beforeEach(() => {
      document.cookie = `${VIEW_MODE_COOKIE}=${VIEW_MODE.child}`;
    });

    it('paints the server’s mode first, so the page matches the server', () => {
      const html = renderToString(pageRenderedInParentMode());

      expect(html).toContain(`>${VIEW_MODE.parent}<`);
    });

    it('shows the mode in the cookie once the page is running', () => {
      render(pageRenderedInParentMode());

      expect(
        screen.getByTestId(VIEW_MODE_PROBE_TEST_IDS.viewMode)
      ).toHaveTextContent(VIEW_MODE.child);
    });
  });

  it('tells every reader on the page when the mode is chosen', () => {
    render(
      <ViewModeProvider value={VIEW_MODE.parent}>
        <ChildModeChooser />
        <ViewModeReader />
      </ViewModeProvider>
    );

    fireEvent.click(screen.getByTestId(VIEW_MODE_PROBE_TEST_IDS.chooseChild));

    expect(
      screen.getByTestId(VIEW_MODE_PROBE_TEST_IDS.otherReader)
    ).toHaveTextContent(VIEW_MODE.child);
  });

  describe('on a page rendered in parent mode', () => {
    beforeEach(() => {
      render(pageRenderedInParentMode());
    });

    it('keeps the chosen mode in the cookie, for every page on this phone', () => {
      fireEvent.click(screen.getByTestId(VIEW_MODE_PROBE_TEST_IDS.chooseChild));

      expect(written).toContainEqual(
        expect.stringContaining(`${VIEW_MODE_COOKIE}=${VIEW_MODE.child}`)
      );
    });

    it.each([
      ['visibilitychange', document],
      ['pageshow', window],
    ])('picks up a mode chosen elsewhere on %s', (eventName, eventTarget) => {
      document.cookie = `${VIEW_MODE_COOKIE}=${VIEW_MODE.child}`;
      act(() => {
        eventTarget.dispatchEvent(new Event(eventName));
      });

      expect(
        screen.getByTestId(VIEW_MODE_PROBE_TEST_IDS.viewMode)
      ).toHaveTextContent(VIEW_MODE.child);
    });
  });
});
