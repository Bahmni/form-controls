import { OrderedMap as ImmutableMap, Record } from 'immutable';
import isEmpty from 'lodash/isEmpty';
import constants from 'src/constants';
import MapperStore from 'src/helpers/MapperStore';
import { setupAddRemoveButtonsForAddMore } from 'src/helpers/controlsParser';
import sortBy from 'lodash/sortBy';
import { Util } from 'src/helpers/Util';

export const ControlRecord = new Record({
  control: undefined,
  formFieldPath: '',
  obs: undefined,
  enabled: true,
  showAddMore: false,
  showRemove: false,
  errors: [],
  data: undefined,
  mapper: undefined,
  active: true,
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

  deleteRecord(obs) {
    const voidedObs = obs.void();
    const inactiveRecord = this.getRecord(obs.formFieldPath)
      .set('active', false).set('obs', voidedObs);
    return this.setRecord(inactiveRecord);
  }

  getRecord(formFieldPath) {
    return this.get('data').get(formFieldPath);
  }

  generateFormFieldPath(formFieldPath) {
    const prefix = formFieldPath.split('-');
    const filteredRecords = this.getRecords()
      .filter(record => record.formFieldPath.startsWith(prefix[0]));
    const sortedRecords = sortBy(filteredRecords,
      record => Util.toInt(record.formFieldPath.split('-')[1]));
    const latestFieldPath = sortedRecords[sortedRecords.length - 1].formFieldPath.split('-');
    return `${latestFieldPath[0]}-${Util.increment(latestFieldPath[1])}`;
  }

  prepareRecordsForAddMore(formFieldPath) {
    const formFieldPathPrefix = formFieldPath.substring(0, formFieldPath.indexOf('-'));
    const filteredRecords = this.getActiveRecords()
      .filter(record => record.formFieldPath.startsWith(formFieldPathPrefix));
    const recordsWithNoAddMore = setupAddRemoveButtonsForAddMore(filteredRecords);
    let data = this;
    for (const record of recordsWithNoAddMore) {
      data = this._setRecordInternal(data, record);
    }

    return this.set('data', data);
  }

  _setRecordInternal(state, record) {
    return state.setRecord(record);
  }

  getRecords() {
    return this.get('data').toArray();
  }

  getActiveRecords() {
    return this.get('data').filter(r => r.active).toArray();
  }
}

function getRecords(controls, formName, formVersion, bahmniObservations) {
  const records = controls.map((control) => {
    const mapper = MapperStore.getMapper(control);
    const obsArray = mapper.getInitialObject(formName, formVersion, control, bahmniObservations);

    return obsArray.map(obs => new ControlRecord({ formFieldPath: obs.formFieldPath,
      obs, mapper, control, enabled: false, showAddMore: true }));
  });

  return [].concat.apply([], records);
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
