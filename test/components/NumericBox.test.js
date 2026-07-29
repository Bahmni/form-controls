import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NumericBox } from 'components/NumericBox.jsx';
import constants from 'src/constants';
import { Error } from 'src/Error';

describe('NumericBox', () => {
  const onChangeMock = jest.fn();
  const validations = [constants.validations.allowDecimal, constants.validations.mandatory];

  beforeEach(() => {
    onChangeMock.mockClear();
  });

  it('should render NumericBox with empty class when conceptClass is not Computed', () => {
    const concept = {};
    render(
      <NumericBox
        concept={concept}
        formFieldPath="test1.1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveValue(null);
    expect(input).not.toHaveClass('computed-value');
    expect(input).not.toHaveClass('form-builder-error');
  });

  it('should render NumericBox with default value', () => {
    const concept = {};
    render(
      <NumericBox
        concept={concept}
        formFieldPath="test1.1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
        value="50"
      />
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveValue(50);
  });

  it('should render NumericBox with computed-value class when conceptClass is Computed', () => {
    render(
      <NumericBox
        conceptClass="Computed"
        formFieldPath="test1.1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
        value="50"
      />
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveValue(50);
    expect(input).toHaveClass('computed-value');
  });

  it('should call onChange when user enters value in NumericBox', () => {
    const concept = {};
    render(
      <NumericBox
        concept={concept}
        formFieldPath="test1.1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
        value="50"
      />
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '999' } });

    expect(onChangeMock).toHaveBeenCalledWith({ value: '999', errors: [] });
  });

  it('should show error class and call onChange with errors when validation fails', () => {
    const concept = {};
    render(
      <NumericBox
        concept={concept}
        formFieldPath="test1.1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={validations}
      />
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '50.32' } });

    const allowDecimalError = new Error({ message: validations[0] });
    expect(onChangeMock).toHaveBeenCalledWith({
      value: '50.32',
      errors: [allowDecimalError],
    });
    expect(input).toHaveClass('form-builder-error');
  });

  it('should validate Numeric box when validate is set to true', () => {
    const concept = {};
    const { rerender } = render(
      <NumericBox
        concept={concept}
        formFieldPath="test1.1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={validations}
      />
    );

    rerender(
      <NumericBox
        concept={concept}
        formFieldPath="test1.1-0"
        onChange={onChangeMock}
        validate
        validateForm={false}
        validations={validations}
        value="98.6"
      />
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveClass('form-builder-error');
  });

  it('should show errors after mount if the formFieldPath suffix is not 0', () => {
    const concept = {};
    render(
      <NumericBox
        concept={concept}
        formFieldPath="test1.1/1-1"
        onChange={onChangeMock}
        validate
        validateForm={false}
        validations={validations}
        value="98.6"
      />
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveClass('form-builder-error');
  });

  it('should not show errors after mount if the formFieldPath suffix is 0', () => {
    const concept = {};
    render(
      <NumericBox
        concept={concept}
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={validations}
      />
    );

    const input = screen.getByRole('spinbutton');
    expect(input).not.toHaveClass('form-builder-error');
  });

  it('should show warning when value is not in normal range', () => {
    const numericContext = { hiNormal: 50, lowNormal: 20 };
    render(
      <NumericBox
        {...numericContext}
        formFieldPath="test1.1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={validations}
      />
    );

    const allowRangeWarning = new Error({
      type: constants.errorTypes.warning,
      message: constants.validations.allowRange,
    });

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '51' } });

    expect(onChangeMock).toHaveBeenCalledWith({
      value: '51',
      errors: [allowRangeWarning],
    });
  });

  it('should show error when value is not in absolute range', () => {
    const numericContext = { hiAbsolute: 50, lowAbsolute: 20 };
    render(
      <NumericBox
        {...numericContext}
        formFieldPath="test1.1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={validations}
        value="21"
      />
    );

    const allowRangeError = new Error({
      type: constants.errorTypes.error,
      message: constants.validations.minMaxRange,
    });

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '51' } });

    expect(onChangeMock).toHaveBeenCalledWith({
      value: '51',
      errors: [allowRangeError],
    });
  });

  it('should update input value when component value changes', () => {
    const { rerender } = render(
      <NumericBox
        formFieldPath="test1.1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={validations}
        value="22"
      />
    );

    let input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(22);

    rerender(
      <NumericBox
        formFieldPath="test1.1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={validations}
        value="10"
      />
    );

    input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(10);
  });

  it('should show as disabled when NumericBox is set to be disabled', () => {
    render(
      <NumericBox
        enabled={false}
        formFieldPath="test1.1/1-0"
        onChange={() => {}}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toBeDisabled();
  });

  it('should show as enabled when NumericBox is set to be enabled', () => {
    render(
      <NumericBox
        enabled
        formFieldPath="test1.1/1-0"
        onChange={() => {}}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toBeEnabled();
  });

  it('should show as disabled when NumericBox with range is set to be disabled', () => {
    render(
      <NumericBox
        enabled={false}
        formFieldPath="test1.1/1-0"
        hiNormal={20}
        lowNormal={10}
        onChange={() => {}}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toBeDisabled();
  });

  it('should show as enabled when NumericBox with range is set to be enabled', () => {
    render(
      <NumericBox
        enabled
        formFieldPath="test1.1/1-0"
        hiNormal={20}
        lowNormal={10}
        onChange={() => {}}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toBeEnabled();
  });

  it('should display range indicator when hiNormal and lowNormal are provided', () => {
    render(
      <NumericBox
        enabled
        formFieldPath="test1.1/1-0"
        hiNormal={20}
        lowNormal={10}
        onChange={() => {}}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    const rangeIndicator = screen.getByText('(10 - 20)');
    expect(rangeIndicator).toBeInTheDocument();
    expect(rangeIndicator).toHaveClass('form-builder-valid-range');
  });

  it('should call onChange when mounting component with defined value', () => {
    render(
      <NumericBox
        formFieldPath="test1.1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
        value="30"
      />
    );

    expect(onChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        value: '30',
        triggerControlEvent: false,
        calledOnMount: true,
      })
    );
  });

  it('should not call onChange when mounting component with undefined value', () => {
    render(
      <NumericBox
        enabled
        formFieldPath="test1.1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
        value={undefined}
      />
    );

    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it('should call onChange when value prop changes', () => {
    const { rerender } = render(
      <NumericBox
        formFieldPath="test1.1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    onChangeMock.mockClear();

    rerender(
      <NumericBox
        formFieldPath="test1.1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
        value="20"
      />
    );

    expect(onChangeMock).toHaveBeenCalledWith({ value: '20', errors: [] });
  });

  it('should initialize with errors when formFieldPath indicates AddMore creation and validation errors exist', () => {
    render(
      <NumericBox
        formFieldPath="test1.1-1"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={validations}
        value="98.6"
      />
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveClass('form-builder-error');
  });

  it('should handle componentDidUpdate when errors exist and call onChange', () => {
    const { rerender } = render(
      <NumericBox
        formFieldPath="test1.1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
        value="50"
      />
    );

    onChangeMock.mockClear();

    rerender(
      <NumericBox
        formFieldPath="test1.1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={validations}
        value="98.6"
      />
    );

    expect(onChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        value: '98.6',
      })
    );
  });

  it('should handle componentDidUpdate with undefined value', () => {
    const { rerender } = render(
      <NumericBox
        formFieldPath="test1.1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
        value="50"
      />
    );

    onChangeMock.mockClear();

    rerender(
      <NumericBox
        formFieldPath="test1.1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
        value={undefined}
      />
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(null);
  });

  it('should handle value trimming in handleChange - empty string becomes undefined', () => {
    render(
      <NumericBox
        formFieldPath="test1.1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '   ' } });

    expect(onChangeMock).toHaveBeenCalledWith({ value: undefined, errors: [] });
  });

  it('should not initialize with errors when formFieldPath suffix is 0 even with validation errors', () => {
    render(
      <NumericBox
        formFieldPath="test1.1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={validations}
        value="98.6"
      />
    );

    const input = screen.getByRole('spinbutton');
    expect(input).not.toHaveClass('form-builder-error');
  });

  describe('hidden → visible validation trigger', () => {
    it('shouldComponentUpdate returns true when hidden transitions true → false', () => {
      const { rerender } = render(
        <NumericBox
          formFieldPath="test1.1-0"
          hidden
          onChange={onChangeMock}
          validate={false}
          validateForm={false}
          validations={[]}
        />
      );
      onChangeMock.mockClear();
      rerender(
        <NumericBox
          formFieldPath="test1.1-0"
          hidden={false}
          onChange={onChangeMock}
          validate={false}
          validateForm={false}
          validations={[]}
        />
      );
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('componentDidUpdate calls onChange with errors when hidden→visible with validateForm true', () => {
      const { rerender } = render(
        <NumericBox
          formFieldPath="test1.1-0"
          hidden
          onChange={onChangeMock}
          validate={false}
          validateForm
          validations={[constants.validations.mandatory]}
        />
      );
      onChangeMock.mockClear();
      rerender(
        <NumericBox
          formFieldPath="test1.1-0"
          hidden={false}
          onChange={onChangeMock}
          validate={false}
          validateForm
          validations={[constants.validations.mandatory]}
        />
      );
      expect(onChangeMock).toHaveBeenCalledWith(
        expect.objectContaining({ calledOnMount: true })
      );
    });

    it('componentDidUpdate does not fire the hidden→visible block when validateForm is false', () => {
      const { rerender } = render(
        <NumericBox
          formFieldPath="test1.1-0"
          hidden
          onChange={onChangeMock}
          validate={false}
          validateForm={false}
          validations={[constants.validations.mandatory]}
          value="42"
        />
      );
      onChangeMock.mockClear();
      rerender(
        <NumericBox
          formFieldPath="test1.1-0"
          hidden={false}
          onChange={onChangeMock}
          validate={false}
          validateForm={false}
          validations={[constants.validations.mandatory]}
          value="42"
        />
      );
      const callsWithCalledOnMount = onChangeMock.mock.calls.filter(
        ([arg]) => arg && arg.calledOnMount
      );
      expect(callsWithCalledOnMount).toHaveLength(0);
    });
  });

  it('should not trigger componentDidUpdate input update when input value matches prop value', () => {
    const { rerender } = render(
      <NumericBox
        formFieldPath="test1.1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
        value="25"
      />
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(25);

    onChangeMock.mockClear();

    rerender(
      <NumericBox
        formFieldPath="test1.1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
        value="25"
        enabled={false}
      />
    );

    expect(onChangeMock).not.toHaveBeenCalled();
  });
});
