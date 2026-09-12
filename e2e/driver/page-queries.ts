import { type BoundingBox, type Page } from 'puppeteer';
import { findByTest, queryAllByTest, queryByTest } from './page-element';

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
