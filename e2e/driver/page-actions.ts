import { type Page } from 'puppeteer';
import { THEME_COOKIE } from '@/lib/cookies';
import { findByTest, requireMatch } from './page-element';

interface TypedInput {
  page: Page;
  testId: string;
  value: string;
}

interface StoredTheme {
  page: Page;
  url: string;
  themeId: string;
}

interface NthMatch {
  page: Page;
  selector: string;
  index: number;
}

export async function click(page: Page, testId: string): Promise<void> {
  const element = await findByTest(page, testId);
  await element.click();
}

export async function hover(page: Page, testId: string): Promise<void> {
  const element = await findByTest(page, testId);
  await element.hover();
}

export async function type({ page, testId, value }: TypedInput): Promise<void> {
  const element = await findByTest(page, testId);
  await element.type(value);
}

export async function replace({
  page,
  testId,
  value,
}: TypedInput): Promise<void> {
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

export async function clickNth({
  page,
  selector,
  index,
}: NthMatch): Promise<void> {
  const elements = await page.$$(selector);
  const element = elements[index];

  if (!element) {
    throw new Error(`no element at index ${index} for "${selector}"`);
  }

  await element.click();
}

export async function visitWithoutScripts(
  page: Page,
  url: string
): Promise<void> {
  await page.setJavaScriptEnabled(false);
  await page.goto(url, { waitUntil: 'networkidle0' });
}

export async function setDocumentTheme(
  page: Page,
  themeId: string
): Promise<void> {
  await page.evaluate((id: string): void => {
    document.documentElement.dataset.theme = id;
  }, themeId);
}

export async function storeTheme({
  page,
  url,
  themeId,
}: StoredTheme): Promise<void> {
  await page.setCookie({ name: THEME_COOKIE, value: themeId, url });
}
