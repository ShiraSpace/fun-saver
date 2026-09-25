import { needsAgorot, shekelsText } from './money-text';

describe('whether a change is shown in agorot', () => {
  it('shows agorot on a small change that is not whole shekels', () => {
    expect(needsAgorot(9)).toBe(true);
  });

  it('keeps a small change of whole shekels in shekels', () => {
    expect(needsAgorot(500)).toBe(false);
  });

  it('keeps a change of ten shekels or more in shekels', () => {
    expect(needsAgorot(1050)).toBe(false);
  });

  it('treats a fall the same as a rise of the same size', () => {
    expect(needsAgorot(-1050)).toBe(false);
  });
});

describe('a change shown as text', () => {
  it('shows a small change to the agora, so it never reads ₪0', () => {
    expect(shekelsText(53, true)).toBe('0.53');
  });

  it('shows a change in whole shekels without agorot', () => {
    expect(shekelsText(500, false)).toBe('5');
  });
});
