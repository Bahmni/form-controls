import Constants from 'src/constants';
import isEmpty from 'lodash/isEmpty';

export function getKeyPrefixForControl(formName, formVersion, controlId, parentFormFieldPath) {
  const formFieldPath = isEmpty(parentFormFieldPath) ? `${formName}.${formVersion}/${controlId}`
      : `${parentFormFieldPath}/${controlId}`;
  return {
    formNamespace: `${Constants.bahmni}`,
    formFieldPath,
  };
}

export function createFormNamespaceAndPath(formName, formVersion, controlId, parentFormFieldPath) {
  const formNamespaceAndPath = getKeyPrefixForControl(formName,
      formVersion, controlId, parentFormFieldPath);
  formNamespaceAndPath.formFieldPath += '-0';
  return formNamespaceAndPath;
}

export function getUpdatedFormFieldPath(sourceNode, parentFormFieldPath) {
  if (isEmpty(parentFormFieldPath)) {
    return sourceNode.formFieldPath;
  }
  const sourceFormFieldPath = sourceNode.formFieldPath;
  const lastIndex = sourceFormFieldPath.lastIndexOf('/');
  return parentFormFieldPath + sourceFormFieldPath.substring(lastIndex, sourceFormFieldPath.length);
}
