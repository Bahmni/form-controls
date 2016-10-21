import { expect } from 'chai';
import { Validator } from 'src/helpers/Validator';
import constants from 'src/constants';

describe('Validator', () => {
  describe('mandatory validation', () => {
    const properties = { mandatory: true };

    it('should get mandatory validation error when value is undefined', () => {
      const expectedErrors = [{ errorType: constants.validations.mandatory }];
      const errors = Validator.getErrors(properties, undefined);
      expect(errors).to.deep.eql(expectedErrors);
    });

    it('should get mandatory validation error when value is empty', () => {
      const expectedErrors = [{ errorType: constants.validations.mandatory }];
      const errors = Validator.getErrors(properties, '');
      expect(errors).to.deep.eql(expectedErrors);
    });

    it('should not give mandatory error when value is present', () => {
      const errors = Validator.getErrors(properties, 'someValue');
      expect(errors).to.deep.eql([]);
    });

    it('should not give mandatory error when propValue is false', () => {
      const errors = Validator.getErrors({ mandatory: false }, undefined);
      expect(errors).to.deep.eql([]);
    });

    it('should not give mandatory error when obsValue itself is false', () => {
      const errors = Validator.getErrors({ mandatory: true }, false);
      expect(errors).to.deep.eql([]);
    });

    it('should not give mandatory error when obsValue itself is 0', () => {
      const errors = Validator.getErrors({ mandatory: true }, 0);
      expect(errors).to.deep.eql([]);
    });
  });

  it('should not give error when property is unknown', () => {
    const errors = Validator.getErrors({ someRandomProperty: true }, '');
    expect(errors).to.deep.eql([]);
  });
});
