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

  describe('allowRange validation', () => {
    const validations = [constants.validations.allowRange];

    it('should get allowRange error when value is beyond the range', () => {
      const params = { minNormal: 120, maxNormal: 122 };
      const expectedErrors = [{ errorType: constants.validations.allowRange }];
      const errors = Validator.getErrors({ validations, value: 123.12, params });
      expect(errors).to.deep.eql(expectedErrors);
    });

    it('should get allowRange error when the value is below the minimum', () => {
      const expectedErrors = [{ errorType: constants.validations.allowRange }];
      const errors = Validator.getErrors({ validations, value: 115, params: { minNormal: 120 } });
      expect(errors).to.deep.eql(expectedErrors);
    });

    it('should get allowRange error when the value is above the maximum', () => {
      const expectedErrors = [{ errorType: constants.validations.allowRange }];
      const errors = Validator.getErrors({ validations, value: 135, params: { maxNormal: 120 } });
      expect(errors).to.deep.eql(expectedErrors);
    });

    it('should not get allowRange error when the value undefined', () => {
      const errors = Validator.getErrors({ validations, value: undefined, params: {} });
      expect(errors).to.deep.eql([]);
    });

    it('should not get allowRange error when no min and max are provided', () => {
      const errors = Validator.getErrors({ validations, value: 500, params: {} });
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
