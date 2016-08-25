import React from 'react';
import { getFormNamespaceDetails } from 'src/helpers/formNamespace';

function getObsForControl(control, observations) {
  if (control.properties && control.properties.visualOnly) return observations;
  return observations.find((obs) => {
    const { controlId } = getFormNamespaceDetails(obs.formNamespace);
    return controlId === control.id;
  });
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
