import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const CONSTANT_FILES = [
  'Account/WalletCard/constants.ts',
  'Account/CoinRow/constants.ts',
  'Account/WalletHero/constants.ts',
  'Account/TransactionDrawer/constants.ts',
  'Account/TransactionDrawer/DepositSplit/constants.ts',
  'Menu/AccountsSection/constants.ts',
];

const ALLOW = new Set(['#FFFFFF', '#E8ECEF', '#A6AEB5', '#6C7681', '#5B6570', '#3A4750']);

it('migrated component constants hold no theme hex', () => {
  for (const rel of CONSTANT_FILES) {
    const src = readFileSync(join(process.cwd(), 'src/components', rel), 'utf8');
    const hex = src.match(/#[0-9A-Fa-f]{3,6}/g) ?? [];
    expect(hex.filter((h) => !ALLOW.has(h.toUpperCase()))).toEqual([]);
  }
});

function collectFiles(dir: string, ext: RegExp): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...collectFiles(full, ext));
    } else if (ext.test(entry)) {
      results.push(full);
    }
  }
  return results;
}

it('no component file imports from @/theme/palette', () => {
  const componentsDir = join(process.cwd(), 'src/components');
  const files = collectFiles(componentsDir, /\.(tsx|ts)$/);
  const offenders = files.filter((f) =>
    readFileSync(f, 'utf8').includes('@/theme/palette'),
  );
  expect(offenders).toEqual([]);
});
