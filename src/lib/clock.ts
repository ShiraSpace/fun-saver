const DATE_LENGTH = 10;

export function now(): string {
  const override = process.env.FUNSAVER_NOW;
  if (override) {
    return new Date(override).toISOString();
  }
  return new Date().toISOString();
}

export function today(): string {
  return now().slice(0, DATE_LENGTH);
}
