import { expect } from 'chai';
import { Validator } from 'src/helpers/Validator';
import constants from 'src/constants';

describe('Validator', () => {
  describe('mandatory validation', () => {
    const validations = [constants.validations.mandatory];

    it('should get mandatory validation error when value is undefined', () => {
      const expectedErrors = [{ errorType: constants.validations.mandatory }];
      const errors = Validator.getErrors({ validations, value: undefined });
      expect(errors).to.deep.eql(expectedErrors);
    });

    it('should get mandatory validation error when value is empty', () => {
      const expectedErrors = [{ errorType: constants.validations.mandatory }];
      const errors = Validator.getErrors({ validations, value: '' });
      expect(errors).to.deep.eql(expectedErrors);
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

    it('should get allowDecimal error when value has decimal value', () => {
      const expectedErrors = [{ errorType: constants.validations.allowDecimal }];
      const errors = Validator.getErrors({ validations, value: 123.12 });
      expect(errors).to.deep.eql(expectedErrors);
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
