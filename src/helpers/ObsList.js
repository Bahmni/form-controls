/* eslint-disable new-cap */
import { Record, List } from 'immutable';

export const ImmutableObsList = Record({
  formNamespace: undefined,
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

}
/* eslint-disable new-cap */
