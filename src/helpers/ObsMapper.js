import {Obs} from "./Obs";
import { createFormNamespace } from './formNamespace';

export class ObsMapper {

  // constructor(formUuid, metadata, observation){
  //
  //   if(observation){
  //     const properties = {uuid: observation.uuid,value: observation.value,observationDateTime : observation.observationDateTime,voided : observation.voided, comment: observation.comment};
  //   }
  //   this.obs = new Obs({ concept: metadata.concept, formNamespace:createFormNamespace(formUuid,metadata.id)});
  // }

  constructor(obs) {
    this.obs = obs;
  }

  _isNewVoidedObs() {
    return !this.obs.getUuid() && this.obs.isVoided();
  }

  _hasNoValue() {
    const value = this.obs.getValue();
    return value === '' || value === undefined;
  }

  getValue() {
    return ((this._hasNoValue() || this.obs.isVoided()) ? undefined : this.obs.getValue());
  }

  getObs() {
    if (this._hasNoValue() || this._isNewVoidedObs()) {
      return undefined;
    }
    return this.obs;
  }

  setValue(value) {
    if (value !== '' && value !== undefined) {
      return this.obs.setValue(value);
    } else {
      return this.obs.void();
    }
  }

  setComment(comment) {
    return this.obs.setComment(comment);
  }

  getComment() {
    return this.obs.getComment();
  }

  equals(finalObs) {
    return this.obs.equals(finalObs);
  }
}
