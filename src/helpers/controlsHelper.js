import flatMap from 'lodash/flatMap';
import some from 'lodash/some';
import constants from 'src/constants';

export function getObsFromChildControls(childControls) {
  const childControlsIds = Object.getOwnPropertyNames(childControls);
  const observations = childControlsIds.map(childControlId => {
    const childControl = childControls[childControlId];
    if (childControl.getValue) return childControl.getValue();
    return undefined;
  });
  return observations;
}

export function getErrorsFromChildControls(childControls) {
  return flatMap(childControls, childControl => {
    if (childControl.getErrors) {
      return childControl.getErrors();
    }
    return undefined;
  }).filter(error => error !== undefined);
}

export function hasError(errors, controlId) {
  return some(errors, error => error.controlId === controlId);
}

export function getValidations(properties) {
  const validations = [];
  if (properties.mandatory) validations.push(constants.validations.mandatory);
  if (properties.allowDecimal === false) validations.push(constants.validations.allowDecimal);
  return validations;
}
