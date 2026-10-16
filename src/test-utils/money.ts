import { agorotToWholeShekels } from '@/lib/money';
import { MONEY_COPY } from '@/components/Money/constants';
import { STILL_TO_SAVE_COPY } from '@/components/Goal/StillToSave/constants';

export function moneyAsShown(amountAgorot: number): string {
  return `${MONEY_COPY.currencySign}${agorotToWholeShekels(amountAgorot)}`;
}

export function stillToSaveAsShown(
  stillToSave: number,
  cheer: string = STILL_TO_SAVE_COPY.after
): string {
  return `${STILL_TO_SAVE_COPY.before} ${moneyAsShown(stillToSave)} ${cheer}`;
}
