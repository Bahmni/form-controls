import { Map as ImmutableMap, Record } from 'immutable';
import isEmpty from 'lodash/isEmpty';
import constants from 'src/constants';
import MapperStore from 'src/helpers/MapperStore';

export const ControlRecord = new Record({
  control: undefined,
  formFieldPath: '',
  obs: undefined, enabled: true,
  errors: [],
  data: undefined,
  mapper: undefined,
  getObject() {
    return this.mapper.getObject(this.obs);
  },
});

export const ImmutableControlState = new Record({
  data: new ImmutableMap(),
});

export class ControlState extends ImmutableControlState {
  setRecords(records) {
    const map = new Map();
    records.forEach((record) => {
      map.set(record.formFieldPath, record);
    });
    return this.set('data', new ImmutableMap(map));
  }

  setRecord(bahmniRecord) {
    return this.set('data', this.get('data').setIn([bahmniRecord.formFieldPath], bahmniRecord));
  }

  getRecord(formFieldPath) {
    return this.get('data').get(formFieldPath);
  }

  getRecords() {
    return this.get('data').toArray();
  }
}

function getRecords(controls, formName, formVersion, bahmniObservations) {
  return controls.map((control) => {
    const mapper = MapperStore.getMapper(control);
    const obs = mapper.getInitialObject(formName, formVersion, control, bahmniObservations);
    return new ControlRecord({ formFieldPath: obs.formFieldPath,
      obs, mapper, control, enabled: false });
  });
}

export function controlStateFactory(metadata, bahmniObs, formName, formVersion) {
  const name = formName || metadata.name;
  const version = formVersion || metadata.version;
  const records = getRecords(metadata.controls, name, version, bahmniObs);
  return new ControlState().setRecords(records);
}

export function getErrors(records) {
  return [].concat(...records.map((record) => record.get('errors'))
    .filter((error) =>
    error && !isEmpty(error.filter((err) => err.type === constants.errorTypes.error))));
}
