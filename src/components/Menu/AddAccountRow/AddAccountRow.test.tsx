import { fireEvent, render, screen } from '@/test-utils/render';
import {
  APP_MODE,
  AppModeProvider,
} from '@/components/AccountManagement/app-mode-context';
import { AddAccountRow } from './AddAccountRow';
import { ACCOUNT_LIST_TEST_IDS } from '../AccountList/constants';
import { mockMenu } from '@/test-utils/fixtures';
import { MenuProvider } from '../use-menu-state';

const mockOnLeaveMenu = jest.fn();
const mockSetMode = jest.fn();

describe('AddAccountRow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <AppModeProvider value={{ mode: APP_MODE.viewing, setMode: mockSetMode }}>
        <MenuProvider value={{ ...mockMenu, close: mockOnLeaveMenu }}>
          <AddAccountRow />
        </MenuProvider>
      </AppModeProvider>
    );
  });

  it('takes the parent out of the menu and into starting an account', () => {
    fireEvent.click(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.addRow));

    expect(mockOnLeaveMenu).toHaveBeenCalled();
    expect(mockSetMode).toHaveBeenCalledWith(APP_MODE.creatingAccount);
  });
});
