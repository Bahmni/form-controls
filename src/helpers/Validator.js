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

  static getErrors(controlDetails) {
    const { validations, value } = controlDetails;
    const errors = map(validations, (propertyName) => {
      const validator = get(this.propertyValidators, propertyName);
      if (validator) return validator(value);
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
};
