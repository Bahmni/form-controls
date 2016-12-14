import React from 'react';
import { getFormNamespaceDetails } from 'src/helpers/formNamespace';
import Row from 'src/components/Row.jsx';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import ComponentStore from 'src/helpers/componentStore';

function getRecordForControl(control, records) {
  const filteredRecord = records.find((record) => {
    const { controlId } = getFormNamespaceDetails(record.obs.formNamespace);
    return controlId === control.id;
  });
  return filteredRecord;
}

function createReactComponent(component, props) {
  return React.createElement(component, props);
}

export function getControls(controls, records, props) {
  return controls.map((control) => {
    const registeredControl = ComponentStore.getRegisteredComponent(control.type);
    if (registeredControl) {
      const record = getRecordForControl(control, records);
      return createReactComponent(registeredControl, {
        key: control.id,
        metadata: control,
        obs: record.obs,
        mapper: record.mapper,
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

export function displayRowControls(controls, records, childProps) {
  return map(controls, (rowControls, index) =>
    <Row
      controls={rowControls}
      id={index}
      key={index}
      records={records}
      {...childProps}
    />
  );
}
