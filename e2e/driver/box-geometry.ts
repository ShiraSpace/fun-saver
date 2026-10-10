import { type BoundingBox } from 'puppeteer';

export const bottomOf = (box: BoundingBox): number => box.y + box.height;

export const rightOf = (box: BoundingBox): number => box.x + box.width;

export const holds = (outer: BoundingBox, inner: BoundingBox): boolean =>
  inner.x >= outer.x &&
  rightOf(inner) <= rightOf(outer) &&
  inner.y >= outer.y &&
  bottomOf(inner) <= bottomOf(outer);
