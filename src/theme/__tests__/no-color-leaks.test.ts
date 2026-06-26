import { readFileSync } from 'fs';
import { join } from 'path';

const FILES = [
  'Account/WalletCard/constants.ts',
  'Account/CoinRow/constants.ts',
  'Account/WalletHero/constants.ts',
  'Account/TransactionDrawer/constants.ts',
  'Account/TransactionDrawer/DepositSplit/constants.ts',
  'Menu/AccountsSection/constants.ts',
];

const ALLOW = new Set(['#FFFFFF', '#E8ECEF', '#A6AEB5', '#6C7681', '#5B6570', '#3A4750']);

it('migrated component constants hold no theme hex', () => {
  for (const rel of FILES) {
    const src = readFileSync(join(process.cwd(), 'src/components', rel), 'utf8');
    const hex = src.match(/#[0-9A-Fa-f]{3,6}/g) ?? [];
    expect(hex.filter((h) => !ALLOW.has(h.toUpperCase()))).toEqual([]);
  }
});
