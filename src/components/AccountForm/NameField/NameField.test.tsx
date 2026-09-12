import { fireEvent, render, screen } from '@/test-support/render';
import { MAX_ACCOUNT_NAME_LENGTH } from '@/lib/constants';
import { NameField } from './NameField';
import { NAME_FIELD_COPY, NAME_FIELD_TEST_IDS } from './constants';

const mockName = 'נועה';
const mockOnChange = jest.fn();

function renderField(value = ''): void {
  render(
    <NameField
      value={value}
      onChange={mockOnChange}
      maxLength={MAX_ACCOUNT_NAME_LENGTH}
    />
  );
}

describe('NameField', () => {
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe('empty', () => {
    beforeEach(() => {
      renderField();
    });

    it('labels the input', () => {
      expect(screen.getByTestId(NAME_FIELD_TEST_IDS.label)).toHaveTextContent(
        NAME_FIELD_COPY.label
      );
    });

    it('reports typing through onChange', () => {
      fireEvent.change(screen.getByTestId(NAME_FIELD_TEST_IDS.input), {
        target: { value: 'מ' },
      });

      expect(mockOnChange).toHaveBeenCalledWith('מ');
    });

    it('stops the browser at the name length cap', () => {
      expect(screen.getByTestId(NAME_FIELD_TEST_IDS.input)).toHaveAttribute(
        'maxlength',
        String(MAX_ACCOUNT_NAME_LENGTH)
      );
    });
  });

  describe('with a value', () => {
    beforeEach(() => {
      renderField(mockName);
    });

    it('shows the provided value', () => {
      expect(screen.getByTestId(NAME_FIELD_TEST_IDS.input)).toHaveValue(
        mockName
      );
    });
  });
});
