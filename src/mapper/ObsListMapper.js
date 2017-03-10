import { createObsFromControl } from 'src/helpers/Obs';
import { List } from 'immutable';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import isEmpty from 'lodash/isEmpty';
import { createFormNamespaceAndPath } from 'src/helpers/formNamespace';
import { obsFromMetadata } from 'src/helpers/Obs';
import { ObsList } from 'src/helpers/ObsList';
import { getKeyPrefixForControl } from 'src/helpers/formNamespace';
import {cloneDeep} from "lodash";

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

      obs.formFieldPath = formFieldPath;

      obsLists.push(new ObsList({ obsList, formFieldPath, obs }));
    });
    if (obsLists.length === 0) {
      return [new ObsList({ obsList: new List(),
        formFieldPath: formNamespaceAndPath.formFieldPath, obs })];
    }
    return obsLists;
  }

  getValue(obsListRecord) {
    const updatedObsList = [];
    const obsList = obsListRecord.getObsList();
    obsList.forEach((obs) => {
      if (obs.value) {
        updatedObsList.push(obs.value);
      }
    });
    return {value: isEmpty(updatedObsList) ? undefined : updatedObsList};
  }

  getData(record) {
    let obsArray = [];
    if (record.value.value) {
      record.value.value.forEach(value => {
        let obsList = cloneDeep(record.dataSource.obs);
        obsList.value = value;
        obsList.voided = false;
        obsArray.push(obsList);
      })
    } else {
      obsArray.push(cloneDeep(record.dataSource.obs));
    }
    return obsArray;
  }
}
