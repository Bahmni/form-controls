import React from 'react';
import Row from '../components/Row.jsx';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import map from 'lodash/map';
import ComponentStore from 'src/helpers/componentStore';
import { Util } from './Util';

function getRecordsForControl(control, records) {
  return records.filter((record) => record.control.id === control.id);
}

function createReactComponent(component, props) {
  return React.createElement(component, props);
}

export function setupAddRemoveButtonsForAddMore(records) {
  return records.map((record, index) =>
    record.set('showRemove', index > 0).set('showAddMore', index === records.length - 1));
}

export function getControls(controls, records, props) {
  return controls.map((control) => {
    const registeredControl = ComponentStore.getRegisteredComponent(control.type);
    if (registeredControl) {
      let recordsForControl = getRecordsForControl(control, records);
      if (recordsForControl.length > 1) {
        recordsForControl = sortBy(recordsForControl,
          record => Util.toInt(record.formFieldPath.split('-')[1]));
        recordsForControl = setupAddRemoveButtonsForAddMore(recordsForControl);
      }
      const components = recordsForControl.map((record) => createReactComponent(registeredControl, {
        enabled: record.enabled,
        key: control.id,
        metadata: control,
        value: record.value,
        formFieldPath: record.formFieldPath,
        showAddMore: record.showAddMore,
        showRemove: record.showRemove,
        children: record.children,
        ...props,
      }));
      return components;
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
