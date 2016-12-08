import { expect } from 'chai';
import { Concept } from 'src/helpers/Concept';

describe.skip('Concept', () => {
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

  it('should retrieve abnormal set member', () => {
    const concept = new Concept(abnormalConcept);
    const abnormalSetMember = concept.getAbnormalSetMember();
    expect(abnormalSetMember).to.be.eql({
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
    });
  });

  it('should retrieve first numeric set member', () => {
    const concept = new Concept(abnormalConcept);
    const numericSetMember = concept.findFirstNumericSetMember();
    expect(numericSetMember).to.be.eql({
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
    });
  });

  it('should retrieve the setMembers of a concept', () => {
    const concept = new Concept(abnormalConcept);
    const members = concept.getSetMembers();
    expect(members.length).to.be.eql(2);
    expect(members[0]).to.be.eql({
      name: 'Pulse',
      uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
      datatype: 'Numeric',
      properties: {
        allowDecimal: true,
      },
    });

    expect(members[1]).to.be.eql({
      name: 'Pulse Abnormal',
      uuid: 'c36c7c98-3f10-11e4-adec-0800271c1b75',
      datatype: 'Boolean',
      properties: {
        allowDecimal: null,
      },
    });
  });
});
