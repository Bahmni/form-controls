import { ObsList } from 'src/helpers/ObsList';
import { List } from 'immutable';
import _ from 'lodash';
import { createFormNamespaceAndPath, getKeyPrefixForControl } from 'src/helpers/formNamespace';
import flattenDeep from 'lodash/flattenDeep';
import ObservationMapper from '../helpers/ObservationMapper';
import { isAnyAncestorOrControlHasAddMore } from 'src/helpers/ControlUtil';

export class SectionMapper {

  getInitialObject(formName, formVersion, control, currentLayerObs, bahmniObservations,
                   parentFormFieldPath) {
    return this._getInitialObjectInternal(formName, formVersion, control, bahmniObservations,
        parentFormFieldPath);
  }

  _getInitialObjectInternal(formName, formVersion, control, bahmniObservations,
                            parentFormFieldPath) {
    const obsList = bahmniObservations || new List();

    if (isAnyAncestorOrControlHasAddMore(control, parentFormFieldPath)
        && !_.isEmpty(bahmniObservations)) {
      const keyPrefix = getKeyPrefixForControl(formName, formVersion, control.id,
          parentFormFieldPath);
      const segregatedObs = this.segregateObsByAddMoreSections(keyPrefix, obsList);
      if (!_.isEmpty(segregatedObs)) {
        return segregatedObs.map(obsArray => {
          const formFieldPath = obsArray[0].formFieldPath
              .substring(0, keyPrefix.formFieldPath.length + 2);
          return new ObsList({ obsList: obsArray, formFieldPath });
        });
      }
    }
    const { formFieldPath } = createFormNamespaceAndPath(formName, formVersion, control.id,
        parentFormFieldPath);
    return [new ObsList({ obsList, formFieldPath })];
  }

  segregateObsByAddMoreSections(prefix, bahmniObservations) {
    const filteredObs = bahmniObservations.filter(obs =>
        obs.formFieldPath.startsWith(prefix.formFieldPath));
    const groupedObs = _.groupBy(filteredObs, obs =>
        obs.formFieldPath.slice(prefix.formFieldPath.length).split('/')[0]);
    return _.values(groupedObs);
  }

  getValue() {
    return {};
  }

  getData(record) {
    const r = (new ObservationMapper()).from(record);

    return flattenDeep(r);
  }

  getChildren(data) {
    return data.obsList;
  }
}
