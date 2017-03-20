import { List } from 'immutable';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ControlRecord } from '../../src/helpers/ControlRecordTreeBuilder';
import ControlRecordTreeMgr from '../../src/helpers/ControlRecordTreeMgr';

chai.use(chaiEnzyme());

describe('ControlRecordTreeMgr', () => {
  it('should get the record that is entirely same as given prefix', () => {
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
    const expectedFormFieldPath = 'SingleObs.1/1-0';
    const mixedFormFieldPath = 'SingleObs.11/0-1';
    const obsRecord = new ControlRecord({
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

    const brotherTree = new ControlRecordTreeMgr().getBrotherTree(obsTree, expectedFormFieldPath);

    expect(brotherTree.formFieldPath).to.equal(expectedFormFieldPath);
  });
});
