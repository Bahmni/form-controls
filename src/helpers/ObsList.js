/* eslint-disable new-cap */
import { Record, List } from 'immutable';

export const ImmutableObsList = Record({
  formFieldPath: undefined,
  obs: undefined,
  obsList: new List(),
});

export class ObsList extends ImmutableObsList {
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

    return observationList;
  }
}
/* eslint-disable new-cap */
