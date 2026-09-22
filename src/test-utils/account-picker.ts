import { fireEvent, screen } from '@/test-utils/render';
import { ACCOUNT_PICKER_TEST_IDS } from '@/components/Menu/AccountPicker/constants';

export function openAccountPicker(): void {
  fireEvent.click(screen.getByTestId(ACCOUNT_PICKER_TEST_IDS.trigger));
}
