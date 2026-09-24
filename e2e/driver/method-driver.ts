import {
  METHOD_SECTION_TEST_IDS,
  type MethodSectionId,
} from '@/components/Method/MethodSection/constants';
import { SOURCE_LIST_TEST_IDS } from '@/components/Method/SourceList/constants';
import { SOURCE_MARKER_TEST_IDS } from '@/components/Method/SourceMarker/constants';
import { METHOD_ROUTE, SECTION_NUMBER } from '@/components/Method/constants';
import { AppBrowser } from './app-browser';

type SectionKey = keyof typeof SECTION_NUMBER;

export class MethodDriver {
  constructor(private readonly appBrowser: AppBrowser) {}

  open(): Promise<void> {
    return this.appBrowser.visit(METHOD_ROUTE);
  }

  expand(id: MethodSectionId): Promise<void> {
    return this.appBrowser.click(METHOD_SECTION_TEST_IDS.summary(id));
  }

  sectionNumber(section: SectionKey): number {
    return SECTION_NUMBER[section];
  }

  chevronRotation(id: MethodSectionId): Promise<string> {
    return this.appBrowser.computedStyle(
      METHOD_SECTION_TEST_IDS.chevron(id),
      'transform'
    );
  }

  sourceNumbering(): Promise<string> {
    return this.appBrowser.computedStyle(
      SOURCE_LIST_TEST_IDS.list,
      'list-style-type'
    );
  }

  markerNumbers(): Promise<string[]> {
    return this.appBrowser.texts(SOURCE_MARKER_TEST_IDS.marker);
  }

  citationCount(): Promise<number> {
    return this.appBrowser.count(SOURCE_LIST_TEST_IDS.citation);
  }
}
