import constants from 'src/constants';
import get from 'lodash/get';
import map from 'lodash/map';
import isUndefined from 'lodash/isUndefined';

export class Validator {
  static nonEmpty(value) {
    if (value === false || value === 0 || value) return true;
    return false;
  }

  static mandatory(obsValue) {
    if (this.nonEmpty(obsValue)) return undefined;
    return { errorType: constants.validations.mandatory };
  }

  static allowDecimal(obsValue) {
    if (isUndefined(obsValue) || obsValue % 1 === 0) return undefined;
    return { errorType: constants.validations.allowDecimal };
  }

  static allowRange(value, params) {
    const error = { errorType: constants.validations.allowRange };
    if (isUndefined(value)) return undefined;

    if ((params.minNormal && value < Number.parseInt(params.minNormal, 10))) {
      return error;
    }
    if ((params.maxNormal && value > Number.parseInt(params.maxNormal, 10))) {
      return error;
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
};
