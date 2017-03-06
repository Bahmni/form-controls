import { createObsFromControl } from 'src/helpers/Obs';
import { cloneDeep } from 'lodash';

export class ObsMapper {

  getInitialObject(formName, formVersion, control, bahmniObservations) {
    return createObsFromControl(formName, formVersion, control, bahmniObservations);
  }

  _isNewVoidedObs(obs) {
    return !obs.getUuid() && obs.isVoided();
  }

  _hasNoValue(obs) {
    const value = obs.getValue();
    return value === '' || value === undefined || value === null;
  }

  getValue(obs) {
    return { value: obs.value, comment: obs.comment};
  }

  getData(record){
    let obs = cloneDeep(record.dataSource);
    if (obs.formFieldPath != record.formFieldPath) {
      obs.uuid = undefined;
      obs.formFieldPath = record.formFieldPath;
    }
    obs.value = record.value.value;
    obs.comment = record.value.comment;
    obs.voided = !record.value.value;

    return obs;
  }

  getChildren(obs){
    return [];
  }
}
