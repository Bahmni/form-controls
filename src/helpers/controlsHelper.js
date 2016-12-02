import constants from 'src/constants';

export function getValidations(properties, conceptProperties) {
  const validations = [];
  if (properties && properties.mandatory) validations.push(constants.validations.mandatory);
  if (conceptProperties && conceptProperties.allowDecimal === false) {
    validations.push(constants.validations.allowDecimal);
  }
  return validations;
}
