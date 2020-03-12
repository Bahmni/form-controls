import { executeEventsFromCurrentRecord } from 'src/helpers/ExecuteEvents';
import { expect } from 'chai';
import { ControlRecord } from 'src/helpers/ControlRecordTreeBuilder';
import { List } from 'immutable/dist/immutable';
import ScriptRunner from 'src/helpers/ScriptRunner';
import sinon from 'sinon';

describe('execute control events', () => {
  const recordTree = new ControlRecord({
    control: {
      concept: 'conceptName',
      hiAbsolute: null,
      hiNormal: null,
      id: '1',
      label: {
        type: 'label',
        value: 'conceptName',
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
    formFieldPath: 'FormName.2/3-0',
    value: {},
    dataSource: {
      concept: 'conceptName',
      formFieldPath: 'FormName.2/3-0',
      formNamespace: 'Bahmni',
      voided: true,
    },
  });

  const recordTreeWithEvent = new ControlRecord({
    control: {
      type: 'section',
      label: {
        translationKey: 'SECTION_4',
        type: 'label',
        value: 'Section',
        id: 4,
      },
      id: 4,
      controls: [
        {
          type: 'obsControl',
          label: {
            translationKey: 'HEIGHT_(CM)_5',
            id: 5,
            type: 'label',
            value: 'Height (cm)',
          },
          id: 5,
          concept: {
            name: 'Height (cm)',
            uuid: '1c17afb5-2946-4964-a8a8-007478748dc5',
            datatype: 'Numeric',
          },
          events: {
            onValueChange: 'function(form){form.get("Height (cm)").setEnabled(false);}',
          },
        },
      ],
    },
    formFieldPath: 'TestSectionLevel.6/4-0',
    children: [
      {
        control: {
          type: 'obsControl',
          label: {
            translationKey: 'HEIGHT_(CM)_5',
            value: 'Height (cm)',
          },
          id: 5,
          concept: {
            name: 'Height (cm)',
          },
          events: {
            onValueChange: 'function(form){form.get("Height (cm)").setEnabled(false);}',
          },
        },
        formFieldPath: 'TestSectionLevel.6/4-0/5-0',
        enabled: 'true',
        hidden: 'false',
      },
    ],
    enabled: 'true',
    hidden: 'false',
  });

  const updatedRecordTreeAfterExecutingEvent = new ControlRecord({
    control: {
      type: 'section',
      label: {
        translationKey: 'SECTION_4',
        type: 'label',
        value: 'Section',
        id: 4,
      },
      id: 4,
      controls: [
        {
          type: 'obsControl',
          label: {
            translationKey: 'HEIGHT_(CM)_5',
            id: 5,
            type: 'label',
            value: 'Height (cm)',
          },
          id: 5,
          concept: {
            name: 'Height (cm)',
            uuid: '1c17afb5-2946-4964-a8a8-007478748dc5',
            datatype: 'Numeric',
          },
          events: {
            onValueChange: 'function(form){form.get("Height (cm)").setEnabled(false);}',
          },
        },
      ],
    },
    formFieldPath: 'TestSectionLevel.6/4-0',
    children: [
      {
        control: {
          type: 'obsControl',
          label: {
            translationKey: 'HEIGHT_(CM)_5',
            value: 'Height (cm)',
          },
          id: 5,
          concept: {
            name: 'Height (cm)',
          },
          events: {
            onValueChange: 'function(form){form.get("Height (cm)").setEnabled(false);}',
          },
        },
        formFieldPath: 'TestSectionLevel.6/4-0/5-0',
        enabled: 'false',
        hidden: 'false',
      },
    ],
    enabled: 'false',
    hidden: 'false',
  });

  const patient = { age: 10, gender: 'M', id: 'GAN1234' };

  it('should return the same record tree if it does not have children', () => {
    const modifiedRecordTree = executeEventsFromCurrentRecord(recordTree, undefined, patient);
    expect(modifiedRecordTree).to.eq(recordTree);
  });

  it('should return the same record tree if the record has children with no control event', () => {
    const recordWithChildren = new ControlRecord({
      children: List.of(recordTree),
    });
    const modifiedRecordTree =
      executeEventsFromCurrentRecord(recordWithChildren, undefined, patient);
    expect(modifiedRecordTree).to.eq(recordWithChildren);
  });

  it('should return the updated record tree if the record tree has children and control with event',
    () => {
      const recordWithChildren = new ControlRecord({
        children: List.of(recordTreeWithEvent),
      });
      const executeStub = sinon.stub(ScriptRunner.prototype, 'execute');
      executeStub.returns(updatedRecordTreeAfterExecutingEvent);
      expect(executeEventsFromCurrentRecord(recordWithChildren, undefined, patient))
        .eq(updatedRecordTreeAfterExecutingEvent);
      executeStub.restore();
    });
});

