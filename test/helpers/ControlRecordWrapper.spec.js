import { expect } from 'chai';
import { ControlRecord } from '../../src/helpers/ControlRecordTreeBuilder';
import { BooleanValueMapper } from '../../src/mapper/BooleanValueMapper';
import { List } from 'immutable';
import ControlRecordWrapper from '../../src/helpers/ControlRecordWrapper';

describe('ControlRecordWrapper', () => {
  const controllerTree = new ControlRecord({
    valueMapper: new BooleanValueMapper(),
    control: {
      concept: {
        answers: [],
        datatype: 'Boolean',
        name: 'Smoking History',
        uuid: 'c2a43174-c9db-4e54-8516-17372c83537f',
      },
      events: {
        onValueChange: "function(form) {if (form.get('Smoking History').getValue() === 'Yes') {" +
        "form.get('Pulse').setValue(123); } else {form.get('Pulse').setValue(undefined); } }",
      },
      id: '2',
      label: {
        type: 'label',
        value: 'Smoking History',
      },
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
      type: 'obsControl',
    },
    formFieldPath: '3406.1/2-0',
  });

  const control = {
    concept: {
      answers: [],
      datatype: 'Numeric',
      name: 'Pulse',
      uuid: 'c36bc411-3f10-11e4-adec-0800271c1b75',
    },
    id: '1',
    label: {
      type: 'label',
      value: 'Pulse(/min)',
    },
    type: 'obsControl',
  };
  const controlledTree = new ControlRecord({
    control,
    formFieldPath: '3406.1/1-0',
  });

  const clonedControlledTree = new ControlRecord({
    control,
    formFieldPath: '3406.1/1-1',
  });

  const controlledObsGroupTree = new ControlRecord({
    control: [{ concept: {
      name: 'Temperature Data',
    } }],
    children: List.of(clonedControlledTree, controlledTree),
    formFieldPath: '3406.1/3-0',
  });
  const rootTree = new ControlRecord({
    children: List.of(controllerTree, controlledTree, clonedControlledTree, controlledObsGroupTree),
  });
  describe('Add more control', () => {
    it('should set both original tree and add more one\'s value ' +
      'when set value be triggered', () => {
      const wrapper = new ControlRecordWrapper(rootTree);
      const targetWrapper = wrapper.set(controlledTree);

      targetWrapper.setValue(123);

      const childrenList = targetWrapper.getRecords().children;
      const controlledRecord = childrenList.get(1);
      const clonedControlledRecord = childrenList.get(2);
      expect(controlledRecord.getValue()).to.equal(123);
      expect(clonedControlledRecord.getValue()).to.equal(123);
    });

    it('should set both original tree and add more one\'s disabled ' +
      'when set disable be triggered', () => {
      const wrapper = new ControlRecordWrapper(rootTree);
      const targetWrapper = wrapper.set(controlledTree);

      targetWrapper.setEnabled(false);

      const childrenList = targetWrapper.getRecords().children;
      const controlledRecord = childrenList.get(1);
      const clonedControlledRecord = childrenList.get(2);
      expect(controlledRecord.enabled).to.equal(false);
      expect(clonedControlledRecord.enabled).to.equal(false);
    });
  });

  it('should set child disabled when the record is set disabled', () => {
    const wrapper = new ControlRecordWrapper(rootTree);
    const targetWrapper = wrapper.set(controlledObsGroupTree);

    targetWrapper.setEnabled(false);

    targetWrapper.currentRecord.children.forEach(r => {
      expect(r.enabled).to.equal(false);
    });
  });
});
