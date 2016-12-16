import { createObsFromControl } from 'src/helpers/Obs';
import { List } from 'immutable';
import filter from 'lodash/filter';
import each from 'lodash/each';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { createFormNamespace } from 'src/helpers/formNamespace';
import { obsFromMetadata } from 'src/helpers/Obs';

export class ObsListMapper {

  getInitialObject(formUuid, control, bahmniObservations) {
    const formNamespace = createFormNamespace(formUuid, control.id);
    this.obs = obsFromMetadata(formNamespace, control);
    const filteredObs = filter(bahmniObservations, (obs) => obs.formNamespace === formNamespace);
    let obsList = new List();
    each(filteredObs, (obs) => {
      obsList = obsList.push(createObsFromControl(formUuid, control, [obs]));
    });
    return obsList;
  }

  _hasNoValue(obs) {
    const value = obs.getValue();
    return value === '' || value === undefined || value === null;
  }

  getValue(obsList) {
    const updatedObsList = [];
    obsList.forEach((obs) => {
      const updatedObs = (this._hasNoValue(obs) || obs.isVoided()) ? undefined : obs.getValue();
      if (updatedObs) {
        updatedObsList.push(updatedObs);
      }
    });
    return isEmpty(updatedObsList) ? undefined : updatedObsList;
  }

  setValue(obsList, values) {
    let updatedList = new List();
    map(values, (value) => {
      const existingObs = obsList.find((obs) => obs.value && obs.value.uuid === value.uuid);
      const updatedObs = existingObs || this.obs.setValue(value);
      updatedList = updatedList.push(updatedObs);
    });

    obsList.forEach((obs) => {
      if (!updatedList.includes(obs)) {
        if (obs.getUuid()) {
          const voidedObs = obs.void();
          updatedList = updatedList.push(voidedObs);
        }
      }
    });
    return updatedList;
  }
}
