import { ValidationError } from '../errors';
import { now, today } from '../clock';

describe('clock', () => {
  const original = process.env.FUNSAVER_NOW;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.FUNSAVER_NOW;
    } else {
      process.env.FUNSAVER_NOW = original;
    }
  });

  describe('today', () => {
    it('returns the FUNSAVER_NOW override when set', () => {
      process.env.FUNSAVER_NOW = '2026-01-01';
      expect(today()).toBe('2026-01-01');
    });

    it('returns an ISO yyyy-mm-dd date by default', () => {
      delete process.env.FUNSAVER_NOW;
      expect(today()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('now', () => {
    it('returns the FUNSAVER_NOW override as a timestamp', () => {
      process.env.FUNSAVER_NOW = '2026-01-01';
      expect(now()).toBe('2026-01-01T00:00:00.000Z');
    });

    it('returns an ISO timestamp by default', () => {
      delete process.env.FUNSAVER_NOW;
      expect(now()).toMatch(/^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/);
    });

    it('refuses an override that is not a date', () => {
      process.env.FUNSAVER_NOW = 'garbage';
      expect(() => now()).toThrow(ValidationError);
    });
  });
});
