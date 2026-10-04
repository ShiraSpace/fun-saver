import { render, screen } from '@/test-utils/render';
import { prefersMotion, prefersReducedMotion } from '@/test-utils/motion';
import { LAYERS } from '@/theme/layers';
import { THEME_ID, getThemeTokens } from '@/theme/registry';
import { Celebration } from './Celebration';
import { CELEBRATION_TEST_IDS } from './constants';

describe('Celebration', () => {
  let celebration: HTMLElement;
  let firstPiece: HTMLElement;

  beforeEach(() => {
    render(<Celebration />);
    celebration = screen.getByTestId(CELEBRATION_TEST_IDS.celebration);
    [firstPiece] = screen.getAllByTestId(CELEBRATION_TEST_IDS.piece);
  });

  it('hides the celebration from screen readers', () => {
    expect(celebration).toHaveAttribute('aria-hidden', 'true');
  });

  it('lets a tap through to the cards under it', () => {
    expect(getComputedStyle(celebration).pointerEvents).toBe('none');
  });

  it('drops every piece the mockup drops', () => {
    const mockupPieceCount = 60;

    expect(screen.getAllByTestId(CELEBRATION_TEST_IDS.piece)).toHaveLength(
      mockupPieceCount
    );
  });

  it('lets each piece fall for its own time after its own wait', () => {
    expect(firstPiece).toHaveStyle({
      animationDuration: '2600ms',
      animationDelay: '4000ms',
    });
  });

  it('places each piece where the mockup does, at its own size', () => {
    expect(firstPiece).toHaveStyle({
      right: '32%',
      width: '6px',
      height: '14px',
    });
  });

  it('fades the whole celebration out once the pieces have fallen', () => {
    expect(celebration).toHaveStyle({
      animationDuration: '800ms',
      animationDelay: '9200ms',
    });
  });

  it('sits over the header and under the drawer', () => {
    const layer = Number(getComputedStyle(celebration).zIndex);

    expect(layer).toBeGreaterThan(LAYERS.overlayForeground);
    expect(layer).toBeLessThan(LAYERS.modal);
  });
});

describe('Celebration in a theme other than the default', () => {
  let pieces: HTMLElement[];

  beforeEach(() => {
    render(<Celebration />, { themeId: THEME_ID.midnightBlue });
    pieces = screen.getAllByTestId(CELEBRATION_TEST_IDS.piece);
  });

  it("colours the pieces with that theme's celebration colours in turn", () => {
    const { colors } = getThemeTokens(THEME_ID.midnightBlue);
    const [first, second, , , , , seventh] = pieces;

    expect(first).toHaveStyle({ backgroundColor: colors.celebrationGold });
    expect(second).toHaveStyle({ backgroundColor: colors.celebrationPink });
    expect(seventh).toHaveStyle({ backgroundColor: colors.celebrationGold });
  });
});

describe('Celebration when the device asks for reduced motion', () => {
  beforeEach(() => {
    prefersReducedMotion();
    render(<Celebration />);
  });

  afterEach(() => {
    prefersMotion();
  });

  it('draws nothing', () => {
    expect(
      screen.queryByTestId(CELEBRATION_TEST_IDS.celebration)
    ).not.toBeInTheDocument();
  });
});
