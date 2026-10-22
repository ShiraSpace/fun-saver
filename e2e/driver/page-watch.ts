import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import { type Page, type ScreenRecorder } from 'puppeteer';

export class PageWatch {
  constructor(private readonly currentPage: () => Page) {}

  record(path: `${string}.webm`): Promise<ScreenRecorder> {
    return this.currentPage().screencast({ path, ffmpegPath });
  }

  captureErrors(): string[] {
    const errorsLogged: string[] = [];
    const page = this.currentPage();

    page.on('console', (message) => {
      if (message.type() === 'error') {
        errorsLogged.push(message.text());
      }
    });
    page.on('pageerror', (error) => errorsLogged.push(String(error)));

    return errorsLogged;
  }
}
