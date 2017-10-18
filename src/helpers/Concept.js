import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

export class Concept {
  constructor(concept) {
    this.concept = concept;
  }

  getAbnormalSetMember() {
    if (this.concept && this.concept.set) {
      const abnormalConcept = this.concept.setMembers.find(c => c.conceptClass.name === 'Abnormal');
      return this._getConcept(abnormalConcept);
    }
    return undefined;
  }

  findFirstNumericSetMember() {
    if (this.concept && this.concept.set) {
      const numericConcept = this.concept.setMembers.find(c => c.datatype.name === 'Numeric');
      return this._getConcept(numericConcept);
    }
    return undefined;
  }

  getConcept() {
    return this._getConcept(this.concept);
  }

  _getSetMembers(concept) {
    if (concept && concept.set) {
      return concept.setMembers.map(c => this._getConcept(c));
    }
    return undefined;
  }

  _getConcept(concept) {
    return Object.assign({}, {
      name: concept.name.name,
      uuid: concept.uuid,
      datatype: concept.datatype.name,
      conceptClass: concept.conceptClass.name,
      conceptHandler: concept.handler,
    }, this._getConceptProperties(concept));
  }

  _getConceptProperties(concept) {
    if (concept.set) {
      return {
        set: concept.set,
        setMembers: this._getSetMembers(concept),
      };
    }
    return {
      description: !isEmpty(concept.descriptions) ?
        { value: get(concept, 'descriptions[0].display') } : undefined,
      units: concept.units,
      hiNormal: concept.hiNormal,
      lowNormal: concept.lowNormal,
      hiAbsolute: concept.hiAbsolute,
      lowAbsolute: concept.lowAbsolute,
      answers: concept.answers,
      properties: {
        allowDecimal: concept.allowDecimal,
      },
    };
  }

  getNumericContext() {
    return {
      units: this.concept.units,
      hiNormal: this.concept.hiNormal,
      lowNormal: this.concept.lowNormal,
      hiAbsolute: this.concept.hiAbsolute,
      lowAbsolute: this.concept.lowAbsolute,
    };
  }

}
