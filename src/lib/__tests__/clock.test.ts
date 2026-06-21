import { today } from '../clock';

describe('today', () => {
  const original = process.env.FUNSAVER_NOW;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.FUNSAVER_NOW;
    } else {
      process.env.FUNSAVER_NOW = original;
    }
  });

  it('returns the FUNSAVER_NOW override when set', () => {
    process.env.FUNSAVER_NOW = '2026-01-01';
    expect(today()).toBe('2026-01-01');
  });

  it('returns an ISO yyyy-mm-dd date by default', () => {
    delete process.env.FUNSAVER_NOW;
    expect(today()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
