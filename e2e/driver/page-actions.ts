import { type Page } from 'puppeteer';
import { findByTest, requireMatch } from './page-element';

export async function click(page: Page, testId: string): Promise<void> {
  const element = await findByTest(page, testId);
  await element.click();
}

export async function hover(page: Page, testId: string): Promise<void> {
  const element = await findByTest(page, testId);
  await element.hover();
}

export async function type(
  page: Page,
  testId: string,
  value: string
): Promise<void> {
  const element = await findByTest(page, testId);
  await element.type(value);
}

export async function replace(
  page: Page,
  testId: string,
  value: string
): Promise<void> {
  const element = await findByTest(page, testId);
  await element.click();
  await element.evaluate((node) => (node as HTMLInputElement).select());
  await element.type(value);
}

export async function clickSelector(
  page: Page,
  selector: string
): Promise<void> {
  const element = await requireMatch(page, selector);
  await element.click();
}

export async function hoverSelector(
  page: Page,
  selector: string
): Promise<void> {
  const element = await requireMatch(page, selector);
  await element.hover();
}

export async function clickNth(
  page: Page,
  selector: string,
  index: number
): Promise<void> {
  const elements = await page.$$(selector);
  const element = elements[index];

  if (!element) {
    throw new Error(`no element at index ${index} for "${selector}"`);
  }

  await element.click();
}
