/*
import { expect } from "chai";
import { Concept } from "src/helpers/Concept";
import { Metadata } from "src/helpers/Metadata";

class IDGenerator{
  constructor(offset = 1){
    this.nextId = offset;
  }
  getId(){
    return this.nextId++;
  }
}
describe.skip('Metadata', () => {
  const abnormalConcept = {
    uuid: 'c36af094-3f10-11e4-adec-0800271c1b75',
    display: 'Pulse Data',
    allowDecimal: null,
    name: {
      uuid: 'c36af707-3f10-11e4-adec-0800271c1b75',
      name: 'Pulse Data',
    },
    conceptClass: {
      uuid: '82516ba3-3f10-11e4-adec-0800271c1b75',
      name: 'Concept Details',
    },
    datatype: {
      uuid: '8d4a4c94-c2cc-11de-8d13-0010c6dffd0f',
      name: 'N/A',
    },
    set: true,
    setMembers: [
      {
        uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
        display: 'Pulse',
        allowDecimal: true,
        name: {
          uuid: 'c36bcba8-3f10-11e4-adec-0800271c1b75',
          name: 'Pulse',
        },
        conceptClass: {
          uuid: '8d492774-c2cc-11de-8d13-0010c6dffd0f',
          name: 'Misc',
        },
        datatype: {
          uuid: '8d4a4488-c2cc-11de-8d13-0010c6dffd0f',
          name: 'Numeric',
        },
      },
      {
        uuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
        display: 'Pulse Abnormal',
        allowDecimal: null,
        name: {
          uuid: 'c36c82d6-3f10-11e4-adec-0800271c1b75',
          name: 'Pulse Abnormal',
        },
        conceptClass: {
          uuid: '824a6818-3f10-11e4-adec-0800271c1b75',
          name: 'Abnormal',
        },
        datatype: {
          uuid: '8d4a5cca-c2cc-11de-8d13-0010c6dffd0f',
          name: 'Boolean',
        },
      },
    ],
  };

  it('should retrieve metadata for concept set', () => {
    const idGenerator = new IDGenerator();
    const concept = new Concept(abnormalConcept);
    const metadata = new Metadata().getMetadataForConcept(concept.getConcept(), idGenerator, 'obsGroupControl', 'obsControl');
    console.log("--->", metadata);
    expect(metadata.id).to.be.eql('3');
    expect(metadata.type).to.be.eql('obsGroupControl');
    expect(metadata.label).to.be.eql({ type: 'label', value: 'Pulse Data' });
    expect(metadata.concept).to.be.deep.eql(concept.getConcept());
    expect(metadata.controls.length).to.be.eql(2);
    expect(metadata.id).to.be.eql(200);

    expect(metadata.controls[0].id).to.be.eql('1');
    expect(metadata.controls[0].type).to.be.eql('obsControl');
    expect(metadata.controls[0].label).to.be.eql({ type: 'label', value: 'Pulse' });
    expect(metadata.controls[0].concept).to.be.eql(concept.getConcept().setMembers[0]);
    expect(metadata.controls[0].id).to.be.eql(300);

    expect(metadata.controls[1].id).to.be.eql('2');
    expect(metadata.controls[1].type).to.be.eql('obsControl');
    expect(metadata.controls[1].label).to.be.eql({ type: 'label', value: 'Pulse Abnormal' });
    expect(metadata.controls[1].concept).to.be.eql(concept.getConcept().setMembers[1]);
    expect(metadata.controls[1].id).to.be.eql(301);
  });

  it('should retrieve metadata for a concept', () => {
    const idGenerator = new IDGenerator();
    const concept = new Concept(abnormalConcept.setMembers[0]);
    const metadata = new Metadata().getMetadataForConcept(concept.getConcept(), idGenerator, 'obsControl', undefined);

    expect(metadata.type).to.be.eql('obsControl');
    expect(metadata.label).to.be.eql({ type: 'label', value: 'Pulse' });
    expect(metadata.concept).to.be.eql(concept.getConcept());
  });

  it('should add the required fields for the metadata', () => {
    const idGenerator = new IDGenerator(20);
    const concept = new Concept(abnormalConcept.setMembers[0]);

    const metadata = new Metadata().getMetadataForConcept(concept.getConcept(), idGenerator, 'obsControl', undefined, { row: 2, column: 4});
    expect(metadata.id).to.eql('20');
    expect(metadata.properties.location).to.deep.eql({ row: 2, column: 4 });
  });
});
*/
