import { createObsFromControl } from 'src/helpers/Obs';
import { List } from 'immutable';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import isEmpty from 'lodash/isEmpty';
import { createFormNamespaceAndPath } from 'src/helpers/formNamespace';
import { obsFromMetadata } from 'src/helpers/Obs';
import { ObsList } from 'src/helpers/ObsList';
import { getKeyPrefixForControl } from 'src/helpers/formNamespace';
import { cloneDeep } from 'lodash';

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
      return [new ObsList({
        obsList: new List(),
        formFieldPath: formNamespaceAndPath.formFieldPath, obs,
      })];
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
    return { value: isEmpty(updatedObsList) ? undefined : updatedObsList };
  }

  buildObs(dataSource, value, uuid) {
    const obs = cloneDeep(dataSource.obs);
    obs.uuid = uuid;
    obs.value = value;
    obs.voided = !value;
    return obs;
  }

  findObs(valueList, uuid) {
    return valueList && valueList.filter(value => value.uuid === uuid);
  }

  getData(record) {
    const obsArray = [];
    if (record.value.value) {
      record.value.value.forEach(
        value => {
          const targetValue = record.dataSource.obsList.filter(
            (obs) => obs.value.uuid === value.uuid
          );
          const uuid = targetValue.size > 0 && targetValue.get(0).uuid;
          obsArray.push(this.buildObs(record.dataSource, value, uuid));
        }
      );
    }
    record.dataSource.obsList.forEach(obs => {
      const foundObs = this.findObs(record.value.value, obs.value.uuid);
      if (!foundObs || foundObs.length === 0) {
        obsArray.push(this.buildObs(record.dataSource, undefined, obs.uuid));
      }
    });

    return obsArray;
  }
}
