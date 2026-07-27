import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NumericBox } from 'src/components/bahmni-design-system/NumericBox';
import constants from 'src/constants';
import { Error } from 'src/Error';
import { Validator } from 'src/helpers/Validator';

describe('NumericBox', () => {
  const onChangeMock = jest.fn();

  beforeEach(() => {
    onChangeMock.mockClear();
  });

  it('should render NumericBox', () => {
    const { container } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    const input = container.querySelector('input[type="number"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'number');
  });

  it('should render NumericBox with default value', () => {
    const { container } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
        value={42}
      />
    );

    const input = container.querySelector('input[type="number"]');
    expect(input).toHaveValue(42);
  });

  it('should get user entered numeric value', () => {
    const { container } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
        value={42}
      />
    );

    const input = container.querySelector('input[type="number"]');
    fireEvent.change(input, { target: { value: '50' } });

    expect(onChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 50,
        triggerControlEvent: true,
      })
    );
  });

  it('should handle string input and convert to number', () => {
    const { container } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    const input = container.querySelector('input[type="number"]');
    fireEvent.change(input, { target: { value: '75' } });

    expect(onChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 75,
      })
    );
  });

  it('should handle null value and display as empty', () => {
    const { container } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
        value={null}
      />
    );

    const input = container.querySelector('input[type="number"]');
    expect(input).toHaveValue(null);
  });

  it('should display empty when value is undefined', () => {
    const { container } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    const input = container.querySelector('input[type="number"]');
    expect(input).toHaveValue(null);
  });

  it('should display normal range when both lowNormal and hiNormal are provided', () => {
    const { container } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
        lowNormal={5}
        hiNormal={10}
      />
    );

    const rangeSpan = container.querySelector('.obs-numeric-range');
    expect(rangeSpan).toBeInTheDocument();
    expect(rangeSpan).toHaveTextContent('(5 - 10)');
  });

  it('should display only lowNormal when hiNormal is not provided', () => {
    const { container } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
        lowNormal={5}
      />
    );

    const rangeSpan = container.querySelector('.obs-numeric-range');
    expect(rangeSpan).toBeInTheDocument();
    expect(rangeSpan).toHaveTextContent('(> 5)');
  });

  it('should display only hiNormal when lowNormal is not provided', () => {
    const { container } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
        hiNormal={10}
      />
    );

    const rangeSpan = container.querySelector('.obs-numeric-range');
    expect(rangeSpan).toBeInTheDocument();
    expect(rangeSpan).toHaveTextContent('(< 10)');
  });

  it('should not display range when neither lowNormal nor hiNormal are provided', () => {
    const { container } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    const rangeSpan = container.querySelector('.obs-numeric-range');
    expect(rangeSpan).not.toBeInTheDocument();
  });

  it('should show as disabled when enabled prop is false', () => {
    const { container } = render(
      <NumericBox
        enabled={false}
        formFieldPath="test1.1/1-0"
        onChange={() => {}}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    const input = container.querySelector('input[type="number"]');
    expect(input).toBeDisabled();
  });

  it('should be enabled by default', () => {
    const { container } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={() => {}}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    const input = container.querySelector('input[type="number"]');
    expect(input).not.toBeDisabled();
  });

  it('should trigger onChange when mounting component with a value', () => {
    render(
      <NumericBox
        formFieldPath="test1.1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
        value={42}
      />
    );

    expect(onChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 42,
        triggerControlEvent: false,
        calledOnMount: true,
      })
    );
  });

  it('should trigger onChange on mount with validateForm even when value is undefined', () => {
    render(
      <NumericBox
        formFieldPath="test1.1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={true}
        validations={[]}
      />
    );

    expect(onChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        value: undefined,
        triggerControlEvent: false,
        calledOnMount: true,
      })
    );
  });

  it('should validate when validate prop becomes true', () => {
    const validations = [constants.validations.mandatory];

    const { container, rerender } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={validations}
      />
    );

    onChangeMock.mockClear();

    rerender(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={true}
        validateForm={false}
        validations={validations}
      />
    );

    const input = container.querySelector('input[type="number"]');
    // When validate=true and value is undefined, the NumberInput should be marked as invalid
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('should receive validations prop and use it for error checking', () => {
    const customValidation = { type: 'test' };
    const { container } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={true}
        validations={[customValidation]}
      />
    );

    // Verify component renders with validations
    const input = container.querySelector('input[type="number"]');
    expect(input).toBeInTheDocument();

    // onChange should be called on mount with validateForm=true
    expect(onChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: expect.any(Array),
      })
    );
  });

  it('should validate with mandatory validation on form validation', () => {
    const { container } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={true}
        validations={[constants.validations.mandatory]}
      />
    );

    // Component should call onChange on mount with validateForm=true
    // and include validation errors
    expect(onChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        value: undefined,
        errors: expect.any(Array),
      })
    );

    const input = container.querySelector('input[type="number"]');
    expect(input).toBeInTheDocument();
  });

  it('should handle value as string and convert to number', () => {
    const { container } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
        value="42"
      />
    );

    const input = container.querySelector('input[type="number"]');
    expect(input.value).toBe('42');
  });

  it('should render with proper wrapper class', () => {
    const { container } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    const wrapper = container.querySelector('.obs-numeric-text-wrap');
    expect(wrapper).toBeInTheDocument();
  });

  it('should pass through additional props to NumberInput', () => {
    const { container } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
        placeholder="Enter value"
        min={0}
        max={100}
      />
    );

    const input = container.querySelector('input[type="number"]');
    expect(input).toHaveAttribute('placeholder', 'Enter value');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
  });

  it('should handle null value gracefully', () => {
    const { container } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
        value={null}
      />
    );

    const input = container.querySelector('input[type="number"]');
    expect(input).toHaveValue(null);
  });

  it('should validate with custom validations', () => {
    const customValidation = { type: 'test' };
    const { container } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[customValidation]}
      />
    );

    const input = container.querySelector('input[type="number"]');
    fireEvent.change(input, { target: { value: '50' } });

    expect(onChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 50,
        errors: expect.any(Array),
      })
    );
  });

  it('should validate with minMaxRange when normal limits are provided', () => {
    const { container } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
        lowNormal={5}
        hiNormal={10}
      />
    );

    const input = container.querySelector('input[type="number"]');
    fireEvent.change(input, { target: { value: '15' } });

    expect(onChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 15,
        errors: expect.any(Array),
      })
    );
  });

  it('should initialize with hasErrors set to false on mount', () => {
    const { container } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[constants.validations.mandatory]}
      />
    );

    const input = container.querySelector('input[type="number"]');
    // On mount, hasErrors is initialized to false
    expect(input).not.toHaveAttribute('aria-invalid', 'true');
  });

  it('should not show errors on mount when formFieldPath has suffix 0', () => {
    const { container } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[constants.validations.mandatory]}
        value={42}
      />
    );

    const input = container.querySelector('input[type="number"]');
    // On mount with a valid value, should not be marked as invalid
    expect(input).not.toHaveAttribute('aria-invalid', 'true');
  });

  it('should call onChange with initial value on mount', () => {
    render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
        value={42}
      />
    );

    // First render should call onChange on mount with initial value
    expect(onChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 42,
        calledOnMount: true,
      })
    );
  });

  it('should handle decimal values', () => {
    const { container } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    const input = container.querySelector('input[type="number"]');
    fireEvent.change(input, { target: { value: '42.5' } });

    expect(onChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 42.5,
      })
    );
  });

  it('should handle negative values', () => {
    const { container } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    const input = container.querySelector('input[type="number"]');
    fireEvent.change(input, { target: { value: '-5' } });

    expect(onChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        value: -5,
      })
    );
  });

  it('should handle zero value', () => {
    const { container } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
        value={10}
      />
    );

    const input = container.querySelector('input[type="number"]');
    fireEvent.change(input, { target: { value: '0' } });

    expect(onChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 0,
        triggerControlEvent: true,
      })
    );
  });

  it('should display normal range with lowNormal as 0', () => {
    const { container } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
        lowNormal={0}
        hiNormal={10}
      />
    );

    const rangeSpan = container.querySelector('.obs-numeric-range');
    expect(rangeSpan).toBeInTheDocument();
    expect(rangeSpan).toHaveTextContent('(0 - 10)');
  });

  it('should display updated value when external setValue changes field from empty to populated', () => {
    const { container, rerender } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    expect(container.querySelector('input[type="number"]')).toHaveValue(null);

    rerender(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[]}
        value={100}
      />
    );

    // Re-query: the key-remount mechanism replaces the DOM node
    expect(container.querySelector('input[type="number"]')).toHaveValue(100);
  });

  it('should handle undefined errors from validator gracefully', () => {
    const getErrorsSpy = jest.spyOn(Validator, 'getErrors').mockReturnValue(undefined);

    const { container } = render(
      <NumericBox
        formFieldPath="test1.1/1-0"
        onChange={onChangeMock}
        validate={false}
        validateForm={false}
        validations={[constants.validations.mandatory]}
      />
    );

    const input = container.querySelector('input[type="number"]');
    expect(input).not.toHaveClass('form-builder-error');

    getErrorsSpy.mockRestore();
  });
});
