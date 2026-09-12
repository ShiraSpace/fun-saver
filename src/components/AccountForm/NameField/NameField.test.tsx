import { fireEvent, render, screen } from '@/test-support/render';
import { MAX_ACCOUNT_NAME_LENGTH } from '@/lib/constants';
import { NameField } from './NameField';
import { NAME_FIELD_COPY, NAME_FIELD_TEST_IDS } from './constants';

describe('NameField', () => {
  const noop = (): void => {};

  it('labels the input', () => {
    render(
      <NameField value="" onChange={noop} maxLength={MAX_ACCOUNT_NAME_LENGTH} />
    );
    expect(screen.getByTestId(NAME_FIELD_TEST_IDS.label)).toHaveTextContent(
      NAME_FIELD_COPY.label
    );
  });

  it('shows the provided value', () => {
    render(
      <NameField
        value="נועה"
        onChange={noop}
        maxLength={MAX_ACCOUNT_NAME_LENGTH}
      />
    );
    expect(screen.getByTestId(NAME_FIELD_TEST_IDS.input)).toHaveValue('נועה');
  });

  it('reports typing through onChange', () => {
    const onChange = jest.fn();
    render(
      <NameField
        value=""
        onChange={onChange}
        maxLength={MAX_ACCOUNT_NAME_LENGTH}
      />
    );

    fireEvent.change(screen.getByTestId(NAME_FIELD_TEST_IDS.input), {
      target: { value: 'מ' },
    });

    expect(onChange).toHaveBeenCalledWith('מ');
  });

  it('stops the browser at the name length cap', () => {
    render(
      <NameField value="" onChange={noop} maxLength={MAX_ACCOUNT_NAME_LENGTH} />
    );

    expect(screen.getByTestId(NAME_FIELD_TEST_IDS.input)).toHaveAttribute(
      'maxlength',
      String(MAX_ACCOUNT_NAME_LENGTH)
    );
  });
});
