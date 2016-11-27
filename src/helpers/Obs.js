/* eslint-disable new-cap */
import { Record, List } from 'immutable';

export const ImmutableObs = Record({
  concept: undefined,
  uuid: undefined,
  value: undefined,
  observationDateTime: undefined,
  voided: false,
  comment: undefined,
  formNamespace: undefined,
  groupMembers: undefined,
});

const NUMERIC_DATATYPE = 'Numeric';
const ABNORMAL_CONCEPT_CLASS = 'Abnormal';


export class Obs extends ImmutableObs {
  getUuid() {
    return this.get('uuid');
  }

  getValue() {
    return this.get('value');
  }

  isDirty(value) {
    if (typeof (this.get('value')) === 'object') {
      return this.get('value').uuid !== value.uuid;
    }
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
    return this.set('voided', true);
  }

  isVoided() {
    return this.get('voided');
  }

  getFormNamespace() {
    return this.get('formNamespace');
  }

  addGroupMember(obs) {
    let groupMembers = this.get('groupMembers');
    if (!groupMembers) {
      groupMembers = new List();
    }
    if (groupMembers.includes(obs)) {
      return this;
    }
    const index = groupMembers.findIndex(o => o.concept === obs.concept);

    if (index === -1) {
      return this.set('groupMembers', groupMembers.push(obs));
    }
    return this.setIn(['groupMembers', index], obs);
  }

  getGroupMembers() {
    return this.get('groupMembers');
  }

  isNumeric() {
    if (this.get('concept') && this.get('concept').datatype === NUMERIC_DATATYPE) return true;

    return false;
  }

  getAbnormalChildObs() {
    return this.get('groupMembers').find(o => o.concept.conceptClass === ABNORMAL_CONCEPT_CLASS);
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
