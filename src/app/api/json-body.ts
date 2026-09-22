export async function jsonBody(request: Request): Promise<unknown> {
  return request.json().catch(() => null);
}
