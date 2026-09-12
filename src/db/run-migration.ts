import { neon } from '@neondatabase/serverless';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

type TargetName = 'main' | 'dev' | 'test';

interface MigrationTarget {
  name: TargetName;
  envVar: string;
  url: string | undefined;
}

function resolveTarget(): MigrationTarget {
  return testTarget() ?? devTarget() ?? mainTarget();
}

function testTarget(): MigrationTarget | undefined {
  if (!process.argv.includes('--test')) {
    return undefined;
  }

  return {
    name: 'test',
    envVar: 'TEST_DATABASE_URL',
    url: process.env.TEST_DATABASE_URL,
  };
}

function devTarget(): MigrationTarget | undefined {
  if (!process.argv.includes('--dev')) {
    return undefined;
  }

  return {
    name: 'dev',
    envVar: 'DEV_DATABASE_URL',
    url: process.env.DEV_DATABASE_URL,
  };
}

function mainTarget(): MigrationTarget {
  return {
    name: 'main',
    envVar: 'DATABASE_URL',
    url: process.env.DATABASE_URL,
  };
}

async function main(): Promise<void> {
  const target = resolveTarget();

  if (!target.url) throw new Error(`${target.envVar} is not set`);
  const url = target.url;

  const sql = neon(url);
  const schema = await readFile(resolve('src/db/schema.sql'), 'utf8');
  const statements = splitStatements(schema);
  await sql.transaction(statements.map((statement) => sql.query(statement)));
  console.log(`Migration complete (${target.name} branch).`);
}

const SQL_BLOCK_COMMENT = /\/\*[\s\S]*?\*\//g;
const SQL_LINE_COMMENT = /--[^\n]*/g;
const STATEMENT_SEPARATOR = ';';

function splitStatements(schema: string): string[] {
  return stripComments(schema)
    .split(STATEMENT_SEPARATOR)
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0);
}

function stripComments(schema: string): string {
  return schema.replace(SQL_BLOCK_COMMENT, '').replace(SQL_LINE_COMMENT, '');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
