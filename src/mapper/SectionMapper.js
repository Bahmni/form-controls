import { ObsList } from 'src/helpers/ObsList';
import { List } from 'immutable';
import { createFormNamespaceAndPath } from 'src/helpers/formNamespace';
import flattenDeep from 'lodash/flattenDeep';
import ObservationMapper from '../helpers/ObservationMapper';

export class SectionMapper {

  getInitialObject(formName, formVersion, control, currentLayerObs, bahmniObservations) {
    const obsList =
      this._getInitialObjectInternal(formName, formVersion, control, bahmniObservations);

    return [obsList];
  }

  _getInitialObjectInternal(formName, formVersion, control, bahmniObservations) {
    let obsList = bahmniObservations || new List();
    const { formFieldPath } = createFormNamespaceAndPath(formName, formVersion, control.id);
    return new ObsList({ obsList, formFieldPath });
  }

  getValue() {
    return undefined;
  }

  getData(record) {
    const r = (new ObservationMapper()).from(record);

    return flattenDeep(r);
  }

  getChildren(data) {
    return data.obsList;
  }
}
