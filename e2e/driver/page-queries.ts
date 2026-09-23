import { type BoundingBox, type MediaFeature, type Page } from 'puppeteer';
import { findByTest, queryAllByTest, queryByTest } from './page-element';

export type MotionPreference = 'reduce' | 'no-preference';

export function motionFeatures(motion: MotionPreference): MediaFeature[] {
  return [{ name: 'prefers-reduced-motion', value: motion }];
}

export function currentPath(page: Page): string {
  return new URL(page.url()).pathname;
}

export function signedInUserId(page: Page): Promise<string> {
  return page.evaluate(async (): Promise<string> => {
    const response = await fetch('/api/auth/session');
    const session = await response.json();

    return session?.user?.id ?? '';
  });
}

export async function canTakeFocus(
  page: Page,
  testId: string
): Promise<boolean> {
  const element = await findByTest(page, testId);

  return element.evaluate((node) => {
    if (!(node instanceof HTMLElement)) {
      return false;
    }

    node.focus();

    return document.activeElement === node;
  });
}

export async function exists(page: Page, testId: string): Promise<boolean> {
  return (await queryByTest(page, testId)) !== null;
}

export async function count(page: Page, testId: string): Promise<number> {
  return (await queryAllByTest(page, testId)).length;
}

export async function text(page: Page, testId: string): Promise<string> {
  const element = await findByTest(page, testId);
  return element.evaluate((node) => node.textContent ?? '');
}

export async function texts(page: Page, testId: string): Promise<string[]> {
  const elements = await queryAllByTest(page, testId);

  return Promise.all(
    elements.map((element) =>
      element.evaluate((node) => node.textContent ?? '')
    )
  );
}

export async function value(page: Page, testId: string): Promise<string> {
  const element = await findByTest(page, testId);
  return element.evaluate((node) => (node as HTMLInputElement).value);
}

export async function imageSource(page: Page, testId: string): Promise<string> {
  const element = await findByTest(page, testId);

  return element.evaluate(
    (node) =>
      node.getAttribute('src') ??
      node.querySelector('img')?.getAttribute('src') ??
      ''
  );
}

export async function box(page: Page, testId: string): Promise<BoundingBox> {
  const element = await findByTest(page, testId);
  const boundingBox = await element.boundingBox();

  if (!boundingBox) {
    throw new Error(`element "${testId}" has no bounding box`);
  }

  return boundingBox;
}

export function hasVerticalScroll(page: Page): Promise<boolean> {
  return page.evaluate(
    () => document.scrollingElement!.scrollHeight > window.innerHeight
  );
}

interface StyleQuery {
  page: Page;
  selector: string;
  property: string;
}

interface TestIdStyleQuery {
  page: Page;
  testId: string;
  property: string;
}

export function styleOf({
  page,
  selector,
  property,
}: StyleQuery): Promise<string> {
  return page.$eval(
    selector,
    (element, name) => getComputedStyle(element).getPropertyValue(name),
    property
  );
}

export function computedStyle({
  page,
  testId,
  property,
}: TestIdStyleQuery): Promise<string> {
  return styleOf({ page, selector: `[data-testid="${testId}"]`, property });
}

export interface TapQuery {
  page: Page;
  testId: string;
  x: number;
  y: number;
}

export function receivesTapAt({
  page,
  testId,
  x,
  y,
}: TapQuery): Promise<boolean> {
  return page.evaluate(
    (tap) => {
      const tapped = document.elementFromPoint(tap.x, tap.y);
      const target = document.querySelector(`[data-testid="${tap.testId}"]`);

      return target?.contains(tapped) ?? false;
    },
    { testId, x, y }
  );
}

export async function styleValues(
  page: Page,
  testId: string,
  property: string
): Promise<string[]> {
  const elements = await queryAllByTest(page, testId);

  return Promise.all(
    elements.map((element) =>
      element.evaluate(
        (node, name) => getComputedStyle(node).getPropertyValue(name),
        property
      )
    )
  );
}
