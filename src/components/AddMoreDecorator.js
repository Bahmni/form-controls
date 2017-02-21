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
    this.props.onControlAdd(this.state.obs);
  }

  onRemoveControl() {
    this.props.onControlRemove(this.state.obs);
  }

  _changeValue(obs, errors) {
    const bahmniRecord = this.state.data.getRecord(obs.formFieldPath)
      .set('obs', obs)
      .set('errors', errors);
    return this.state.data.setRecord(bahmniRecord);
  }

  updateGroupMembers(obsGroupMembers, nextFormFieldPath) {
    if (obsGroupMembers) {
      obsGroupMembers.map(nextObs => {
        const nextPath = `${nextObs.formFieldPath.split('-')[0]}-${nextFormFieldPath.split('-')[1]}`;
        const updatedObs = nextObs.set('formFieldPath', nextPath).set('uuid', undefined).void();
        return updatedObs.set('groupMembers', this.updateGroupMembers(updatedObs.groupMembers, nextFormFieldPath));
      })
    }
  }
};

export default addMoreDecorator;
