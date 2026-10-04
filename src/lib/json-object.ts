export function asObject(body: unknown): Record<string, unknown> | undefined {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return;
  }

  return body as Record<string, unknown>;
}

export function hasOnlyFields(
  body: Record<string, unknown>,
  fields: readonly string[]
): boolean {
  return Object.keys(body).every((field) => fields.includes(field));
}
