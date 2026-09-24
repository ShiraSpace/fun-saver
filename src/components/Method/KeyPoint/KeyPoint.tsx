import { JSX } from 'react';
import type { KeyPointCopy } from '../copy';
import { emphasize } from '../rich-text';
import { KEY_POINT_TEST_IDS } from './constants';
import { Icon, Note, Point, Text } from './KeyPoint.styles';

export function KeyPoint({ icon, body, note }: KeyPointCopy): JSX.Element {
  const emphasizedBody = emphasize(body);
  const noteLine = note && (
    <Note data-testid={KEY_POINT_TEST_IDS.note}>{emphasize(note)}</Note>
  );

  return (
    <Point data-testid={KEY_POINT_TEST_IDS.outcome}>
      <Icon aria-hidden="true">{icon}</Icon>
      <Text>
        {emphasizedBody}
        {noteLine}
      </Text>
    </Point>
  );
}
