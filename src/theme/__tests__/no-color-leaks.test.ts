import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const componentsDir = join(process.cwd(), 'src/components');

// ponytail: the only constants file allowed hex -- it holds the theme swatches
const SWATCH_FILE = 'Menu/AppearanceSection/constants.ts';

const componentFiles = (match: RegExp): string[] =>
  readdirSync(componentsDir, { recursive: true, encoding: 'utf8' }).filter(
    (file) => match.test(file)
  );

const reads = (file: string): string =>
  readFileSync(join(componentsDir, file), 'utf8');

it('component constants hold no theme hex', () => {
  const offenders = componentFiles(/constants\.ts$/)
    .filter((file) => file !== SWATCH_FILE)
    .filter((file) => /#[0-9A-Fa-f]{3,6}/.test(reads(file)));
  expect(offenders).toEqual([]);
});

it('no component file imports from @/theme/palette', () => {
  const offenders = componentFiles(/\.(tsx|ts)$/).filter((file) =>
    reads(file).includes('@/theme/palette')
  );
  expect(offenders).toEqual([]);
});
