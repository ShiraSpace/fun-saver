import { TYPE_SCALE } from '../typography';

describe('type scale', () => {
  it('exposes exactly five role sizes', () => {
    expect(Object.keys(TYPE_SCALE).sort()).toEqual(
      ['body', 'display', 'heading', 'label', 'title'].sort()
    );
  });

  it('uses the consolidated px values', () => {
    expect(TYPE_SCALE).toEqual({
      display: 48,
      title: 22,
      heading: 18,
      body: 15,
      label: 12,
    });
  });
});
