export function asObject(body: unknown): Record<string, unknown> | undefined {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return;
  }

  return body as Record<string, unknown>;
}
