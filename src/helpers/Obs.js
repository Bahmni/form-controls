import { Record } from 'immutable'

const ImmutableObs = Record({ concept: undefined, uuid: undefined, value: undefined, observationDateTime: undefined, voided: false, comment: undefined, formNamespace: undefined});

export class Obs extends ImmutableObs{
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
      return this.set('observationDateTime', null).set('value', value).set('voided',false);
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
    return this.set('voided', true);
  }

  isVoided() {
    return this.get('voided');
  }

  getFormNamespace(){
    return this.get('formNamespace');
  }
}
