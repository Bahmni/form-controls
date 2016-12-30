import constants from 'src/constants';
import get from 'lodash/get';
import map from 'lodash/map';
import isUndefined from 'lodash/isUndefined';
import { Error } from 'src/Error';


export class Validator {
  static nonEmpty(value) {
    if (value === false || value === 0 || value) return true;
    return false;
  }

  static mandatory(obsValue) {
    if (this.nonEmpty(obsValue)) return undefined;
    return new Error({ message: constants.validations.mandatory });
  }

  static allowDecimal(obsValue) {
    if (isUndefined(obsValue) || obsValue % 1 === 0) return undefined;
    return new Error({ message: constants.validations.allowDecimal });
  }

  static allowRange(value, params) {
    const error = new Error({
      type: constants.errorTypes.warning,
      message: constants.validations.allowRange,
    });
    if (isUndefined(params)) return undefined;
    return Validator.rangeValidation(value, params.minNormal, params.maxNormal) ?
      error : undefined;
  }

  static minMaxRange(value, params) {
    const error = new Error({
      type: constants.errorTypes.error,
      message: constants.validations.minMaxRange,
    });
    if (isUndefined(params)) return undefined;
    return Validator.rangeValidation(value, params.minAbsolute, params.maxAbsolute) ?
      error : undefined;
  }

  static rangeValidation(value, minRange, maxRange) {
    if (isUndefined(value)) return undefined;

    if ((minRange && value < Number.parseInt(minRange, 10)) ||
      (maxRange && value > Number.parseInt(maxRange, 10))) {
      return true;
    }
    return undefined;
  }

  static allowFutureDates(obsValue) {
    if (isUndefined(obsValue)) return undefined;
    if (Date.now() < new Date(obsValue).getTime()) {
      return new Error({ message: constants.validations.allowFutureDates });
    }
    return undefined;
  }

  static getErrors(controlDetails) {
    const { validations, value, params } = controlDetails;
    const errors = map(validations, (propertyName) => {
      const validator = get(this.propertyValidators, propertyName);
      if (validator) return validator(value, params);
      return undefined;
    });

    return errors.filter((error) => error !== undefined);
  }
}

Validator.propertyValidators = {
  [constants.validations.mandatory]:
    (obsVal) => Validator.mandatory(obsVal),
  [constants.validations.allowDecimal]:
      (obsVal) => Validator.allowDecimal(obsVal),
  [constants.validations.allowRange]:
      (obsVal, params) => Validator.allowRange(obsVal, params),
  [constants.validations.minMaxRange]:
    (obsVal, params) => Validator.minMaxRange(obsVal, params),
  [constants.validations.allowFutureDates]:
    (obsValue) => Validator.allowFutureDates(obsValue),
};
