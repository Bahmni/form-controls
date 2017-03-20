/* eslint-disable new-cap */
import { Record, List } from 'immutable';
import flattenDeep from 'lodash/flattenDeep';

export const ImmutableObsList = Record({
  inactive: false,
  formFieldPath: undefined,
  obs: undefined,
  obsList: new List(),
});

export class ObsList extends ImmutableObsList {

  cloneForAddMore(formFieldPath) {
    return new ObsList({
      obs: this.get('obs').set('formFieldPath', formFieldPath),
      formNamespace: this.get('formNamespace'),
      obsList: new List(),
      formFieldPath,
    });
  }

  void() {
    const voidedObsList = this.obsList.map(obs => obs.void());
    return this.set('obsList', voidedObsList);
  }

  isVoided() {
    return this.obsList.every(obs => obs.isVoided());
  }

  getObsList() {
    return this.get('obsList');
  }

  getObs() {
    return this.get('obs');
  }

  setObsList(obsList) {
    return this.set('obsList', obsList);
  }

  getObject(obsList) {
    const observationList = [];
    obsList.getObsList().forEach((obs) => {
      observationList.push(obs.getObject(obs));
    });

    return flattenDeep(observationList);
  }
}
/* eslint-disable new-cap */
