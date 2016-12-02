import { expect } from 'chai';
import { getValidations } from 'src/helpers/controlsHelper';
import constants from 'src/constants';

describe('ControlsHelper', () => {
  describe('should test getValidations', () => {
    it('get mandatory, allowDecimal validations from properties', () => {
      const props = { mandatory: true };
      const conceptProperties = { allowDecimal: false };
      const validations = getValidations(props, conceptProperties);

      expect(validations.length).to.equals(2);
      expect(validations[0]).to.equals(constants.validations.mandatory);
      expect(validations[1]).to.equals(constants.validations.allowDecimal);
    });

    it('get mandatory validations from properties', () => {
      const props = { mandatory: true };
      const validations = getValidations(props, undefined);

      expect(validations.length).to.equals(1);
      expect(validations[0]).to.equals(constants.validations.mandatory);
    });

    it('get allowDecimal validations from properties', () => {
      let conceptProperties = { allowDecimal: false };
      let validations = getValidations({}, conceptProperties);

      expect(validations.length).to.equals(1);
      expect(validations[0]).to.equals(constants.validations.allowDecimal);

      conceptProperties = { allowDecimal: true };
      validations = getValidations({}, conceptProperties);
      expect(validations.length).to.equals(0);
    });

    it('should not throw exceptions for properties without validations', () => {
      const validations = getValidations(undefined, undefined);

      expect(validations.length).to.equals(0);
    });
  });
});
