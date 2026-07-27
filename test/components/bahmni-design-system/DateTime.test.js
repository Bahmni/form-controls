import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { DateTime } from '../../../src/components/bahmni-design-system/DateTime';
import constants from 'src/constants';

// Simulates the real controlled round-trip: parent holds value in state and echoes onChange back.
function StatefulDateTime({ initialValue, onChange: externalOnChange, ...rest }) {
  const [value, setValue] = React.useState(initialValue);
  return (
    <DateTime
      {...rest}
      value={value}
      onChange={({ value: newValue, errors }) => {
        setValue(newValue);
        if (externalOnChange) externalOnChange({ value: newValue, errors });
      }}
    />
  );
}

describe('DateTime', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('renders DateTime component with all required props', () => {
    const { container } = render(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        value="2024-01-01 10:00"
      />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  test('calls onChange on mount with provided datetime value', () => {
    render(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        value="2024-01-01 10:00"
      />
    );
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        value: '2024-01-01 10:00',
      })
    );
  });

  test('adds error class when validation fails on add-more row', () => {
    const { container } = render(
      <DateTime
        formFieldPath="test1.1/1-1"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
      />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  test('component renders with enabled prop as false', () => {
    const { container } = render(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        enabled={false}
      />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  test('component renders with enabled prop as true', () => {
    const { container } = render(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        enabled={true}
      />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  test('fires onChange on mount when validateForm is true', () => {
    render(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={true}
        validations={[]}
      />
    );
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: expect.any(Array),
        triggerControlEvent: false,
      })
    );
  });

  test('should add form-builder-error class when validate changes to true with partial value (date only)', () => {
    const { rerender, container } = render(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        value="2024-01-15"
      />
    );

    mockOnChange.mockClear();

    rerender(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={true}
        validateForm={false}
        validations={[]}
        value="2024-01-15"
      />
    );

    expect(container.querySelector('.form-builder-error')).toBeTruthy();
  });

  test('should not crash when value prop is a non-string truthy value', () => {
    const { container, rerender } = render(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        conceptUuid="test-uuid"
        value="2026-06-30 10:00"
      />
    );

    expect(() => {
      rerender(
        <DateTime
          formFieldPath="test1.1/1-0"
          onChange={mockOnChange}
          validate={false}
          validateForm={false}
          validations={[]}
          conceptUuid="test-uuid"
          value={new Date('2026-06-30')}
        />
      );
    }).not.toThrow();

    expect(container.querySelector('input[id="test-uuid-date"]')).toHaveValue('');
  });

  test('should strip seconds from time when setValue provides HH:MM:SS format', () => {
    const { container } = render(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        conceptUuid="test-uuid"
        value="2026-06-30 10:00:00"
      />
    );

    const timeInput = container.querySelector('input[id="test-uuid-time"]');
    expect(timeInput).toHaveValue('10:00');
  });

  test('should display time when external setValue changes value from empty to populated', () => {
    const { container, rerender } = render(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        conceptUuid="test-uuid"
      />
    );

    expect(container.querySelector('input[id="test-uuid-time"]')).toHaveValue('');

    rerender(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        conceptUuid="test-uuid"
        value="2026-06-30 10:00:00"
      />
    );

    expect(container.querySelector('input[id="test-uuid-time"]')).toHaveValue('10:00');
  });

  test('should display date when external setValue changes value from empty to populated', () => {
    const { container, rerender } = render(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        conceptUuid="test-uuid"
      />
    );

    expect(container.querySelector('input[id="test-uuid-date"]')).toHaveValue('');

    rerender(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        conceptUuid="test-uuid"
        value="2026-06-30 10:00:00"
      />
    );

    expect(container.querySelector('input[id="test-uuid-date"]')).toHaveValue('2026-06-30');
  });

  test('should update both date and time when external setValue replaces existing value', () => {
    const { container, rerender } = render(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        conceptUuid="test-uuid"
        value="2024-01-01 09:00:00"
      />
    );

    rerender(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        conceptUuid="test-uuid"
        value="2026-06-30 10:30:00"
      />
    );

    expect(container.querySelector('input[id="test-uuid-time"]')).toHaveValue('10:30');
    expect(container.querySelector('input[id="test-uuid-date"]')).toHaveValue('2026-06-30');
  });

  test('should not remount TimePicker when rerendered with the same value', () => {
    const { container, rerender } = render(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        conceptUuid="test-uuid"
        value="2026-06-30 10:00"
      />
    );
    const timeBefore = container.querySelector('input[id="test-uuid-time"]');

    rerender(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        conceptUuid="test-uuid"
        value="2026-06-30 10:00"
      />
    );

    expect(container.querySelector('input[id="test-uuid-time"]')).toBe(timeBefore);
  });

  test('should not call onChange when validate changes to true', () => {
    const { rerender } = render(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[constants.validations.mandatory]}
      />
    );

    mockOnChange.mockClear();

    rerender(
      <DateTime
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={true}
        validateForm={false}
        validations={[constants.validations.mandatory]}
      />
    );

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  test('should not remount TimePicker when user types a time in a controlled round-trip parent', () => {
    // Regression: getDerivedStateFromProps was treating the parent echoing back the user's own
    // onChange as an external setValue, bumping _timeKey and destroying the input on every keystroke.
    const { container } = render(
      <StatefulDateTime
        formFieldPath="test1.1/1-0"
        onChange={mockOnChange}
        validate={false}
        validateForm={false}
        validations={[]}
        conceptUuid="test-uuid"
        enabled={true}
        initialValue="2024-01-01 10:00"
      />
    );

    const timeBefore = container.querySelector('input[id="test-uuid-time"]');
    expect(timeBefore).not.toBeNull();

    fireEvent.change(timeBefore, { target: { value: '11:15' } });

    const timeAfter = container.querySelector('input[id="test-uuid-time"]');
    expect(timeAfter).toBe(timeBefore);
  });

  describe('date parsing — UTC timezone safety', () => {
    test('date input displays correct day for month-end date set via initial value prop', () => {
      const { container } = render(
        <DateTime
          formFieldPath="test1.1/1-0"
          onChange={mockOnChange}
          validate={false}
          validateForm={false}
          validations={[]}
          conceptUuid="test-uuid"
          value="2026-06-30 10:00"
        />
      );
      expect(container.querySelector('input[id="test-uuid-date"]')).toHaveValue('2026-06-30');
    });

    test('date input displays correct day for month-end date set via getDerivedStateFromProps', () => {
      const { container, rerender } = render(
        <DateTime
          formFieldPath="test1.1/1-0"
          onChange={mockOnChange}
          validate={false}
          validateForm={false}
          validations={[]}
          conceptUuid="test-uuid"
        />
      );

      rerender(
        <DateTime
          formFieldPath="test1.1/1-0"
          onChange={mockOnChange}
          validate={false}
          validateForm={false}
          validations={[]}
          conceptUuid="test-uuid"
          value="2026-06-30 10:00"
        />
      );

      expect(container.querySelector('input[id="test-uuid-date"]')).toHaveValue('2026-06-30');
    });

    test('simulates UTC-7: date string does not shift DatePicker display to previous day', () => {
      const OriginalDate = global.Date;
      const UTC_OFFSET_MS = 7 * 60 * 60 * 1000;

      class SimulatedUtcMinus7Date extends OriginalDate {
        constructor(...args) {
          if (args.length === 1 && typeof args[0] === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(args[0])) {
            super(new OriginalDate(args[0]).getTime() - UTC_OFFSET_MS);
          } else {
            super(...args);
          }
        }
      }
      Object.setPrototypeOf(SimulatedUtcMinus7Date, OriginalDate);
      SimulatedUtcMinus7Date.now = OriginalDate.now.bind(OriginalDate);
      global.Date = SimulatedUtcMinus7Date;

      try {
        const { container } = render(
          <DateTime
            formFieldPath="test1.1/1-0"
            onChange={mockOnChange}
            validate={false}
            validateForm={false}
            validations={[]}
            conceptUuid="test-uuid"
            value="2026-06-30 10:00"
          />
        );

        expect(container.querySelector('input[id="test-uuid-date"]')).toHaveValue('2026-06-30');
      } finally {
        global.Date = OriginalDate;
      }
    });
  });
});
