export type TargetName = 'production' | 'dev' | 'test';

export interface MigrationTarget {
  name: TargetName;
  envVar: string;
  url: string | undefined;
}

interface TargetSource {
  name: TargetName;
  envVar: string;
}

interface FlaggedTarget extends TargetSource {
  flag: string;
}

const FLAGGED_TARGETS: FlaggedTarget[] = [
  { name: 'test', envVar: 'TEST_DATABASE_URL', flag: '--test' },
  { name: 'dev', envVar: 'DEV_DATABASE_URL', flag: '--dev' },
];

const PRODUCTION_TARGET: TargetSource = {
  name: 'production',
  envVar: 'DATABASE_URL',
};

export function resolveTarget(): MigrationTarget {
  const source =
    FLAGGED_TARGETS.find(({ flag }) => process.argv.includes(flag)) ??
    PRODUCTION_TARGET;

  return {
    name: source.name,
    envVar: source.envVar,
    url: process.env[source.envVar],
  };
}

export function requireTargetUrl(target: MigrationTarget): string {
  if (!target.url) {
    throw new Error(`${target.envVar} is not set`);
  }

  return target.url;
}
