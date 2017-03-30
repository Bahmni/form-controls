import { List } from 'immutable';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { ControlRecord } from '../../src/helpers/ControlRecordTreeBuilder';
import FormContext from '../../src/helpers/FormContext';

chai.use(chaiEnzyme());

describe('FormContext', () => {
  const booleanConceptName = 'Smoking History';
  const formFieldPathInPosition0 = '3129_Complex.1/1-0';
  const formFieldPathInPosition1 = '3129_Complex.1/2-0';

  const booleanConcept = {
    answers: [],
    datatype: 'Boolean',
    name: booleanConceptName,
    properties: {
      allowDecimal: null,
    },
    uuid: 'c2a43174-c9db-4e54-8516-17372c83537f',
  };
  const textBoxConcept = {
    answers: [],
    datatype: 'Text',
    description: [],
    name: 'Disposition Note',
    properties: {
      allowDecimal: null,
    },
    uuid: '81d4a9dc-3f10-11e4-adec-0800271c1b75',
  };

  const booleanObsTree = new ControlRecord({
    control: {
      concept: booleanConcept,
      hiAbsolute: null,
      hiNormal: null,
      id: '1',
      label: {
        type: 'label',
        value: booleanConceptName,
      },
      lowAbsolute: null,
      lowNormal: null,
      options: [
        {
          name: 'Yes',
          value: true,
        },
        {
          name: 'No',
          value: false,
        },
      ],
      properties: {
        addMore: false,
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
    formFieldPath: formFieldPathInPosition0,
    dataSource: {
      concept: booleanConcept,
      formFieldPath: formFieldPathInPosition0,
      formNamespace: 'Bahmni',
      inactive: false,
      voided: true,
    },
  });
  const booleanObsTree2 = new ControlRecord({
    control: {
      concept: booleanConcept,
      hiAbsolute: null,
      hiNormal: null,
      id: '2',
      label: {
        type: 'label',
        value: booleanConceptName,
      },
      lowAbsolute: null,
      lowNormal: null,
      options: [
        {
          name: 'Yes',
          value: true,
        },
        {
          name: 'No',
          value: false,
        },
      ],
      properties: {
        addMore: false,
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
    formFieldPath: formFieldPathInPosition1,
    dataSource: {
      concept: booleanConcept,
      formFieldPath: formFieldPathInPosition1,
      formNamespace: 'Bahmni',
      inactive: false,
      voided: true,
    },
  });
  const textBoxObsTree = new ControlRecord({
    control: {
      concept: textBoxConcept,
      hiAbsolute: null,
      hiNormal: null,
      id: '3',
      label: {
        type: 'label',
        value: 'Disposition Note',
      },
      lowAbsolute: null,
      lowNormal: null,
      properties: {
        addMore: false,
        hideLabel: false,
        location: {
          column: 0,
          row: 2,
        },
        mandatory: false,
        notes: false,
      },
      type: 'obsControl',
      units: null,
    },
    formFieldPath: '3129_Complex.1/3-0',
    dataSource: {
      concept: textBoxConcept,
      formFieldPath: '3129_Complex.1/3-0',
      formNamespace: 'Bahmni',
      inactive: false,
      voided: true,
    },
  });

  const recordTree = new ControlRecord({
    children: List.of(booleanObsTree, booleanObsTree2, textBoxObsTree),
  });

  it('should get first suitable record when given concept name without position', () => {
    const formContext = new FormContext(recordTree);

    const targetRecordWrapper = formContext.get(booleanConceptName);

    expect(targetRecordWrapper.currentRecord.formFieldPath).to.equal(formFieldPathInPosition0);
  });

  it('should get assign suitable record when given concept name with position', () => {
    const formContext = new FormContext(recordTree);

    const targetRecordWrapper = formContext.get(booleanConceptName, 1);

    expect(targetRecordWrapper.currentRecord.formFieldPath).to.equal(formFieldPathInPosition1);
  });

  it('should set record disabled when given set api triggered', () => {
    const formContext = new FormContext(recordTree);

    const originalRootTree = formContext.getRecords();
    const originalRecord = originalRootTree.children.get(0);
    expect(originalRecord.formFieldPath).to.equal(formFieldPathInPosition0);
    expect(originalRecord.enabled).to.equal(true);

    formContext.get(booleanConceptName, 0).setEnabled(false);

    const updatedRootTree = formContext.getRecords();
    const targetRecord = updatedRootTree.children.get(0);
    expect(targetRecord.formFieldPath).to.equal(formFieldPathInPosition0);
    expect(targetRecord.enabled).to.equal(false);
  });

  it('should get label name of the record does not have the concept name ' +
    'and has value as label name', () => {
    const labelName = 'something';
    const obsRecordTree = new ControlRecord({
      control: {
        value: labelName,
      },
    });
    const formContext = new FormContext(obsRecordTree);
    expect(formContext.getName(obsRecordTree)).to.equal(labelName);
  });

  it('should not given warning message when control with name and position is existed', () => {
    const warningSpy = sinon.spy(console, 'warn');
    const formContext = new FormContext(recordTree);

    formContext.get(booleanConceptName);
    warningSpy.restore();

    sinon.assert.notCalled(warningSpy);
  });

  it('should given warning message when control with name and position is not exist', () => {
    const warningSpy = sinon.spy(console, 'warn');
    const formContext = new FormContext(recordTree);

    formContext.get('Inexistent control');
    warningSpy.restore();

    sinon.assert.called(warningSpy);
  });
});
