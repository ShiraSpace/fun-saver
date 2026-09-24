import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const componentsDir = join(process.cwd(), 'src/components');

const GOOGLE_BRAND_MARK_FILE = 'SignIn/constants.ts';
const GOOGLE_BRAND_LOGO_FILE = 'SignIn/GoogleLogo.tsx';

const COLOUR_EXEMPT = [GOOGLE_BRAND_MARK_FILE, GOOGLE_BRAND_LOGO_FILE];

const STYLE_HOMES = /(\.styles\.ts|constants\.ts|-parts\.ts|\.tsx)$/;

const TEST_FILE = /\.test\.tsx?$/;

const COLOUR_LITERAL = /#[0-9A-Fa-f]{3,6}|rgba?\(|hsla?\(/;

const componentFiles = (match: RegExp): string[] =>
  readdirSync(componentsDir, { recursive: true, encoding: 'utf8' }).filter(
    (file) => match.test(file) && !TEST_FILE.test(file)
  );

const reads = (file: string): string =>
  readFileSync(join(componentsDir, file), 'utf8');

const holdsColour = (file: string): boolean => COLOUR_LITERAL.test(reads(file));

it('no style home holds a colour literal', () => {
  const offenders = componentFiles(STYLE_HOMES)
    .filter((file) => !COLOUR_EXEMPT.includes(file))
    .filter(holdsColour);
  expect(offenders).toEqual([]);
});

it('no component file imports a theme of its own, bypassing the one in use', () => {
  const offenders = componentFiles(/\.(tsx|ts)$/).filter((file) =>
    reads(file).includes('@/theme/themes/')
  );
  expect(offenders).toEqual([]);
});
