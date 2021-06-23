import React from 'react';
import Row from '../components/Row.jsx';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import map from 'lodash/map';
import each from 'lodash/each';
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
function validateFormFieldPath(formFieldPath) {
  let inValidControlId;
  const path = formFieldPath.split('/');
  if (path && path.length > 1) {
    path.shift();
    inValidControlId = path.find(p => !/\d+-\d+/.test(p));
    return !(inValidControlId && inValidControlId.length > 0);
  }
  return true;
}

export function getControls(controls, records, props) {
  return controls.map((control) => {
    const registeredControl = ComponentStore.getRegisteredComponent(control.type);
    if (registeredControl) {
      let recordsForControl = getRecordsForControl(control, records);
      if (recordsForControl.length > 1) {
        const validRecordsForControl = recordsForControl.filter(record =>
            validateFormFieldPath(record.formFieldPath) === true);
        recordsForControl = sortBy(validRecordsForControl,
          record => Util.toInt(record.formFieldPath.split('-')[1]));
        recordsForControl = setupAddRemoveButtonsForAddMore(recordsForControl);
      }
      const components = recordsForControl.map((record) => createReactComponent(registeredControl, {
        ...props,
        enabled: record.enabled && props.enabled,
        hidden: record.hidden,
        key: control.id,
        metadata: control,
        value: record.value,
        formFieldPath: record.formFieldPath,
        showAddMore: record.showAddMore,
        showRemove: record.showRemove,
        children: record.children,
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
  const sortedIndexes = sortBy(Object.keys(controls).map((i) => parseInt(i, 10)));
  each(sortedIndexes, (index) => {
    sortedControls.push(controls[index]);
  });
  return sortedControls;
}

export function getGroupedControls(controls, property) {
  const groupedControls = groupControlsByLocation(controls, property);
  return sortGroupedControls(groupedControls);
}

export function displayRowControls(controls, records, childProps, isInTable = false) {
  return map(controls, (rowControls, index) =>
    <Row
      controls={rowControls}
      id={index}
      isInTable={isInTable}
      key={index}
      records={records}
      {...childProps}
    />
  );
}
