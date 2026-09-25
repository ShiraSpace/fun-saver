import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockAccount } from '@/test-utils/mocks/account.mocks';
import { SOURCE_MARKER_COPY } from '@/components/Method/SourceMarker/constants';
import { SOURCES_SECTION_ID } from '@/components/Method/constants';
import { useDriver } from './driver/use-driver';

const UPRIGHT = 'none';
const FLIPPED = 'matrix(-1, 0, 0, -1, 0, 0)';
const NUMBERED = 'decimal';

describe('the method page in a browser', () => {
  const { method } = useDriver({ accounts: [mockAccount] });

  beforeEach(async () => {
    await method.open();
  });

  describe('an accordion the parent has not touched', () => {
    it('keeps its chevron upright, so a shut section looks shut', async () => {
      assert.equal(
        await method.chevronRotation(method.sectionNumber('why')),
        UPRIGHT
      );
    });
  });

  describe('once the parent opens one', () => {
    beforeEach(async () => {
      await method.expand(method.sectionNumber('why'));
    });

    it('turns that chevron over, and leaves every other one alone', async () => {
      assert.equal(
        await method.chevronRotation(method.sectionNumber('why')),
        FLIPPED
      );
      assert.equal(
        await method.chevronRotation(method.sectionNumber('wallets')),
        UPRIGHT
      );
    });
  });

  describe('the sources, once opened', () => {
    beforeEach(async () => {
      await method.expand(SOURCES_SECTION_ID);
    });

    it('numbers the studies, which is what the marks in the prose point at', async () => {
      assert.equal(await method.sourceNumbering(), NUMBERED);
    });

    it('lists a row for every number the page sends the parent to', async () => {
      const rows = await method.citationCount();
      const pointed = (await method.markerNumbers())
        .flatMap((mark) => mark.split(SOURCE_MARKER_COPY.separator))
        .map(Number);

      assert.ok(pointed.length > 0);
      assert.ok(pointed.every((number) => number >= 1 && number <= rows));
    });
  });
});
