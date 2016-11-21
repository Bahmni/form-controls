import React from 'react';
import { getFormNamespaceDetails } from 'src/helpers/formNamespace';
import Row from 'src/components/Row.jsx';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';

function getObsForControl(control, observations) {
  if (control.properties && control.properties.visualOnly) return observations;
  return observations.find((obs) => {
    const { controlId } = getFormNamespaceDetails(obs.formNamespace);
    return controlId === control.id;
  });
}

function getErrorForControl(control, errors) {
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
    const registeredControl = window.componentStore.getRegisteredComponent(control.type);
    if (registeredControl) {
      const obs = getObsForControl(control, observations);
      return createReactComponent(registeredControl, {
        key: control.id,
        metadata: control,
        obs,
        ...props,
      });
    }
    return undefined;
  }).filter(element => element !== undefined);
}

export function groupControlsByLocation(controls, property) {
  return groupBy(controls, `properties.location.${property}`);
}

export function sortGroupedControls(controls) {
  const sortedControls = [];
  Object.keys(controls)
    .sort()
    .forEach((key) => {
      sortedControls.push(controls[key]);
    });
  return sortedControls;
}

export function getGroupedControls(controls, property) {
  const groupedControls = groupControlsByLocation(controls, property);
  return sortGroupedControls(groupedControls);
}

export function displayRowControls(controls, observations, errors, childProps) {
  return map(controls, (rowControls, index) =>
    <Row
      controls={rowControls}
      id={index}
      key={index}
      observations={observations}
      errors={ errors }
      {...childProps}
    />
  );
}
