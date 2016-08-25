export function createFormNamespace(formUuid, controlId) {
  return `${formUuid}/${controlId}`;
}

export function getFormNamespaceDetails(formNamespace) {
  const tokens = formNamespace.split('/');
  const formUuid = tokens[0];
  const controlId = tokens[1];
  return { controlId, formUuid };
}
