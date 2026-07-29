import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextBox } from 'src/components/TextBox.jsx';
import constants from 'src/constants';
import { Error } from 'src/Error';
import { Validator } from 'src/helpers/Validator';

describe('TextBox', () => {
  let mockOnChange;

  beforeEach(() => {
    mockOnChange = jest.fn();
  });

  it('should render TextBox', () => {
    render(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    const textbox = screen.getByRole('textbox');
    expect(textbox).toBeInTheDocument();
    expect(textbox).toHaveValue('');
  });

  it('should render TextBox with default value', () => {
    render(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        value="defaultText"
      />
    );

    expect(screen.getByRole('textbox')).toHaveValue('defaultText');
  });

  it('should get user entered value of the text box', async () => {
    render(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        value={'defalutText'}
      />
    );

    const textbox = screen.getByRole('textbox');
    userEvent.clear(textbox);
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
            { value: '', errors: [] }
        );
    });
    fireEvent.change(textbox, { target: { value: 'My new value' } });
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
            { value: 'My new value', errors: [] }
        );
    });
  });

  it('should return whole value when given value with spaces but not empty string', async () => {
    render(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    const textbox = screen.getByRole('textbox');
    const valueWithSpaces = ' abc efg ';
    fireEvent.change(textbox, { target: { value: valueWithSpaces } });

    expect(mockOnChange).toHaveBeenCalledWith({ value: valueWithSpaces, errors: [] });
  });

  it('should throw error on fail of validations', async () => {
    const validations = [constants.validations.mandatory];
    render(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={validations}
        value="defalutText"
      />
    );

    const textbox = screen.getByRole('textbox');
    await userEvent.clear(textbox);

    const mandatoryError = new Error({ message: validations[0] });
    expect(mockOnChange).toHaveBeenCalledWith({ value: '', errors: [mandatoryError] });
    expect(textbox).toHaveClass('form-builder-error');
  });

  it('should throw error on fail of validations during component update', () => {
    const validations = [constants.validations.mandatory];
    const { rerender } = render(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={validations}
        value="defalutText"
      />
    );

    const mandatoryError = new Error({ message: validations[0] });
    rerender(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate
        validateForm={false}
        validations={validations}
        value={undefined}
      />
    );

    expect(mockOnChange).toHaveBeenCalledWith({ value: undefined, errors: [mandatoryError] });
    expect(screen.getByRole('textbox')).toHaveClass('form-builder-error');
  });

  it('should render TextBox on change of props', () => {
    const { rerender } = render(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        value="defalutText"
      />
    );

    rerender(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        value="someText"
      />
    );

    expect(screen.getByRole('textbox')).toHaveValue('someText');
  });

  it('should check errors after mount if the formFieldPath suffix is not 0', () => {
    const validations = [constants.validations.mandatory];
    render(
      <TextBox
        formFieldPath="test1.1/1-1"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={validations}
      />
    );

    expect(screen.getByRole('textbox')).toHaveClass('form-builder-error');
  });

  it('should not check errors after mount if the formFieldPath suffix is 0', () => {
    const validations = [constants.validations.mandatory];
    render(
      <TextBox
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={validations}
      />
    );

    expect(screen.getByRole('textbox')).not.toHaveClass('form-builder-error');
  });

  it('should check disabled attribute when enabled prop is false', () => {
    render(
      <TextBox
        enabled={false}
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should not check disabled attribute when enabled prop is true', () => {
    render(
      <TextBox
        enabled
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    expect(screen.getByRole('textbox')).not.toBeDisabled();
  });

  it('should trigger onChange when mounting component and the value is not undefined', () => {
    render(
      <TextBox
        enabled
        formFieldPath="test1.1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        value="defaultText"
      />
    );

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should trigger onChange when the value is changed', () => {
    const { rerender } = render(
      <TextBox
        formFieldPath="test1.1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );

    rerender(
      <TextBox
        formFieldPath="test1.1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        value="defaultText"
      />
    );

    expect(mockOnChange).toHaveBeenCalledWith({ value: 'defaultText', errors: [] });
  });

  describe('hidden → visible validation trigger', () => {
    it('shouldComponentUpdate returns true when hidden transitions true → false', () => {
      const { rerender } = render(
        <TextBox
          formFieldPath="test1.1-0"
          hidden
          onChange={mockOnChange}
          validate={false}
          validateForm={false}
          validations={[]}
        />
      );
      mockOnChange.mockClear();
      rerender(
        <TextBox
          formFieldPath="test1.1-0"
          hidden={false}
          onChange={mockOnChange}
          validate={false}
          validateForm={false}
          validations={[]}
        />
      );
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('componentDidUpdate calls onChange with errors when hidden→visible with validateForm true', () => {
      const { rerender } = render(
        <TextBox
          formFieldPath="test1.1-0"
          hidden
          onChange={mockOnChange}
          validate={false}
          validateForm
          validations={[constants.validations.mandatory]}
        />
      );
      mockOnChange.mockClear();
      rerender(
        <TextBox
          formFieldPath="test1.1-0"
          hidden={false}
          onChange={mockOnChange}
          validate={false}
          validateForm
          validations={[constants.validations.mandatory]}
        />
      );
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({ calledOnMount: true })
      );
    });

    it('componentDidUpdate does not fire the hidden→visible block when validateForm is false', () => {
      const { rerender } = render(
        <TextBox
          formFieldPath="test1.1-0"
          hidden
          onChange={mockOnChange}
          validate={false}
          validateForm={false}
          validations={[constants.validations.mandatory]}
          value="some text"
        />
      );
      mockOnChange.mockClear();
      rerender(
        <TextBox
          formFieldPath="test1.1-0"
          hidden={false}
          onChange={mockOnChange}
          validate={false}
          validateForm={false}
          validations={[constants.validations.mandatory]}
          value="some text"
        />
      );
      const callsWithCalledOnMount = mockOnChange.mock.calls.filter(
        ([arg]) => arg && arg.calledOnMount
      );
      expect(callsWithCalledOnMount).toHaveLength(0);
    });
  });

  it('should handle undefined errors from validator gracefully', () => {
    const getErrorsSpy = jest.spyOn(Validator, 'getErrors').mockReturnValue(undefined);
    render(
      <TextBox
        formFieldPath="test1.1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        value="defaultText"
      />
    );

    const textbox = screen.getByRole('textbox');
    expect(textbox).toBeInTheDocument();
    expect(textbox).toHaveValue('defaultText');
    expect(textbox).not.toHaveClass('form-builder-error');

    getErrorsSpy.mockRestore();
  });
});
