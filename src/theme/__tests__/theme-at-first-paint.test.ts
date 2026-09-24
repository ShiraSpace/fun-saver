import { THEME_COOKIE } from '@/lib/cookies';
import {
  applyStoredThemeScript,
  everyThemeAsCss,
  themeVar,
} from '../theme-at-first-paint';
import { DEFAULT_THEME_ID, THEMES, THEME_ID } from '../registry';

const blockFor = (themeId: string): string => {
  const scoped = new RegExp(`:root\\[data-theme='${themeId}'\\]\\{([^}]*)\\}`);

  return everyThemeAsCss().match(scoped)?.[1] ?? '';
};

describe('the theme at first paint', () => {
  describe('publishing every theme as css', () => {
    it('publishes a block for every theme in the registry', () => {
      const published = Object.keys(THEMES).filter(
        (themeId) => blockFor(themeId) !== ''
      );

      expect(published).toEqual(Object.keys(THEMES));
    });

    it('publishes every colour a theme declares, whatever group it lives in', () => {
      for (const [themeId, theme] of Object.entries(THEMES)) {
        const block = blockFor(themeId);

        for (const [group, tokens] of Object.entries(theme)) {
          if (group === 'typography') {
            continue;
          }

          for (const value of Object.values(tokens)) {
            expect(block).toContain(String(value));
          }
        }
      }
    });

    it('dresses a document that has no theme yet in the default one', () => {
      expect(everyThemeAsCss()).toContain(
        `:root,:root[data-theme='${DEFAULT_THEME_ID}']{`
      );
    });
  });

  describe('naming a theme variable', () => {
    it('names the property the published css declares, with that theme’s value', () => {
      const property = themeVar('colors', 'surface').slice('var('.length, -1);
      const surface = THEMES[THEME_ID.midnightBlue].colors.surface;

      expect(blockFor(THEME_ID.midnightBlue)).toContain(
        `${property}:${surface}`
      );
    });
  });

  describe('applying the stored theme', () => {
    const applyStoredTheme = (stored?: string): string | undefined => {
      if (stored !== undefined) {
        document.cookie = `${THEME_COOKIE}=${stored}`;
      }

      new Function(applyStoredThemeScript())();

      return document.documentElement.dataset.theme;
    };

    beforeEach(() => {
      document.cookie = `${THEME_COOKIE}=; max-age=0`;
      delete document.documentElement.dataset.theme;
    });

    it('applies the theme stored in the cookie', () => {
      expect(applyStoredTheme(THEME_ID.midnightBlue)).toBe(
        THEME_ID.midnightBlue
      );
    });

    it('falls back to the default when nothing is stored', () => {
      expect(applyStoredTheme()).toBe(DEFAULT_THEME_ID);
    });

    it('falls back to the default when the stored theme is unknown', () => {
      expect(applyStoredTheme('not-a-theme')).toBe(DEFAULT_THEME_ID);
    });

    it('never applies a stored value that is trying to inject markup', () => {
      expect(applyStoredTheme('"><script>bad()</script>')).toBe(
        DEFAULT_THEME_ID
      );
    });
  });

  describe('what the script leaves on the page', () => {
    const mockUnknownTheme = 'not-a-theme';
    let script: HTMLScriptElement;

    beforeEach(() => {
      document.cookie = `${THEME_COOKIE}=${mockUnknownTheme}`;
      script = document.createElement('script');
      script.textContent = applyStoredThemeScript();
      document.head.append(script);
    });

    afterEach(() => {
      script.remove();
      Reflect.deleteProperty(window, 'funSaverThemeCookie');
      Reflect.deleteProperty(window, 'funSaverThemeId');
      document.cookie = `${THEME_COOKIE}=; max-age=0`;
      delete document.documentElement.dataset.theme;
    });

    it('names the stored cookie funSaverThemeCookie, even when it holds no theme', () => {
      expect(Reflect.get(window, 'funSaverThemeCookie')).toBe(mockUnknownTheme);
    });

    it('names the theme it applied funSaverThemeId', () => {
      expect(Reflect.get(window, 'funSaverThemeId')).toBe(DEFAULT_THEME_ID);
    });

    it('leaves no name on the page that another script might also use', () => {
      const genericNames = ['c', 't', 'themeCookie', 'themeId'];

      expect(genericNames.filter((name) => Reflect.has(window, name))).toEqual(
        []
      );
    });
  });
});
