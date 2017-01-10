import Constants from 'src/constants';

export function createFormNamespaceAndPath(formName, formVersion, controlId) {
  return {
    formNamespace: `${Constants.bahmni}`,
    formFieldPath: `${formName}.${formVersion}/${controlId}-0`,
  };
}

export function getKeyPrefixForControl(formName, formVersion, controlId) {
  return {
    formNamespace: `${Constants.bahmni}`,
    formFieldPath: `${formName}.${formVersion}/${controlId}`,
  };
}
