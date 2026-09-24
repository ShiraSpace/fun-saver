import { fireEvent, render, screen } from '@/test-utils/render';
import { WithMenu } from '@/test-utils/menu';
import {
  APP_MODE,
  AppModeProvider,
} from '@/components/AccountManagement/app-mode-context';
import { AddAccountButton } from './AddAccountButton';
import { ACCOUNT_LIST_TEST_IDS } from '../AccountList/constants';

const mockOnLeaveMenu = jest.fn();
const mockSetMode = jest.fn();

describe('AddAccountButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <AppModeProvider value={{ mode: APP_MODE.viewing, setMode: mockSetMode }}>
        <WithMenu closeMenu={mockOnLeaveMenu}>
          <AddAccountButton />
        </WithMenu>
      </AppModeProvider>
    );
  });

  it('takes the parent out of the menu and into starting an account', () => {
    fireEvent.click(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.addAccount));

    expect(mockOnLeaveMenu).toHaveBeenCalled();
    expect(mockSetMode).toHaveBeenCalledWith(APP_MODE.creatingAccount);
  });
});
