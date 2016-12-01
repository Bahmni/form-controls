import { Map, Record } from 'immutable';
import { Obs, obsFromMetadata } from 'src/helpers/Obs';
import { createFormNamespace } from 'src/helpers/formNamespace';
import each from 'lodash/each';

export const ControlRecord = new Record({
  formNamespace: '',
  obs: undefined,
  enabled: true,
  errors: [],
  data: undefined,
});

export class ControlState {
  constructor(records) {
    this.data = new Map();
    this._initialize(records);
  }

  _initialize(records) {
    records.forEach((record) => {
      this.data = this.data.setIn([record.formNamespace], record);
    });
  }

  setRecord(bahmniRecord) {
    this.data = this.data.setIn([bahmniRecord.formNamespace], bahmniRecord);
    return this;
  }

  getRecord(formNamespace) {
    return this.data.get(formNamespace);
  }

  getRecords() {
    return this.data.toArray();
  }

  equals(otherControlState) {
    if (!otherControlState) { return false; }
    if (otherControlState.length !== this.data.length) { return false; }
    return this.data.every((record, i) =>
      record.equals(otherControlState[i])
    );
  }
}

function getRecords(controls, formUuid, bahmniObservations) {
  return controls.map((control) => {
    const formNamespace = createFormNamespace(formUuid, control.id);
    const index = bahmniObservations.findIndex(observation =>
      observation.formNamespace === formNamespace
    );
    // if observation exists then load else create dummy observations
    let obs;
    if (index >= 0) {
      obs = new Obs(bahmniObservations[index]).removeGroupMembers();
    } else {
      obs = obsFromMetadata(formNamespace, control);
    }
    if (control.controls && control.controls.length > 0) {
      const groupMembers = index >= 0 ? bahmniObservations[index].groupMembers : bahmniObservations;
      each(getRecords(control.controls, formUuid, groupMembers), (obsGroupMember) => {
        obs = obs.addGroupMember(obsGroupMember.obs);
      });
    }
    return new ControlRecord({ formNamespace, obs, enabled: false });
  });
}

export function controlStateFactory(metadata = { controls: [] }, bahmniObservations = []) {
  const records = getRecords(metadata.controls, metadata.uuid, bahmniObservations);
  return new ControlState(records);
}
