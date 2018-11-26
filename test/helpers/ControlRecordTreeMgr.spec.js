import { List } from 'immutable';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ControlRecord } from '../../src/helpers/ControlRecordTreeBuilder';
import ControlRecordTreeMgr from '../../src/helpers/ControlRecordTreeMgr';

chai.use(chaiEnzyme());

describe('ControlRecordTreeMgr', () => {
  const concept = {
    answers: [],
    datatype: 'Numeric',
    description: [],
    name: 'Pulse',
    properties: {
      allowDecimal: true,
    },
    uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
  };
  const obsControl = {
    concept,
    hiAbsolute: null,
    hiNormal: 72,
    id: '1',
    label: {
      type: 'label',
      value: 'Pulse(/min)',
    },
    lowAbsolute: null,
    lowNormal: 72,
    properties: {
      addMore: true,
      hideLabel: false,
      location: {
        column: 0,
        row: 0,
      },
      mandatory: true,
      notes: false,
    },
    type: 'obsControl',
    units: '/min',
  };
  let sectionControl;

  before('', () => {
    sectionControl = {
      type: 'section',
      label: {
        translationKey: 'SECTION_2',
        type: 'label',
        value: 'Section',
        id: '2',
      },
      properties: {
        addMore: true,
        location: {
          column: 0,
          row: 1,
        },
      },
      id: '2',
      unsupportedProperties: [],
      controls: [
        obsControl,
      ],
    };
  });

  it('should get the record that is entirely same as given prefix', () => {
    const expectedFormFieldPath = 'SingleObs.1/1-0';
    const mixedFormFieldPath = 'SingleObs.11/0-1';
    const obsRecord = new ControlRecord({
      control: obsControl,
      value: {},
      dataSource: {
        concept,
        formFieldPath: expectedFormFieldPath,
        formNamespace: 'Bahmni',
        voided: true,
      },
      formFieldPath: expectedFormFieldPath,
    });
    const mixedChildRecord = new ControlRecord({
      control: {
        concept,
        hiAbsolute: null,
        hiNormal: 72,
        id: '1',
        label: {
          type: 'label',
          value: 'Pulse(/min)',
        },
        lowAbsolute: null,
        lowNormal: 72,
        properties: {
          addMore: true,
          hideLabel: false,
          location: {
            column: 0,
            row: 0,
          },
          mandatory: true,
          notes: false,
        },
        type: 'obsControl',
        units: '/min',
      },
      value: {},
      dataSource: {
        concept,
        formFieldPath: 'SingleObs.11/0-1',
        formNamespace: 'Bahmni',
        voided: true,
      },
      formFieldPath: mixedFormFieldPath,
    });
    const obsTree = new ControlRecord({ children: List.of(obsRecord, mixedChildRecord) });

    const brotherTree = new ControlRecordTreeMgr()
                              .getLatestBrotherTree(obsTree, expectedFormFieldPath);

    expect(brotherTree.formFieldPath).to.equal(expectedFormFieldPath);
  });
  it('should return obsControl with path as an incremented value when obsControl ' +
      'is the root tree and parent is section without add more', () => {
    const obsRecord = new ControlRecord({
      control: obsControl,
      value: {},
      dataSource: {
        concept,
        formFieldPath: 'FormName.V/1-0',
        formNamespace: 'Bahmni',
        voided: true,
      },
      formFieldPath: 'FormName.V/1-0',
    });

    const recordsTree = new ControlRecord({ children: List.of(obsRecord) });
    const nextObsTree = new ControlRecordTreeMgr()
          .generateNextTree(recordsTree, 'FormName.V/1-0', undefined);
    expect(nextObsTree.formFieldPath).to.equal('FormName.V/1-1');
  });
  it('should return obsControl with path as an incremented value when ' +
      'obsControl is the root tree and parent is section with add more', () => {
    const obsFormFieldPath = 'FormName.V/2-0/1-0';
    const observationRecord = new ControlRecord({
      control: obsControl,
      value: {},
      dataSource: {
        concept,
        formFieldPath: obsFormFieldPath,
        formNamespace: 'Bahmni',
        voided: true,
      },
      formFieldPath: obsFormFieldPath,
    });
    const recordsTree = new ControlRecord({ children: List.of(observationRecord) });

    const nextObsTree = new ControlRecordTreeMgr()
            .generateNextTree(recordsTree, obsFormFieldPath, undefined);
    expect(nextObsTree.formFieldPath).to.equal('FormName.V/2-0/1-1');
  });

  it('should return section control tree with obsControl as a child and increment the path value ' +
        'for section control id, when section control is the root tree', () => {
    const sectionFormFieldPath = 'FormName.V/2-0';
    const obsFormFieldPath = 'FormName.V/2-0/1-0';
    const observationRecord = new ControlRecord({
      control: obsControl,
      value: {},
      dataSource: {
        concept,
        formFieldPath: obsFormFieldPath,
        formNamespace: 'Bahmni',
        voided: true,
      },
      formFieldPath: obsFormFieldPath,
    });
    const sectionRecord = new ControlRecord({
      control: sectionControl,
      value: {},
      dataSource: {
        concept,
        formFieldPath: sectionFormFieldPath,
        formNamespace: 'Bahmni',
        voided: true,
      },
      children: List.of(observationRecord),
      formFieldPath: sectionFormFieldPath,
    });
    const recordsTree = new ControlRecord({ children: List.of(sectionRecord) });

    const nextObsTree = new ControlRecordTreeMgr()
            .generateNextTree(recordsTree, sectionFormFieldPath, undefined);
    expect(nextObsTree.formFieldPath).to.equal('FormName.V/2-1');
    expect(nextObsTree.children.get(0).formFieldPath).to.equal('FormName.V/2-1/1-0');
  });

  it('should increment path for section 1 when section 1 has child as section 2 which' +
        ' is add more and has child obs control, where root is section 2 ', () => {
    const section2FormFieldPath = 'FormName.V/2-0';
    const obsFormFieldPath = 'FormName.V/2-0/3-0';
    const observationRecord = new ControlRecord({
      control: obsControl,
      value: {},
      dataSource: {
        concept,
        formFieldPath: obsFormFieldPath,
        formNamespace: 'Bahmni',
        voided: true,
      },
      formFieldPath: obsFormFieldPath,
    });
    const sectionControl2 = sectionControl;

    const sectionRecord2 = new ControlRecord({
      control: sectionControl2,
      value: {},
      dataSource: {
        concept,
        formFieldPath: section2FormFieldPath,
        formNamespace: 'Bahmni',
        voided: true,
      },
      children: List.of(observationRecord),
      formFieldPath: section2FormFieldPath,
    });


    const recordsTree = new ControlRecord({ children: List.of(sectionRecord2) });

    const nextObsTree = new ControlRecordTreeMgr()
            .generateNextTree(recordsTree, section2FormFieldPath, undefined);
    expect(nextObsTree.formFieldPath).to.equal('FormName.V/2-1');
    expect(nextObsTree.children.get(0).formFieldPath).to.equal('FormName.V/2-1/3-0');
  });

  it('should increment path for section 1 with add more when section 1 has child as section 2' +
      'which is also add more and has child obs control, where root is section 1 ', () => {
    const section1FormFieldPath = 'FormName.V/1-0';
    const section2FormFieldPath = 'FormName.V/1-0/2-0';
    const obsFormFieldPath = 'FormName.V/1-0/2-0/3-0';
    const observationRecord = new ControlRecord({
      control: obsControl,
      value: {},
      dataSource: {
        concept,
        formFieldPath: obsFormFieldPath,
        formNamespace: 'Bahmni',
        voided: true,
      },
      formFieldPath: obsFormFieldPath,
    });
    const sectionControl2 = sectionControl;
    const sectionControl1 = sectionControl = {
      type: 'section',
      label: {
        translationKey: 'SECTION_2',
        type: 'label',
        value: 'Section',
        id: '2',
      },
      properties: {
        addMore: true,
        location: {
          column: 0,
          row: 1,
        },
      },
      id: '2',
      unsupportedProperties: [],
      controls: [
        sectionControl2,
      ],
    };
    const sectionRecord2 = new ControlRecord({
      control: sectionControl2,
      value: {},
      dataSource: {
        concept,
        formFieldPath: section2FormFieldPath,
        formNamespace: 'Bahmni',
        voided: true,
      },
      children: List.of(observationRecord),
      formFieldPath: section2FormFieldPath,
    });

    const sectionRecord1 = new ControlRecord({
      control: sectionControl1,
      value: {},
      dataSource: {
        concept,
        formFieldPath: section1FormFieldPath,
        formNamespace: 'Bahmni',
        voided: true,
      },
      children: List.of(sectionRecord2),
      formFieldPath: section1FormFieldPath,
    });
    const recordsTree = new ControlRecord({ children: List.of(sectionRecord1) });

    const nextObsTree = new ControlRecordTreeMgr()
            .generateNextTree(recordsTree, section1FormFieldPath, undefined);
    expect(nextObsTree.formFieldPath).to.equal('FormName.V/1-1');
    expect(nextObsTree.children.get(0).formFieldPath).to.equal('FormName.V/1-1/2-0');
    expect(nextObsTree.children.get(0).children.get(0).formFieldPath)
        .to.equal('FormName.V/1-1/2-0/3-0');
  });

  it('should increment path for section 2 with add more when section 1 has child as section 2' +
      ' which is also add more and has child obs control, where root tree is section 2 ', () => {
    const section2FormFieldPath = 'FormName.V/1-0/2-0';
    const obsFormFieldPath = 'FormName.V/1-0/2-0/3-0';
    const observationRecord = new ControlRecord({
      control: obsControl,
      value: {},
      dataSource: {
        concept,
        formFieldPath: obsFormFieldPath,
        formNamespace: 'Bahmni',
        voided: true,
      },
      formFieldPath: obsFormFieldPath,
    });
    const sectionControl2 = sectionControl;

    const sectionRecord2 = new ControlRecord({
      control: sectionControl2,
      value: {},
      dataSource: {
        concept,
        formFieldPath: section2FormFieldPath,
        formNamespace: 'Bahmni',
        voided: true,
      },
      children: List.of(observationRecord),
      formFieldPath: section2FormFieldPath,
    });


    const recordsTree = new ControlRecord({ children: List.of(sectionRecord2) });

    const nextObsTree = new ControlRecordTreeMgr()
            .generateNextTree(recordsTree, section2FormFieldPath, undefined);
    expect(nextObsTree.formFieldPath).to.equal('FormName.V/1-0/2-1');
    expect(nextObsTree.children.get(0).formFieldPath).to.equal('FormName.V/1-0/2-1/3-0');
  });

  it('should increment path for section with add more which has child as obsGroup which' +
        ' is also add more and has child obs control, where root tree is section ', () => {
    const sectionFormFieldPath = 'FormName.V/1-0';
    const obsGroupFormFieldPath = 'FormName.V/1-0/2-0';
    const obsFormFieldPath = 'FormName.V/1-0/2-0/3-0';
    const observationRecord = new ControlRecord({
      control: obsControl,
      value: {},
      dataSource: {
        concept,
        formFieldPath: obsFormFieldPath,
        formNamespace: 'Bahmni',
        voided: true,
      },
      formFieldPath: obsFormFieldPath,
    });

    const obsGroupControl = {
      type: 'obsGroupControl',
      label: {
        translationKey: 'concept set',
        type: 'label',
        value: 'concept set',
        id: '2',
      },
      properties: {
        addMore: true,
        location: {
          column: 0,
          row: 1,
        },
      },
      id: '2',
      unsupportedProperties: [],
      controls: [
        obsControl,
      ],
    };

    const obGrpRecord = new ControlRecord({
      control: obsGroupControl,
      value: {},
      dataSource: {
        concept,
        formFieldPath: obsGroupFormFieldPath,
        formNamespace: 'Bahmni',
        voided: true,
      },
      children: List.of(observationRecord),
      formFieldPath: obsGroupFormFieldPath,
    });

    const sectionRecord = new ControlRecord({
      control: sectionControl,
      value: {},
      dataSource: {
        concept,
        formFieldPath: sectionFormFieldPath,
        formNamespace: 'Bahmni',
        voided: true,
      },
      children: List.of(obGrpRecord),
      formFieldPath: sectionFormFieldPath,
    });

    const recordsTree = new ControlRecord({ children: List.of(sectionRecord) });

    const nextObsTree = new ControlRecordTreeMgr()
            .generateNextTree(recordsTree, sectionFormFieldPath, undefined);
    expect(nextObsTree.formFieldPath).to.equal('FormName.V/1-1');
    expect(nextObsTree.children.get(0).formFieldPath).to.equal('FormName.V/1-1/2-0');
    expect(nextObsTree.children.get(0).children.get(0).formFieldPath)
        .to.equal('FormName.V/1-1/2-0/3-0');
  });

  it('should increment path for obs group with add more which has child as obs which' +
        'and parent as section, where root tree is obsgroup ', () => {
    const obsGroupFormFieldPath = 'FormName.V/1-0/2-0';
    const obsFormFieldPath = 'FormName.V/1-0/2-0/3-0';
    const observationRecord = new ControlRecord({
      control: obsControl,
      value: {},
      dataSource: {
        concept,
        formFieldPath: obsFormFieldPath,
        formNamespace: 'Bahmni',
        voided: true,
      },
      formFieldPath: obsFormFieldPath,
    });

    const obsGroupControl = {
      type: 'obsGroupControl',
      label: {
        translationKey: 'concept set',
        type: 'label',
        value: 'concept set',
        id: '2',
      },
      properties: {
        addMore: true,
        location: {
          column: 0,
          row: 1,
        },
      },
      id: '2',
      unsupportedProperties: [],
      controls: [
        obsControl,
      ],
    };

    const obsGrpRecord = new ControlRecord({
      control: obsGroupControl,
      value: {},
      dataSource: {
        concept,
        formFieldPath: obsGroupFormFieldPath,
        formNamespace: 'Bahmni',
        voided: true,
      },
      children: List.of(observationRecord),
      formFieldPath: obsGroupFormFieldPath,
    });

    const recordsTree = new ControlRecord({ children: List.of(obsGrpRecord) });

    const nextObsTree = new ControlRecordTreeMgr()
            .generateNextTree(recordsTree, obsGroupFormFieldPath, undefined);
    expect(nextObsTree.formFieldPath).to.equal('FormName.V/1-0/2-1');
    expect(nextObsTree.children.get(0).formFieldPath).to.equal('FormName.V/1-0/2-1/3-0');
  });

  it('should increment obsgroup and obs control path when root tree is obsgroup   ', () => {
    const sectionFormFieldPath = 'FormName.V/1-0';
    const obsGroupFormFieldPath = 'FormName.V/1-0/2-0';
    const obsFormFieldPath = 'FormName.V/1-0/2-0/3-0';
    const observationRecord = new ControlRecord({
      control: obsControl,
      value: {},
      dataSource: {
        concept,
        formFieldPath: obsFormFieldPath,
        formNamespace: 'Bahmni',
        voided: true,
      },
      formFieldPath: obsFormFieldPath,
    });

    const obsGroupControl = {
      type: 'obsGroupControl',
      label: {
        translationKey: 'concept set',
        type: 'label',
        value: 'concept set',
        id: '2',
      },
      properties: {
        addMore: true,
        location: {
          column: 0,
          row: 1,
        },
      },
      id: '2',
      unsupportedProperties: [],
      controls: [
        obsControl,
      ],
    };

    const obGrpRecord = new ControlRecord({
      control: obsGroupControl,
      value: {},
      dataSource: {
        concept,
        formFieldPath: obsGroupFormFieldPath,
        formNamespace: 'Bahmni',
        voided: true,
      },
      children: List.of(observationRecord),
      formFieldPath: obsGroupFormFieldPath,
    });

    const sectionRecord = new ControlRecord({
      control: sectionControl,
      value: {},
      dataSource: {
        concept,
        formFieldPath: sectionFormFieldPath,
        formNamespace: 'Bahmni',
        voided: true,
      },
      children: List.of(obGrpRecord),
      formFieldPath: sectionFormFieldPath,
    });

    const recordsTree = new ControlRecord({ children: List.of(sectionRecord) });

    const nextObsTree = new ControlRecordTreeMgr()
            .generateNextTree(recordsTree, sectionFormFieldPath, undefined);
    expect(nextObsTree.formFieldPath).to.equal('FormName.V/1-1');
    expect(nextObsTree.children.get(0).formFieldPath).to.equal('FormName.V/1-1/2-0');
    expect(nextObsTree.children.get(0).children.get(0).formFieldPath)
        .to.equal('FormName.V/1-1/2-0/3-0');
  });
});
