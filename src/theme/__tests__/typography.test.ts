import { TYPE_SCALE } from '../typography';

describe('type scale', () => {
  it('exposes exactly seven role sizes', () => {
    expect(Object.keys(TYPE_SCALE).sort()).toEqual(
      ['amount', 'body', 'display', 'heading', 'hero', 'label', 'title'].sort()
    );
  });

  it('uses the consolidated px values', () => {
    expect(TYPE_SCALE).toEqual({
      hero: 76,
      display: 48,
      amount: 38,
      title: 22,
      heading: 18,
      body: 15,
      label: 12,
    });
  });
});
