import { ValidationError } from './errors';

const DATE_LENGTH = 10;

export function now(): string {
  const override = process.env.FUNSAVER_NOW;

  if (!override) {
    return new Date().toISOString();
  }

  const overridden = new Date(override);

  if (Number.isNaN(overridden.getTime())) {
    throw new ValidationError(`FUNSAVER_NOW is not a date: ${override}`);
  }

  return overridden.toISOString();
}

export function today(): string {
  return now().slice(0, DATE_LENGTH);
}
