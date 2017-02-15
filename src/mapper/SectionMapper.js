import isEmpty from 'lodash/isEmpty';
import each from 'lodash/each';
import filter from 'lodash/filter';
import { ObsList } from 'src/helpers/ObsList';
import { List } from 'immutable';
import { createFormNamespaceAndPath } from 'src/helpers/formNamespace';
import flattenDeep from 'lodash/flattenDeep';
import MapperStore from 'src/helpers/MapperStore';
import { getKeyPrefixForControl } from '../helpers/formNamespace';

export class SectionMapper {

  getInitialObject(formName, formVersion, control, bahmniObservations) {
    const obsList =
      this._getInitialObjectInternal(formName, formVersion, control, bahmniObservations);

    return [obsList];
  }

  _getInitialObjectInternal(formName, formVersion, control, bahmniObservations) {
    let obsList = new List();
    obsList = this.findControls(control, formName, formVersion, bahmniObservations, obsList);

    const { formFieldPath } = createFormNamespaceAndPath(formName, formVersion, control.id);
    return new ObsList({ obsList, formFieldPath });
  }

  findControls(control, formName, formVersion, bahmniObservations, oldObsList) {
    let obsList = oldObsList;
    each(control.controls, (item) => {
      if (item.type === 'section') {
        obsList = obsList.push(
          this._getInitialObjectInternal(formName, formVersion, item, bahmniObservations)
        );
      }

      const formFieldPathPrefix =
        getKeyPrefixForControl(formName, formVersion, item.id).formFieldPath;
      const filteredObs = filter(bahmniObservations,
        (observation) => {
          const obsFormFieldPathPrefix = observation.formFieldPath.split('-')[0];
          return obsFormFieldPathPrefix === formFieldPathPrefix;
        }
      );

      if (!isEmpty(filteredObs)) {
        const mapper = MapperStore.getMapper(item);
        obsList = obsList.push(...mapper.getInitialObject(formName, formVersion,
          item, filteredObs));
      }
    });
    return obsList;
  }

  setValue(obsListRecord, obs) {
    let obsList = obsListRecord.getObsList();
    const index = obsList.findIndex(o => o.formFieldPath === obs.formFieldPath);

    if (index === -1) {
      obsList = obsList.push(obs);
    }

    obsList = obsList.setIn([index], obs);

    return obsListRecord.setObsList(obsList);
  }

  getObject(obsListRecord) {
    const observations = [];
    obsListRecord.getObsList().forEach((obs) => {
      observations.push(obs.getObject(obs));
    });

    return flattenDeep(observations);
  }
}
