import { createObsFromControl } from 'src/helpers/Obs';
import { cloneDeep } from 'lodash';
import { Util } from 'src/helpers/Util';

export class ObsMapper {

  getInitialObject(formName, formVersion, control, bahmniObservations, allObs,
                   parentFormFieldPath) {
    return createObsFromControl(formName, formVersion, control, bahmniObservations,
        parentFormFieldPath);
  }

  getValue(obs) {
    return { value: obs.value, comment: obs.comment, interpretation: obs.interpretation };
  }

  getData(record) {
    const obs = cloneDeep(record.dataSource).toJS();
    if (record.voided) {
      obs.uuid = record.dataSource.uuid;
    } else if (obs.formFieldPath !== record.formFieldPath) {
      obs.uuid = undefined;
    }
    obs.formFieldPath = record.formFieldPath;
    let value = record.voided ? undefined : record.value.value;
    if (typeof value === 'string') {
      value = value && value.trim() !== '' ? value.trim() : undefined;
    }
    obs.value = value;
    obs.comment = record.value.comment;
    obs.interpretation = record.value.interpretation;
    obs.voided = value === undefined;
    obs.inactive = !record.active;
    if (record.control.concept && Util.isComplexMediaConcept(record.control.concept)) {
      if (obs.voided && obs.formFieldPath.split('-')[1] !== '0') {
        return null;
      }
      if (!obs.voided) {
        obs.voided = obs.value.indexOf('voided') > 0;
        if (obs.voided) {
          // removing voided suffix for Images/Videos (voided obs) before sending to bahmni apps
          obs.value = obs.value.replace(/voided/g, '');
        }
      }
    }
    return (obs.value === undefined && obs.uuid === undefined) ? null : obs;
  }

  getChildren() {
    return [];
  }
}
