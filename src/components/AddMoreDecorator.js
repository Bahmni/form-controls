import React from 'react';
import find from 'lodash/find';
import { AddMore } from 'components/AddMore.jsx';
import { getErrors } from 'src/ControlState';

const addMoreDecorator = Sup => class extends Sup {
  showAddMore() {
    const { metadata: { properties } } = this.props;
    const isAddMoreEnabled = find(properties, (value, key) => (key === 'addMore' && value));
    if (isAddMoreEnabled) {
      return (
        <AddMore canAdd={ this.props.showAddMore } canRemove={ this.props.showRemove }
          onAdd={this.onAddControl} onRemove={this.onRemoveControl}
        />
      );
    }
    return null;
  }

  onAddControl() {
    this.props.onControlAdd(this.props.formFieldPath);
  }

  onRemoveControl() {
    this.props.onControlRemove(this.props.formFieldPath);
  }

  _changeValue(obs, errors) {
    const bahmniRecord = this.state.data.getRecord(obs.formFieldPath)
      .set('obs', obs)
      .set('errors', errors);
    return this.state.data.setRecord(bahmniRecord);
  }

  updateGroupMembers(obsGroupMembers, nextFormFieldPath) {
    if (obsGroupMembers) {
      return obsGroupMembers.map(nextObs => {
        const nextPath = `${nextObs.formFieldPath.split('-')[0]}-${nextFormFieldPath.split('-')[1]}`;
        const updatedObs = nextObs.set('formFieldPath', nextPath).set('uuid', undefined).void();
        return updatedObs.set('groupMembers', this.updateGroupMembers(updatedObs.groupMembers, nextFormFieldPath));
      })
    }
  }

  filterEmptyRecords(data) {
    const records = data.getActiveRecords();

    const inactiveFormFieldPath = [];
    const inactiveRecords = records.filter(r => {
      if (r.obs.value === undefined && r.obs.voided === true) {
        const prefix = r.formFieldPath.split('-')[0];
        const filteredRecords = records.filter(record =>
          !inactiveFormFieldPath[record.formFieldPath] && record.formFieldPath.startsWith(prefix)
        );
        if (filteredRecords.length > 1) {
          inactiveFormFieldPath[r.formFieldPath] = true;
          return true;
        }
      }
      return false;
    });

    inactiveRecords.forEach((r) => {data = data.deleteRecord(r.obs);});

    return data;
  }

};

export default addMoreDecorator;
