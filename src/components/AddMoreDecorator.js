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

  // onControlAdd(obs) {
  //   const nextFormFieldPath = this.state.data.generateFormFieldPath(obs.formFieldPath);
  //   const obsUpdated = obs.cloneForAddMore(nextFormFieldPath);
  //   const clonedRecord = this.state.data
  //     .getRecord(obs.formFieldPath)
  //     .set('formFieldPath', nextFormFieldPath)
  //     .set('obs', obsUpdated);
  //   const data = this.state.data.setRecord(clonedRecord);
  //   const updatedState = data.prepareRecordsForAddMore(obs.formFieldPath);
  //
  //   if(this.state.obs && this.state.obs.groupMembers) {
  //     const obsClone = this.state.obs;
  //
  //     const updatedObsGroupMember = obsClone.groupMembers.push(obsUpdated);
  //     const updatedObs = obsClone.setIn(['groupMembers'], updatedObsGroupMember)
  //
  //     this.setState({data: updatedState.data, obs: updatedObs});
  //   }
  //   else {
  //     this.setState({data: updatedState.data});
  //   }
  // }
  //
  // onControlRemove(obs) {
  //   const obsVoid = obs.void();
  //   const updatedObs = this.props.mapper.setValue(this.state.obs, obsVoid);
  //   const data = this._changeValue(obs, []).deleteRecord(obs);
  //   const updatedState = data.prepareRecordsForAddMore(obs.formFieldPath);
  //   const updatedErrors = getErrors(data.getRecords());
  //
  //   this.setState({ data: updatedState.data, obs: updatedObs });
  //   this.props.onValueChanged(updatedObs, updatedErrors);
  // }

  _changeValue(obs, errors) {
    const bahmniRecord = this.state.data.getRecord(obs.formFieldPath)
      .set('obs', obs)
      .set('errors', errors);
    return this.state.data.setRecord(bahmniRecord);
  }
};

export default addMoreDecorator;
