import constants from 'src/constants';

export function getValidations(properties) {
  const validations = [];
  if (properties.mandatory) validations.push(constants.validations.mandatory);
  if (properties.allowDecimal === false) validations.push(constants.validations.allowDecimal);
  return validations;
}
