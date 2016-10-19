export function getObsFromChildControls(childControls) {
  const childControlsIds = Object.getOwnPropertyNames(childControls);
  const observations = childControlsIds.map(childControlId => {
    const childControl = childControls[childControlId];
    if (childControl.getValue) return childControl.getValue();
    return undefined;
  });
  return observations;
}
