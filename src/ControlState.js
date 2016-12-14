import { Map as ImmutableMap, Record } from 'immutable';
import { Obs, obsFromMetadata } from 'src/helpers/Obs';
import { createFormNamespace } from 'src/helpers/formNamespace';
import isEmpty from 'lodash/isEmpty';
import constants from 'src/constants';
import MapperStore from 'src/helpers/MapperStore';

export const ControlRecord = new Record({
  control: undefined,
  formNamespace: '',
  obs: undefined, enabled: true,
  errors: [],
  data: undefined,
  mapper: undefined,
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
    const mapper = MapperStore.getMapper(control);
    const formNamespace = createFormNamespace(formUuid, control.id);
    const index = bahmniObservations.findIndex(observation =>
      observation.formNamespace === formNamespace
    );
    // if observation exists then load else create dummy observations
    let obs;
    if (index >= 0) {
      obs = new Obs(bahmniObservations[index]);
    } else {
      obs = obsFromMetadata(formNamespace, control);
    }
    return new ControlRecord({ formNamespace, obs, mapper, control, enabled: false });
  });
}

export function controlStateFactory(metadata = { controls: [] }, bahmniObs = [], formUuid) {
  const formId = formUuid || metadata.uuid;
  const records = getRecords(metadata.controls, formId, bahmniObs);
  return new ControlState().setRecords(records);
}

export function getErrors(records) {
  return [].concat(...records.map((record) => record.get('errors'))
    .filter((error) =>
    error && !isEmpty(error.filter((err) => err.type === constants.errorTypes.error))));
}
