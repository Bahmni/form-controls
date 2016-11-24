/* eslint-disable new-cap */
import { Record } from 'immutable';

export const ImmutableObs = Record({
  concept: undefined,
  uuid: undefined,
  value: undefined,
  observationDateTime: undefined,
  voided: false,
  comment: undefined,
  formNamespace: undefined,
  groupMembers:[],
});

export class Obs extends ImmutableObs {
  getUuid() {
    return this.get('uuid');
  }

  getValue() {
    return this.get('value');
  }

  isDirty(value) {
    return this.get('value') !== value;
  }

  setValue(value) {
    if (this.isDirty(value)) {
      return this.set('observationDateTime', null).set('value', value).set('voided', false);
    }
    return this;
  }

  setComment(comment) {
    return this.set('comment', comment);
  }

  getComment() {
    return this.get('comment');
  }

  void() {
    return this.set('voided', true).set('value', undefined);
  }

  isVoided() {
    return this.get('voided');
  }

  getFormNamespace() {
    return this.get('formNamespace');
  }
}
/* eslint-disable new-cap */

export function obsFromMetadata(formNamespace, metadata) {
  return new Obs({
    concept: metadata.concept,
    formNamespace,
    voided: true,
  });
}
