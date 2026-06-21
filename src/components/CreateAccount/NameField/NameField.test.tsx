import { fireEvent, render, screen } from '@/test-support/render';
import { NameField } from './NameField';
import { NAME_FIELD_COPY, NAME_FIELD_TEST_IDS } from './constants';

describe('NameField', () => {
  const noop = (): void => {};

  it('labels the input', () => {
    render(<NameField value="" onChange={noop} />);
    expect(screen.getByTestId(NAME_FIELD_TEST_IDS.label)).toHaveTextContent(
      NAME_FIELD_COPY.label
    );
  });

  it('shows the provided value', () => {
    render(<NameField value="נועה" onChange={noop} />);
    expect(screen.getByTestId(NAME_FIELD_TEST_IDS.input)).toHaveValue('נועה');
  });

  it('reports typing through onChange', () => {
    const onChange = jest.fn();
    render(<NameField value="" onChange={onChange} />);

    fireEvent.change(screen.getByTestId(NAME_FIELD_TEST_IDS.input), {
      target: { value: 'מ' },
    });

    expect(onChange).toHaveBeenCalledWith('מ');
  });
});
