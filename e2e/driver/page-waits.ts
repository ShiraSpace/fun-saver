import { type Page } from 'puppeteer';
import { findByTest } from './page-element';

interface PseudoStyleChange {
  testId: string;
  pseudo: string;
  property: string;
  from: string;
}

export class PageWaits {
  constructor(private readonly currentPage: () => Page) {}

  async testId(testId: string): Promise<void> {
    await findByTest(this.currentPage(), testId);
  }

  async testIdGone(testId: string): Promise<void> {
    await this.currentPage().waitForSelector(`[data-testid="${testId}"]`, {
      hidden: true,
    });
  }

  async anyTestId(testIds: readonly string[]): Promise<void> {
    await this.currentPage().waitForSelector(
      testIds.map((testId) => `[data-testid="${testId}"]`).join(', ')
    );
  }

  async style(selector: string, property: string, value: string): Promise<void> {
    await this.currentPage().waitForFunction(
      (selector, property, expected) =>
        getComputedStyle(document.querySelector(selector) as Element).getPropertyValue(property) ===
        expected,
      {},
      selector,
      property,
      value
    );
  }

  async pseudoStyleChange({ testId, pseudo, property, from }: PseudoStyleChange): Promise<void> {
    await this.currentPage().waitForFunction(
      (testId, pseudo, property, from) => {
        const element = document.querySelector(`[data-testid="${testId}"]`);
        return (
          element !== null && getComputedStyle(element, pseudo).getPropertyValue(property) !== from
        );
      },
      {},
      testId,
      pseudo,
      property,
      from
    );
  }

  async text(testId: string, expected: string): Promise<void> {
    await this.currentPage().waitForFunction(
      (testId, expected) => {
        const element = document.querySelector(`[data-testid="${testId}"]`);
        return element !== null && (element.textContent ?? '').includes(expected);
      },
      {},
      testId,
      expected
    );
  }

  async imageSource(testId: string, expected: string): Promise<void> {
    await this.currentPage().waitForFunction(
      (testId, expected) => {
        const node = document.querySelector(`[data-testid="${testId}"]`);
        const source =
          node?.getAttribute('src') ?? node?.querySelector('img')?.getAttribute('src') ?? '';
        return source.includes(expected);
      },
      {},
      testId,
      expected
    );
  }

  async navigation(): Promise<void> {
    await this.currentPage().waitForNavigation({
      waitUntil: 'domcontentloaded',
    });
  }
}
