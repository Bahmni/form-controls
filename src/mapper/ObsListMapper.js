import { createObsFromControl } from 'src/helpers/Obs';
import { List } from 'immutable';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { createFormNamespaceAndPath } from 'src/helpers/formNamespace';
import { obsFromMetadata } from 'src/helpers/Obs';
import { ObsList } from 'src/helpers/ObsList';
import { getKeyPrefixForControl } from 'src/helpers/formNamespace';

export class ObsListMapper {

  getInitialObject(formName, formVersion, control, bahmniObservations) {
    const formNamespaceAndPath = createFormNamespaceAndPath(formName, formVersion, control.id);
    const obs = obsFromMetadata(formNamespaceAndPath, control);

    const keyPrefix = getKeyPrefixForControl(formName, formVersion, control.id);
    const filteredObs = filter(bahmniObservations,
      (observation) => observation.formFieldPath.startsWith(keyPrefix.formFieldPath));
    const groupedObs = groupBy(filteredObs, 'formFieldPath');

    const obsLists = [];
    Object.keys(groupedObs).sort().forEach(formFieldPath => {
      let obsList = new List();
      for (const observation of groupedObs[formFieldPath]) {
        obsList = obsList.concat(createObsFromControl(formName,
          formVersion, control, [observation]));
      }
      obsLists.push(new ObsList({ obsList, formFieldPath,
        obs: obs.set('formFieldPath', formFieldPath) }));
    });
    if (obsLists.length === 0) {
      return [new ObsList({ obsList: new List(),
        formFieldPath: formNamespaceAndPath.formFieldPath, obs })];
    }
    return obsLists;
  }

  _hasNoValue(obs) {
    const value = obs.getValue();
    return value === '' || value === undefined || value === null;
  }

  getValue(obsListRecord) {
    const updatedObsList = [];
    const obsList = obsListRecord.getObsList();
    obsList.forEach((obs) => {
      const updatedObs = (this._hasNoValue(obs) || obs.isVoided()) ? undefined : obs.getValue();
      if (updatedObs) {
        updatedObsList.push(updatedObs);
      }
    });
    return isEmpty(updatedObsList) ? undefined : updatedObsList;
  }

  setValue(obsListRecord, values) {
    let updatedList = new List();
    const obsList = obsListRecord.getObsList();
    map(values, (value) => {
      const existingObs = obsList.find((obs) => obs.value && obs.value.uuid === value.uuid);
      const updatedObs = existingObs || obsListRecord.getObs().setValue(value);
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
    return obsListRecord.setObsList(updatedList);
  }

  getObject(obsListRecord) {
    return obsListRecord.getObsList().toJS();
  }
}
