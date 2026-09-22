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

export async function waitForStyle({
  page,
  selector,
  property,
  value,
}: StyleWait): Promise<void> {
  await page.waitForFunction(
    (candidate, name, wanted) =>
      getComputedStyle(
        document.querySelector(candidate) as Element
      ).getPropertyValue(name) === wanted,
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
    (id, part) => {
      const element = document.querySelector(`[data-testid="${id}"]`);
      return element !== null && (element.textContent ?? '').includes(part);
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
    (id, part) => {
      const node = document.querySelector(`[data-testid="${id}"]`);
      const source =
        node?.getAttribute('src') ??
        node?.querySelector('img')?.getAttribute('src') ??
        '';
      return source.includes(part);
    },
    {},
    testId,
    expected
  );
}
