import constants from 'src/constants';
import get from 'lodash/get';
import map from 'lodash/map';

export class Validator {
  static nonEmpty(value) {
    if (value === false || value === 0 || value) return true;
    return false;
  }

  static mandatory(controlId, propertyValue, obsValue) {
    if (!propertyValue || this.nonEmpty(obsValue)) return undefined;
    return { controlId, errorType: constants.validations.mandatory };
  }

  static getErrors(controlDetails) {
    const { id: controlId, properties, value } = controlDetails;
    const errors = map(properties, (propertyValue, propertyName) => {
      const validator = get(this.propertyValidators, propertyName);
      if (validator) return validator(controlId, propertyValue, value);
      return undefined;
    });

    return errors.filter((error) => error !== undefined);
  }
}

Validator.propertyValidators = {
  [constants.validations.mandatory]:
    (controlId, propVal, obsVal) => Validator.mandatory(controlId, propVal, obsVal),
};
