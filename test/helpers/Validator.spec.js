import { expect } from 'chai';
import { Validator } from 'src/helpers/Validator';
import constants from 'src/constants';
import { Error } from 'src/Error';

describe('Validator', () => {
  describe('mandatory validation', () => {
    const validations = [constants.validations.mandatory];
    const mandatoryValidationError = new Error({ message: validations[0] });

    it('should get mandatory validation error when value is undefined', () => {
      const errors = Validator.getErrors({ validations, value: undefined });
      expect(errors[0]).to.deep.eql(mandatoryValidationError);
    });

    it('should get mandatory validation error when value is empty', () => {
      const errors = Validator.getErrors({ validations, value: '' });
      expect(errors[0]).to.deep.eql(mandatoryValidationError);
    });

    it('should not give mandatory error when value is present', () => {
      const errors = Validator.getErrors({ validations, value: 'someValue' });
      expect(errors).to.deep.eql([]);
    });

    it('should not give mandatory error when obsValue itself is false', () => {
      const controlDetails = { validations, value: false };
      const errors = Validator.getErrors(controlDetails);
      expect(errors).to.deep.eql([]);
    });

    it('should not give mandatory error when obsValue itself is 0', () => {
      const errors = Validator.getErrors({ validations, value: 0 });
      expect(errors).to.deep.eql([]);
    });
  });

  describe('allowDecimal validation', () => {
    const validations = [constants.validations.allowDecimal];
    const allowDecimalError = new Error({ message: validations[0] });

    it('should get allowDecimal error when value has decimal value', () => {
      const errors = Validator.getErrors({ validations, value: 123.12 });
      expect(errors[0]).to.deep.eql(allowDecimalError);
    });

    it('should not get allowDecimal error when value is undefined', () => {
      const errors = Validator.getErrors({ validations, value: undefined });
      expect(errors).to.deep.eql([]);
    });

    it('should not get allowDecimal error when value does not have decimal part', () => {
      const errors = Validator.getErrors({ validations, value: 123 });
      expect(errors).to.deep.eql([]);
    });

    it('should not get error when there is no allowDecimal validation', () => {
      const controlDetails = { validations: [constants.validations.mandatory], value: 123.90 };
      const errors = Validator.getErrors(controlDetails);
      expect(errors).to.deep.eql([]);
    });
  });

  describe('allowRange validation', () => {
    const validations = [constants.validations.allowRange];
    const allowRangeWarning = new Error({
      type: constants.errorTypes.warning,
      message: validations[0],
    });

    it('should get allowRange error when value is lesser than minNormal', () => {
      const params = { minNormal: 80, maxNormal: 120 };
      const errors = Validator.getErrors({ params, validations, value: 78 });
      expect(errors[0]).to.deep.eql(allowRangeWarning);
    });

    it('should get allowRange error when value is higher than maxNormal', () => {
      const params = { minNormal: 80, maxNormal: 120 };
      const errors = Validator.getErrors({ params, validations, value: 130 });
      expect(errors[0]).to.deep.eql(allowRangeWarning);
    });

    it('should not get allowRange error when value is undefined', () => {
      const errors = Validator.getErrors({ validations, value: undefined });
      expect(errors).to.deep.eql([]);
    });

    it('should not get allowRange error when value satisfies the condition', () => {
      const params = { minNormal: 80, maxNormal: 120 };
      const errors = Validator.getErrors({ params, validations, value: 110 });
      expect(errors).to.deep.eql([]);
    });
  });

  it('should not give error when there are no validations', () => {
    const controlDetails = { validations: [], value: '' };
    const errors = Validator.getErrors(controlDetails);
    expect(errors).to.deep.eql([]);
  });

  it('should not give error when there are no supported validations', () => {
    const controlDetails = { validations: ['randomValidation'], value: '' };
    const errors = Validator.getErrors(controlDetails);
    expect(errors).to.deep.eql([]);
  });
});
