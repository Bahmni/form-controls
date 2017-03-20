import { List } from 'immutable';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import ControlRecordTreeBuilder from 'src/helpers/ControlRecordTreeBuilder';
import { ControlRecord } from 'src/helpers/ControlRecordTreeBuilder';

chai.use(chaiEnzyme());

describe('ControlRecordTreeBuilder', () => {
  it('should filter inactive record from nest record tree', () => {
    const obsGroupConcept = {
      datatype: 'N/A',
      name: 'TestGroup',
      set: true,
      setMembers: [
        {
          answers: [],
          datatype: 'Numeric',
          description: [],
          hiAbsolute: null,
          hiNormal: null,
          lowAbsolute: null,
          lowNormal: null,
          name: 'TestObs',
          properties: {
            allowDecimal: false,
          },
          units: null,
          uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
        },
      ],
      uuid: 'eafe7d68-904b-459b-b11d-6502ec0143a4',
    };
    const obsConcept = {
      answers: [],
      datatype: 'Numeric',
      description: [],
      hiAbsolute: null,
      hiNormal: null,
      lowAbsolute: null,
      lowNormal: null,
      name: 'TestObs',
      properties: {
        allowDecimal: false,
      },
      units: null,
      uuid: 'd0490af4-72eb-4090-9b43-ac3487ba7474',
    };
    const activeFormFieldPath = 'SingleGroup.3/4-0';
    const obsRecord = new ControlRecord({
      control: {
        concept: obsConcept,
        hiAbsolute: null,
        hiNormal: null,
        id: '4',
        label: {
          type: 'label',
          value: 'TestObs',
        },
        lowAbsolute: null,
        lowNormal: null,
        properties: {
          addMore: true,
          hideLabel: false,
          location: {
            column: 0,
            row: 0,
          },
          mandatory: false,
          notes: false,
        },
        type: 'obsControl',
        units: null,
      },
      formFieldPath: activeFormFieldPath,
      value: {},
      active: true,
      dataSource: {
        concept: obsConcept,
        formFieldPath: 'SingleGroup.3/4-0',
        formNamespace: 'Bahmni',
        voided: true,
      },
    });
    const inactiveObsRecord = new ControlRecord({
      control: {
        concept: obsConcept,
        hiAbsolute: null,
        hiNormal: null,
        id: '4',
        label: {
          type: 'label',
          value: 'TestObs',
        },
        lowAbsolute: null,
        lowNormal: null,
        properties: {
          addMore: true,
          hideLabel: false,
          location: {
            column: 0,
            row: 0,
          },
          mandatory: false,
          notes: false,
        },
        type: 'obsControl',
        units: null,
      },
      formFieldPath: 'SingleGroup.3/4-1',
      value: {},
      active: false,
      dataSource: {
        concept: obsConcept,
        formFieldPath: 'SingleGroup.3/4-0',
        formNamespace: 'Bahmni',
        voided: true,
      },
    });
    const obsGroupRecord = new ControlRecord({
      control: {
        concept: obsGroupConcept,
        controls: [
          {
            concept: obsConcept,
            hiAbsolute: null,
            hiNormal: null,
            id: '4',
            label: {
              type: 'label',
              value: 'TestObs',
            },
            lowAbsolute: null,
            lowNormal: null,
            properties: {
              addMore: true,
              hideLabel: false,
              location: {
                column: 0,
                row: 0,
              },
              mandatory: false,
              notes: false,
            },
            type: 'obsControl',
            units: null,
          },
        ],
        id: '3',
        label: {
          type: 'label',
          value: 'TestGroup',
        },
        properties: {
          abnormal: false,
          addMore: true,
          location: {
            column: 0,
            row: 0,
          },
        },
        type: 'obsGroupControl',
      },
      formFieldPath: 'SingleGroup.3/3-0',
      children: List.of(obsRecord, inactiveObsRecord),
      value: {},
      active: true,
      dataSource: {
        concept: obsGroupConcept,
        formFieldPath: 'SingleGroup.3/3-0',
        formNamespace: 'Bahmni',
        voided: true,
      },
    });
    const rootRecordTree = new ControlRecord({ children: List.of(obsGroupRecord) });

    const activeRecordTree = rootRecordTree.getActive();

    const obsGroupRecordTree = activeRecordTree.children.get(0);
    expect(obsGroupRecordTree.children.size).to.equal(1);
    const activeObsRecordTree = obsGroupRecordTree.children.get(0);
    expect(activeObsRecordTree.formFieldPath).to.equal(activeFormFieldPath);
    expect(activeObsRecordTree.active).to.equal(true);
  });

  it('should get inactive record form inactive observation', () => {
    const obsConcept = {
      answers: [],
      datatype: 'Numeric',
      description: [],
      name: 'Pulse',
      properties: {
        allowDecimal: true,
      },
      uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
    };
    const activeFormFieldPath = 'SingleObs.1/1-0';
    const inactiveFormFieldPath = 'SingleObs.1/1-1';
    const observations = [
      {
        concept: obsConcept,
        formFieldPath: activeFormFieldPath,
        formNamespace: 'Bahmni',
        inactive: false,
        voided: true,
      },
      {
        concept: obsConcept,
        formFieldPath: inactiveFormFieldPath,
        formNamespace: 'Bahmni',
        inactive: true,
        voided: true,
      },
    ];
    const metadata = {
      controls: [
        {
          concept: obsConcept,
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
      ],
      id: 209,
      name: 'SingleObs',
      uuid: '245940b7-3d6b-4a8b-806b-3f56444129ae',
      version: '1',
    };

    const rootRecordTree = new ControlRecordTreeBuilder().build(metadata, observations);

    const activeRecord = rootRecordTree.children.get(0);
    expect(activeRecord.formFieldPath).to.equal(activeFormFieldPath);
    expect(activeRecord.active).to.equal(true);
    const inactiveRecord = rootRecordTree.children.get(1);
    expect(inactiveRecord.formFieldPath).to.equal(inactiveFormFieldPath);
    expect(inactiveRecord.active).to.equal(false);
  });
});
