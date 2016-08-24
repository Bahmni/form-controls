import React from 'react';

function getObsForControl(control, observations) {
  if (control.properties && control.properties.visualOnly) return observations;
  return observations.find((obs) => obs.formNameSpace.controlId === control.id);
}

function createReactComponent(component, props) {
  return React.createElement(component, props);
}

export function getControls(controls, observations, props) {
  return controls.map((control) => {
    const component = window.componentStore.getRegisteredComponent(control.type);
    if (component) {
      const obs = getObsForControl(control, observations);
      return createReactComponent(component, { key: control.id, metadata: control, obs, ...props });
    }
    return undefined;
  }).filter(element => element !== undefined);
}
