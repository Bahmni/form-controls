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

export function setupAddRemoveButtonsForAddMore(records) {
  return records.map((record, index) =>
    record.set('showRemove', index > 0).set('showAddMore', index === records.length - 1));
}

export function getControls(controls, records, props) {
  return controls.map((control) => {
    const RegisteredControl = ComponentStore.getRegisteredComponent(control.type);
    if (RegisteredControl) {
      let recordsForControl = getRecordsForControl(control, records);
      if (recordsForControl.length > 1) {
        recordsForControl = sortBy(recordsForControl,
          record => Util.toInt(record.formFieldPath.split('-')[1]));
        recordsForControl = setupAddRemoveButtonsForAddMore(recordsForControl);
      }

      return recordsForControl.map((record) => <RegisteredControl
        {...props}
        children={record.children}
        enabled={record.enabled && props.enabled}
        formFieldPath={record.formFieldPath}
        hidden={record.hidden}
        metadata={control}
        showAddMore={record.showAddMore}
        showRemove={record.showRemove}
        value={record.value}
      />);
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
