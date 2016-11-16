import { List, Record } from 'immutable';

const ControlRecord = new Record(
  { obs: undefined, enabled: true, errors: new List(), data: undefined }
);

export class ControlState {
  constructor() {
    this.data = new Map();
  }

  setFields(obs) {
    if (this.data.get(obs.getFormNamespace())) {
      return this.data.setIn([obs.getFormNamespace(), 'obs'], obs);
    }
    return this.data.set(obs.getFormNamespace(), new ControlRecord({ obs: obs }));
  }

  setFields(obs, errors) {
    return this.data.setIn([obs.getFormNamespace(), 'obs'], obs)
      .setIn([obs.getFormNamespace(), 'errors'], errors);
  }

  getData() {
    return this.data;
  }

}
