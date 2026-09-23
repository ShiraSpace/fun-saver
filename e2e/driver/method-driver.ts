import { METHOD_SECTION_TEST_IDS } from '@/components/Method/MethodSection/constants';
import { SOURCE_LIST_TEST_IDS } from '@/components/Method/SourceList/constants';
import { SOURCE_MARKER_TEST_IDS } from '@/components/Method/SourceMarker/constants';
import {
  METHOD_ROUTE,
  SECTION_NUMBER,
  SOURCES_SECTION_ID,
} from '@/components/Method/constants';
import { Session } from './session';

type SectionKey = keyof typeof SECTION_NUMBER;
type AccordionId = number | typeof SOURCES_SECTION_ID;

export class MethodDriver {
  constructor(private readonly session: Session) {}

  open(): Promise<void> {
    return this.session.visit(METHOD_ROUTE);
  }

  expand(id: AccordionId): Promise<void> {
    return this.session.click(METHOD_SECTION_TEST_IDS.summary(id));
  }

  sectionId(section: SectionKey): number {
    return SECTION_NUMBER[section];
  }

  chevronRotation(id: AccordionId): Promise<string> {
    return this.session.computedStyle(
      METHOD_SECTION_TEST_IDS.chevron(id),
      'transform'
    );
  }

  sourceNumbering(): Promise<string> {
    return this.session.computedStyle(
      SOURCE_LIST_TEST_IDS.list,
      'list-style-type'
    );
  }

  markerNumbers(): Promise<string[]> {
    return this.session.texts(SOURCE_MARKER_TEST_IDS.marker);
  }

  citationCount(): Promise<number> {
    return this.session.count(SOURCE_LIST_TEST_IDS.citation);
  }
}
