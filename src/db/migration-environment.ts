export type EnvironmentName = 'production' | 'dev' | 'test';

export interface MigrationEnvironment {
  name: EnvironmentName;
  envVar: string;
  url: string | undefined;
}

interface EnvironmentConfig {
  name: EnvironmentName;
  envVar: string;
}

interface FlaggedEnvironment extends EnvironmentConfig {
  flag: string;
}

const FLAGGED_ENVIRONMENTS: FlaggedEnvironment[] = [
  { name: 'test', envVar: 'TEST_DATABASE_URL', flag: '--test' },
  { name: 'dev', envVar: 'DEV_DATABASE_URL', flag: '--dev' },
];

const PRODUCTION_ENVIRONMENT: EnvironmentConfig = {
  name: 'production',
  envVar: 'DATABASE_URL',
};

export function chosenEnvironment(): MigrationEnvironment {
  const source =
    FLAGGED_ENVIRONMENTS.find(({ flag }) => process.argv.includes(flag)) ??
    PRODUCTION_ENVIRONMENT;

  return {
    name: source.name,
    envVar: source.envVar,
    url: process.env[source.envVar],
  };
}

export function requireEnvironmentUrl(
  environment: MigrationEnvironment
): string {
  if (!environment.url) {
    throw new Error(`${environment.envVar} is not set`);
  }

  return environment.url;
}
