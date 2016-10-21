import constants from 'src/constants';
import get from 'lodash/get';
import map from 'lodash/map';

export class Validator {
  static nonEmpty(value) {
    if (value === false || value === 0 || value) return true;
    return false;
  }

  static mandatory(propertyValue, obsValue) {
    if (!propertyValue || this.nonEmpty(obsValue)) return undefined;
    return { errorType: constants.validations.mandatory };
  }

  static getErrors(properties, obsValue) {
    const errors = map(properties, (propertyValue, propertyName) => {
      const validator = get(this.propertyValidators, propertyName);
      if (validator) return validator(propertyValue, obsValue);
      return undefined;
    });

    return errors.filter((error) => error !== undefined);
  }
}

Validator.propertyValidators = {
  [constants.validations.mandatory]: (propVal, obsVal) => Validator.mandatory(propVal, obsVal),
};
