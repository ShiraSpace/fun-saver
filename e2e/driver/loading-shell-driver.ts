import { type BoundingBox } from 'puppeteer';
import { LOADING_SHELL_TEST_IDS } from '@/components/LoadingShell/constants';
import { AppBrowser } from './app-browser';

interface MarkupPositions {
  shell: number;
  page: number;
}

const markupOf = (testId: string): string => `data-testid="${testId}"`;

export class LoadingShellDriver {
  constructor(private readonly appBrowser: AppBrowser) {}

  exists(): Promise<boolean> {
    return this.appBrowser.exists(LOADING_SHELL_TEST_IDS.shell);
  }

  keepOnScreen(path: string): Promise<void> {
    return this.appBrowser.visitWithoutScripts(path);
  }

  cardBox(): Promise<BoundingBox> {
    return this.appBrowser.box(LOADING_SHELL_TEST_IDS.card);
  }

  cardBackground(): Promise<string> {
    return this.appBrowser.computedStyle(
      LOADING_SHELL_TEST_IDS.card,
      'background-color'
    );
  }

  async positionsOnFirstLoad(
    path: string,
    pageTestId: string
  ): Promise<MarkupPositions> {
    const html = await this.appBrowser.servedHtml(path);

    return {
      shell: html.indexOf(markupOf(LOADING_SHELL_TEST_IDS.shell)),
      page: html.indexOf(markupOf(pageTestId)),
    };
  }
}
