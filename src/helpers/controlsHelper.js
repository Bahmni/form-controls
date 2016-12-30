import constants from 'src/constants';

export function getValidations(properties, conceptProperties) {
  const validations = [];
  if (properties && properties.mandatory) validations.push(constants.validations.mandatory);
  if (conceptProperties && conceptProperties.allowDecimal === false) {
    validations.push(constants.validations.allowDecimal);
  }
  if (properties && properties.allowFutureDates === false) {
    validations.push(constants.validations.allowFutureDates);
  }
  return validations;
}
