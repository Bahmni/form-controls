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
    name: 'HEIGHT',
    properties: {
      allowDecimal: false,
    },
    uuid: '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  };
  const formFieldPath = 'singleObs.1/1-0';
  const childRecordTree = new ControlRecord({
    control: {
      concept,
      hiAbsolute: null,
      hiNormal: null,
      id: '1',
      label: {
        type: 'label',
        value: 'HEIGHT',
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
    formFieldPath,
    value: {},
    dataSource: {
      concept,
      formFieldPath,
      formNamespace: 'Bahmni',
      voided: true,
    },
  });

  it('should add more to root tree when add method be triggered', () => {
    const rootRecordTree = new ControlRecord({ children: List.of(childRecordTree) });

    const updatedRecordTree = ControlRecordTreeMgr.add(rootRecordTree, formFieldPath);

    const expectedFormFieldPath = 'singleObs.1/1-1';
    expect(updatedRecordTree.children.size).to.equal(2);
    expect(updatedRecordTree.children.get(0).formFieldPath).to.equal(formFieldPath);
    expect(updatedRecordTree.children.get(1).formFieldPath).to.equal(expectedFormFieldPath);
  });
});
