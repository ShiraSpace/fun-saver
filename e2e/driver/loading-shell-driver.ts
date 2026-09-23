import { type BoundingBox } from 'puppeteer';
import { LOADING_SHELL_TEST_IDS } from '@/components/LoadingShell/constants';
import { Session } from './session';

interface MarkupPositions {
  shell: number;
  page: number;
}

const markupOf = (testId: string): string => `data-testid="${testId}"`;

export class LoadingShellDriver {
  constructor(private readonly session: Session) {}

  exists(): Promise<boolean> {
    return this.session.exists(LOADING_SHELL_TEST_IDS.shell);
  }

  keepOnScreen(path: string): Promise<void> {
    return this.session.visitWithoutScripts(path);
  }

  cardBox(): Promise<BoundingBox> {
    return this.session.box(LOADING_SHELL_TEST_IDS.card);
  }

  cardBackground(): Promise<string> {
    return this.session.computedStyle(
      LOADING_SHELL_TEST_IDS.card,
      'background-color'
    );
  }

  async positionsOnFirstLoad(
    path: string,
    pageTestId: string
  ): Promise<MarkupPositions> {
    const html = await this.session.servedHtml(path);

    return {
      shell: html.indexOf(markupOf(LOADING_SHELL_TEST_IDS.shell)),
      page: html.indexOf(markupOf(pageTestId)),
    };
  }
}
