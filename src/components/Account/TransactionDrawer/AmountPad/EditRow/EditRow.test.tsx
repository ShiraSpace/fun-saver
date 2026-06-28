import { fireEvent, render, screen } from '@/test-support/render';
import { EditRow } from './EditRow';
import { AMOUNT_PAD_COPY, AMOUNT_PAD_TEST_IDS } from '../constants';

const onClear = jest.fn();
const onBackspace = jest.fn();

describe('EditRow', () => {
  beforeEach(() => {
    onClear.mockClear();
    onBackspace.mockClear();
    render(<EditRow onClear={onClear} onBackspace={onBackspace} />);
  });

  it('clears when the clear key is tapped', () => {
    fireEvent.click(screen.getByTestId(AMOUNT_PAD_TEST_IDS.clear));

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('backspaces when the delete key is tapped', () => {
    fireEvent.click(screen.getByTestId(AMOUNT_PAD_TEST_IDS.backspace));

    expect(onBackspace).toHaveBeenCalledTimes(1);
  });

  it('labels the keys with their copy', () => {
    expect(screen.getByTestId(AMOUNT_PAD_TEST_IDS.clear)).toHaveTextContent(
      AMOUNT_PAD_COPY.clear
    );
    expect(screen.getByTestId(AMOUNT_PAD_TEST_IDS.backspace)).toHaveTextContent(
      AMOUNT_PAD_COPY.backspace
    );
  });
});
