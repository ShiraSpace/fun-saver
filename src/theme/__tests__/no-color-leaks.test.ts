import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const componentsDir = join(process.cwd(), 'src/components');

const THEME_SWATCHES_FILE = 'Menu/AppearanceSection/constants.ts';
const GOOGLE_BRAND_MARK_FILE = 'SignIn/constants.ts';

const HEX_EXEMPT = [THEME_SWATCHES_FILE, GOOGLE_BRAND_MARK_FILE];

const componentFiles = (match: RegExp): string[] =>
  readdirSync(componentsDir, { recursive: true, encoding: 'utf8' }).filter(
    (file) => match.test(file)
  );

const reads = (file: string): string =>
  readFileSync(join(componentsDir, file), 'utf8');

const holdsHex = (file: string): boolean =>
  /#[0-9A-Fa-f]{3,6}/.test(reads(file));

it('component constants hold no theme hex', () => {
  const offenders = componentFiles(/constants\.ts$/)
    .filter((file) => !HEX_EXEMPT.includes(file))
    .filter(holdsHex);
  expect(offenders).toEqual([]);
});

it('component styles hold no theme hex', () => {
  const offenders = componentFiles(/\.styles\.ts$/).filter(holdsHex);
  expect(offenders).toEqual([]);
});

it('no component file imports from @/theme/palette', () => {
  const offenders = componentFiles(/\.(tsx|ts)$/).filter((file) =>
    reads(file).includes('@/theme/palette')
  );
  expect(offenders).toEqual([]);
});
