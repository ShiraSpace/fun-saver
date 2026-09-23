import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockAccount } from '@/test-utils/fixtures';
import { SOURCES_SECTION_ID } from '@/components/Method/constants';
import { useDriver } from './driver/use-driver';

const UPRIGHT = 'none';
const FLIPPED = 'matrix(-1, 0, 0, -1, 0, 0)';
const NUMBERED = 'decimal';

describe('the method page in a browser', () => {
  const { method } = useDriver({ accounts: [mockAccount] });

  describe('an accordion the parent has not touched', () => {
    it('keeps its chevron upright, so a shut section looks shut', async () => {
      await method.open();

      assert.equal(
        await method.chevronRotation(method.sectionId('why')),
        UPRIGHT
      );
    });
  });

  describe('once the parent opens one', () => {
    it('turns that chevron over, and leaves every other one alone', async () => {
      await method.open();
      await method.expand(method.sectionId('why'));

      assert.equal(
        await method.chevronRotation(method.sectionId('why')),
        FLIPPED
      );
      assert.equal(
        await method.chevronRotation(method.sectionId('wallets')),
        UPRIGHT
      );
    });
  });

  describe('the sources, once opened', () => {
    it('numbers the studies, which is what the marks in the prose point at', async () => {
      await method.open();
      await method.expand(SOURCES_SECTION_ID);

      assert.equal(await method.sourceNumbering(), NUMBERED);
    });

    it('lists a row for every number the page sends the parent to', async () => {
      await method.open();
      await method.expand(SOURCES_SECTION_ID);

      const rows = await method.citationCount();
      const pointed = (await method.markerNumbers())
        .flatMap((mark) => mark.split(','))
        .map(Number);

      assert.ok(pointed.length > 0);
      assert.ok(pointed.every((number) => number >= 1 && number <= rows));
    });
  });
});
