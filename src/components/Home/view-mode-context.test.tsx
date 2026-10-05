import { JSX } from 'react';
import { renderToString } from 'react-dom/server';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { captureCookies } from '@/test-utils/cookies';
import { VIEW_MODE_COOKIE } from '@/lib/cookies';
import { VIEW_MODE } from '@/lib/account/view-mode';
import { useViewMode, ViewModeProvider } from './view-mode-context';

const VIEW_MODE_TESTID = 'shown-view-mode';
const CHOOSE_CHILD_TESTID = 'choose-child-mode';
const OTHER_READER_TESTID = 'other-reader-view-mode';

function ShownViewMode(): JSX.Element {
  const { viewMode, chooseViewMode } = useViewMode();

  return (
    <button
      type="button"
      data-testid={CHOOSE_CHILD_TESTID}
      onClick={(): void => chooseViewMode(VIEW_MODE.child)}
    >
      <span data-testid={VIEW_MODE_TESTID}>{viewMode}</span>
    </button>
  );
}

function OtherReader(): JSX.Element {
  const { viewMode } = useViewMode();

  return <span data-testid={OTHER_READER_TESTID}>{viewMode}</span>;
}

function pageRenderedInParentMode(): JSX.Element {
  return (
    <ViewModeProvider value={VIEW_MODE.parent}>
      <ShownViewMode />
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

      expect(screen.getByTestId(VIEW_MODE_TESTID)).toHaveTextContent(
        VIEW_MODE.child
      );
    });
  });

  it('tells every reader on the page when the mode is chosen', () => {
    render(
      <ViewModeProvider value={VIEW_MODE.parent}>
        <ShownViewMode />
        <OtherReader />
      </ViewModeProvider>
    );

    fireEvent.click(screen.getByTestId(CHOOSE_CHILD_TESTID));

    expect(screen.getByTestId(OTHER_READER_TESTID)).toHaveTextContent(
      VIEW_MODE.child
    );
  });

  describe('on a page rendered in parent mode', () => {
    beforeEach(() => {
      render(pageRenderedInParentMode());
    });

    it('keeps the chosen mode in the cookie, for every page on this phone', () => {
      fireEvent.click(screen.getByTestId(CHOOSE_CHILD_TESTID));

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

      expect(screen.getByTestId(VIEW_MODE_TESTID)).toHaveTextContent(
        VIEW_MODE.child
      );
    });
  });
});
