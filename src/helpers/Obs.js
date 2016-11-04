import { createFormNamespace } from './formNamespace';

export class Obs {
  constructor(formUuid, metadata, extras) {
    this._formUuid = formUuid;
    this._metadata = metadata;
    this.concept = metadata.concept;
    this.formNamespace = createFormNamespace(formUuid, metadata.id);
    if (extras) {
      this.uuid = extras.uuid;
      this.value = extras.value;
      this.observationDateTime = extras.observationDateTime;
      this.voided = extras.voided;
    }
  }

  get() {
    return this.value;
  }

  set(value) {
    const clone = new Obs(this._formUuid, this._metadata, this);
    clone.observationDateTime = null;
    clone.value = value;
    return clone;
  }

  void() {
    const clone = new Obs(this._formUuid, this._metadata, this);
    clone.voided = true;
    return clone;
  }

  equals(o) {
    return this.value === o.value;
  }
}
