
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

  _getConcept(concept) {
    return {
      name: concept.name.name,
      uuid: concept.uuid,
      datatype: concept.datatype.name,
      properties: {
        allowDecimal: concept.allowDecimal,
      },
    };
  }

}
