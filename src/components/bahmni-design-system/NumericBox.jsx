import { NumberInput } from '@bahmni/design-system';
import { Validator } from 'src/helpers/Validator';
import isEmpty from 'lodash/isEmpty';
import constants from 'src/constants';
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';

export const NumericBox = ({
  value,
  onChange,
  enabled = true,
  lowNormal,
  hiNormal,
  lowAbsolute,
  hiAbsolute,
  validations = [],
  formFieldPath,
  validate,
  validateForm,
  ...props
}) => {
  const [hasErrors, setHasErrors] = useState(false);
  const [hasWarnings, setHasWarnings] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [carbonKey, setCarbonKey] = useState(0);
  const prevValueRef = useRef(value);
  const isUserChangeRef = useRef(false);

  const _getErrors = (val) => {
    const allValidations = [
      constants.validations.allowRange,
      constants.validations.minMaxRange,
      ...validations,
    ];
    const params = {
      minNormal: lowNormal,
      maxNormal: hiNormal,
      minAbsolute: lowAbsolute,
      maxAbsolute: hiAbsolute,
    };
    const controlDetails = { validations: allValidations, value: val, params };
    return Validator.getErrors(controlDetails);
  };

  const _hasErrors = (errors, errorType = constants.errorTypes.error) => {
    return !isEmpty(errors.filter((error) => error.type === errorType));
  };

  const _isCreateByAddMore = () => {
    return formFieldPath && formFieldPath.split('-')[1] !== '0';
  };

  // Initialize on mount
  useEffect(() => {
    if (isInitialized) return;

    setHasErrors(false);
    setHasWarnings(false);

    if (typeof value !== 'undefined' || validateForm) {
      onChange({
        value,
        errors: [],
        triggerControlEvent: false,
        calledOnMount: true,
      });
    }

    setIsInitialized(true);
  }, []);

  // Handle prop updates - only validate if explicitly requested, not on initial render
  useEffect(() => {
    if (!isInitialized) return;

    // Only show validation errors if validate prop is true (user triggered validation)
    if (validate) {
      const errors = _getErrors(value);
      const newHasErrors = _hasErrors(errors, constants.errorTypes.error);
      const newHasWarnings = _hasErrors(errors, constants.errorTypes.warning);

      if (hasErrors !== newHasErrors || hasWarnings !== newHasWarnings) {
        setHasErrors(newHasErrors);
        setHasWarnings(newHasWarnings);
      }
    }
  }, [validate, value]);

  // Carbon's internal isNaN check doesn't fire when value goes from "" to a number
  // (Number("") === 0, not NaN), so setValue() from scripts won't update the display.
  // Force a re-mount via key when an external setValue sets a value on an empty field.
  useLayoutEffect(() => {
    if (!isInitialized) return;
    const prevVal = prevValueRef.current;
    prevValueRef.current = value;
    const wasEmpty = prevVal === undefined || prevVal === null || prevVal === '';
    const hasValue = value !== undefined && value !== null && value !== '';
    if (!isUserChangeRef.current && wasEmpty && hasValue) {
      setCarbonKey((k) => k + 1);
    }
    isUserChangeRef.current = false;
  }, [value, isInitialized]);

  const handleChange = (_, { value: inputValue } = {}) => {
    isUserChangeRef.current = true;
    // NumberInput onChange signature: (event, { value })
    let processedValue;

    if (inputValue === null || inputValue === undefined || inputValue === '') {
      processedValue = undefined;
    } else {
      // Ensure we parse any incoming value (string or number) to a number
      const numericValue = parseFloat(inputValue.toString());
      processedValue = isNaN(numericValue) ? undefined : numericValue;
    }

    const errors = _getErrors(processedValue);
    const newHasErrors = _hasErrors(errors, constants.errorTypes.error);
    const newHasWarnings = _hasErrors(errors, constants.errorTypes.warning);

    setHasErrors(newHasErrors);
    setHasWarnings(newHasWarnings);

    onChange({
      value: processedValue,
      errors: errors,
      triggerControlEvent: true,
    });
  };

  const formatRange = () => {
    // Both normal limits exist and are not null
    if (
      lowNormal !== undefined &&
      lowNormal !== null &&
      hiNormal !== undefined &&
      hiNormal !== null
    ) {
      return `(${lowNormal} - ${hiNormal})`;
    }
    // Only low normal exists (hiNormal is null or undefined)
    if (
      lowNormal !== undefined &&
      lowNormal !== null &&
      (!hiNormal && hiNormal !== 0)
    ) {
      return `(> ${lowNormal})`;
    }
    // Only high normal exists (lowNormal is null or undefined)
    if (
      hiNormal !== undefined &&
      hiNormal !== null &&
      (!lowNormal && lowNormal !== 0)
    ) {
      return `(< ${hiNormal})`;
    }
    return null;
  };

  const getNumericValue = () => {
    if (value === null || value === undefined || value === '') {
      return '';
    }
    const num = parseFloat(value);
    return isNaN(num) ? '' : num;
  };

  return (
    <div className="obs-numeric-text-wrap">
      <NumberInput
        key={carbonKey}
        allowEmpty
        value={getNumericValue()}
        onChange={handleChange}
        invalid={hasErrors}
        warn={hasWarnings}
        disabled={!enabled}
        step={1}
        {...props}
      />
      {formatRange() && (
        <span className="obs-numeric-range">{formatRange()}</span>
      )}
    </div>
  );
};
