import { neon } from '@neondatabase/serverless';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  requireEnvironmentUrl,
  chosenEnvironment,
} from './migration-environment';

async function main(): Promise<void> {
  const environment = chosenEnvironment();
  const sql = neon(requireEnvironmentUrl(environment));
  const schema = await readFile(resolve('src/db/schema.sql'), 'utf8');
  const statements = splitStatements(schema);

  await sql.transaction(statements.map((statement) => sql.query(statement)));
  console.log(`Migration complete (${environment.name} branch).`);
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
