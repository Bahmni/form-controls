import { expect } from 'chai';
import { Validator } from 'src/helpers/Validator';
import constants from 'src/constants';

describe('Validator', () => {
  describe('mandatory validation', () => {
    const properties = { mandatory: true };

    it('should get mandatory validation error when value is undefined', () => {
      const expectedErrors = [{ controlId: 'c1', errorType: constants.validations.mandatory }];
      const errors = Validator.getErrors({ id: 'c1', properties, value: undefined });
      expect(errors).to.deep.eql(expectedErrors);
    });

    it('should get mandatory validation error when value is empty', () => {
      const expectedErrors = [{ controlId: 'c1', errorType: constants.validations.mandatory }];
      const errors = Validator.getErrors({ id: 'c1', properties, value: '' });
      expect(errors).to.deep.eql(expectedErrors);
    });

    it('should not give mandatory error when value is present', () => {
      const errors = Validator.getErrors({ id: 'c1', properties, value: 'someValue' });
      expect(errors).to.deep.eql([]);
    });

    it('should not give mandatory error when propValue is false', () => {
      const controlDetails = { id: 'c1', properties: { mandatory: false }, value: undefined };
      const errors = Validator.getErrors(controlDetails);
      expect(errors).to.deep.eql([]);
    });

    it('should not give mandatory error when obsValue itself is false', () => {
      const controlDetails = { id: 'c1', properties: { mandatory: true }, value: false };
      const errors = Validator.getErrors(controlDetails);
      expect(errors).to.deep.eql([]);
    });

    it('should not give mandatory error when obsValue itself is 0', () => {
      const errors = Validator.getErrors({ id: 'c1', properties: { mandatory: true }, value: 0 });
      expect(errors).to.deep.eql([]);
    });
  });

  describe('allowDecimal validation', () => {
    const properties = { allowDecimal: false };

    it('should get allowDecimal error when value has decimal value', () => {
      const expectedErrors = [{ controlId: 'c1', errorType: constants.validations.allowDecimal }];
      const errors = Validator.getErrors({ id: 'c1', properties, value: 123.12 });
      expect(errors).to.deep.eql(expectedErrors);
    });

    it('should not get allowDecimal error when value is undefined', () => {
      const errors = Validator.getErrors({ id: 'c1', properties, value: undefined });
      expect(errors).to.deep.eql([]);
    });

    it('should not get allowDecimal error when value does not have decimal part', () => {
      const errors = Validator.getErrors({ id: 'c1', properties, value: 123 });
      expect(errors).to.deep.eql([]);
    });

    it('should not get error when allowDecimal property is true', () => {
      const controlDetails = { id: 'c1', properties: { allowDecimal: false }, value: 123 };
      const errors = Validator.getErrors(controlDetails);
      expect(errors).to.deep.eql([]);
    });
  });
  it('should not give error when property is unknown', () => {
    const controlDetails = { id: 'c1', properties: { someRandomProperty: true }, value: '' };
    const errors = Validator.getErrors(controlDetails);
    expect(errors).to.deep.eql([]);
  });
});
