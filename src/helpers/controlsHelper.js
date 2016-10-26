import flatMap from 'lodash/flatMap';
import some from 'lodash/some';

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