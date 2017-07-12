import { createObsFromControl } from 'src/helpers/Obs';
import { cloneDeep } from 'lodash';

export class ObsMapper {

  getInitialObject(formName, formVersion, control, bahmniObservations) {
    return createObsFromControl(formName, formVersion, control, bahmniObservations);
  }

  getValue(obs) {
    return { value: obs.value, comment: obs.comment, interpretation: obs.interpretation };
  }

  getData(record) {
    const obs = cloneDeep(record.dataSource);
    if (obs.formFieldPath !== record.formFieldPath) {
      obs.uuid = undefined;
      obs.formFieldPath = record.formFieldPath;
    }
    let value = record.value.value;
    if (typeof value === 'string') {
      value = value && value.trim() !== '' ? value.trim() : undefined;
    }
    obs.value = value;
    obs.comment = record.value.comment;
    obs.interpretation = record.value.interpretation;
    obs.voided = value === undefined;
    obs.inactive = !record.active;
    if (record.control.concept && record.control.concept.datatype === 'Complex') {
      if (obs.voided && obs.formFieldPath.split('-')[1] !== '0') {
        return null;
      }
      if (!obs.voided) {
        obs.voided = obs.value.indexOf('voided') > 0;
      }
    }
    return (obs.value === undefined && obs.uuid === undefined) ? null : obs;
  }

  getChildren() {
    return [];
  }
}
