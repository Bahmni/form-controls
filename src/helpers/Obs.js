import { createFormNamespace } from './formNamespace';

export class Obs {
  constructor(formUuid, metadata, observation) {
    this.concept = metadata.concept;
    this.formNamespace = createFormNamespace(formUuid, metadata.id);
    if (observation) {
      this.uuid = observation.uuid;
      this.value = observation.value;
      this.observationDateTime = observation.observationDateTime;
      this.voided = observation.voided;
    }
  }

  getUuid() {
    return this.uuid;
  }

  getValue() {
    return this.value;
  }

  isDirty(value) {
    return this.value !== value;
  }

  setValue(value) {
    if (this.isDirty(value)) {
      this.observationDateTime = null;
      this.value = value;
      this.voided = false;
    }
  }

  void() {
    this.voided = true;
  }

  isVoided() {
    return this.voided;
  }

  equals(o) {
    return this.value === o.value;
  }
}
