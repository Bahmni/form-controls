import isEmpty from 'lodash/isEmpty';
import _ from 'lodash';

export function isAnyAncestorOrControlHasAddMore(control, parentFormFieldPath) {
  if (parentFormFieldPath) {
    return true;
  }
  return _.has(control, 'properties.addMore') ? control.properties.addMore : false;
}

export function getCurrentFormFieldPathIfAddMore(formName, formVersion, control,
                                                 parentFormFieldPath) {
  if (!isEmpty(parentFormFieldPath)) {
    return `${parentFormFieldPath}/${control.id}-0`;
  }
  return control.properties.addMore ? `${formName}.${formVersion}/${control.id}-0` : '';
}

