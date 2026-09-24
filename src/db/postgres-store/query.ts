import type { NeonQueryFunction } from '@neondatabase/serverless';

export type Sql = NeonQueryFunction<false, false>;

export type QueryParam = string | number | boolean | null;

export async function queryRows<Row>(
  sql: Sql,
  text: string,
  params?: QueryParam[]
): Promise<Row[]> {
  const rows = await sql.query(text, params);
  return rows as Row[];
}
