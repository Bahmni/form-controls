import { Map as ImmutableMap, Record } from 'immutable';
import { Obs, obsFromMetadata } from 'src/helpers/Obs';
import { createFormNamespace } from 'src/helpers/formNamespace';
import each from 'lodash/each';

export const ControlRecord = new Record({
  control: undefined,
  formNamespace: '',
  obs: undefined, enabled: true,
  errors: [],
  data: undefined,
});

export const ImmutableControlState = new Record({
  data: new ImmutableMap(),
});

export class ControlState extends ImmutableControlState {
  setRecords(records) {
    const map = new Map();
    records.forEach((record) => {
      map.set(record.formNamespace, record);
    });
    return this.set('data', new ImmutableMap(map));
  }

  setRecord(bahmniRecord) {
    return this.set('data', this.get('data').setIn([bahmniRecord.formNamespace], bahmniRecord));
  }

  getRecord(formNamespace) {
    return this.get('data').get(formNamespace);
  }

  getRecords() {
    return this.get('data').toArray();
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
    return new ControlRecord({ formNamespace, obs, control, enabled: false });
  });
}

export function controlStateFactory(metadata = { controls: [] }, bahmniObservations = []) {
  const records = getRecords(metadata.controls, metadata.uuid, bahmniObservations);
  return new ControlState().setRecords(records);
}
