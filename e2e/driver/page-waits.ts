import { type Page } from 'puppeteer';
import { findByTest } from './page-element';

interface StyleWait {
  page: Page;
  selector: string;
  property: string;
  value: string;
}

interface ElementWait {
  page: Page;
  testId: string;
}

interface ContentWait {
  page: Page;
  testId: string;
  expected: string;
}

export async function waitForTestId({
  page,
  testId,
}: ElementWait): Promise<void> {
  await findByTest(page, testId);
}

export async function waitForAnyTestId(
  page: Page,
  testIds: readonly string[]
): Promise<void> {
  await page.waitForSelector(
    testIds.map((testId) => `[data-testid="${testId}"]`).join(', ')
  );
}

export async function waitForStyle({
  page,
  selector,
  property,
  value,
}: StyleWait): Promise<void> {
  await page.waitForFunction(
    (selector, property, expected) =>
      getComputedStyle(
        document.querySelector(selector) as Element
      ).getPropertyValue(property) === expected,
    {},
    selector,
    property,
    value
  );
}

export async function waitForText({
  page,
  testId,
  expected,
}: ContentWait): Promise<void> {
  await page.waitForFunction(
    (testId, expected) => {
      const element = document.querySelector(`[data-testid="${testId}"]`);
      return element !== null && (element.textContent ?? '').includes(expected);
    },
    {},
    testId,
    expected
  );
}

export async function waitForImageSource({
  page,
  testId,
  expected,
}: ContentWait): Promise<void> {
  await page.waitForFunction(
    (testId, expected) => {
      const node = document.querySelector(`[data-testid="${testId}"]`);
      const source =
        node?.getAttribute('src') ??
        node?.querySelector('img')?.getAttribute('src') ??
        '';
      return source.includes(expected);
    },
    {},
    testId,
    expected
  );
}
