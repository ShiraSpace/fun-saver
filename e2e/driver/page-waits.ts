import { type Page } from 'puppeteer';

export async function waitForStyle(
  page: Page,
  selector: string,
  property: string,
  value: string
): Promise<void> {
  await page.waitForFunction(
    (candidate, name, expected) =>
      getComputedStyle(
        document.querySelector(candidate) as Element
      ).getPropertyValue(name) === expected,
    {},
    selector,
    property,
    value
  );
}

export async function waitForText(
  page: Page,
  testId: string,
  expected: string
): Promise<void> {
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

export async function waitForImageSource(
  page: Page,
  testId: string,
  fragment: string
): Promise<void> {
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
    fragment
  );
}
