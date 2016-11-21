import {List, Map, Record} from 'immutable'
import {ObsMapper} from 'src/helpers/ObsMapper';
import {Obs, ImmutableObs, obsFromMetadata} from 'src/helpers/Obs';
import {createFormNamespace} from 'src/helpers/formNamespace'

export const ControlRecord = new Record({
  formNamespace: '',
  obs: undefined,
  enabled: true,
  errors: new List(),
  data: undefined
});

export class ControlState {
  constructor(records) {
    this.records = records;
    this.data = new Map();
    this._initialize();
  }

  _initialize() {
    this.records.forEach((record) => {
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
    if (otherControlState.length != this.data.length) { return false; }
    this.data.every((record, i) => {
      record.equals(otherControlState[i]);
    });
  }
}

export function controlStateFactory(metadata = {controls: []}, bahmniObservations = []) {
  const formUuid = metadata.uuid;
  //generate records from metadata
  const records = metadata.controls.map((control) => {
    const formNamespace = createFormNamespace(formUuid, control.id);
    const index = bahmniObservations.findIndex(observation => {
      return observation.formNamespace === formNamespace
    });
    //if observation exists then load else create dummy observations
    let obs;
    if (index >= 0) {
      obs = new Obs(bahmniObservations[index]);
    } else {
      obs = obsFromMetadata(formNamespace, metadata);
    }
    return new ControlRecord({ formNamespace, obs, enabled: false });
  });

  return new ControlState(records);
}
