import { ControlRecord } from 'src/helpers/ControlRecordTreeBuilder';
import { BooleanValueMapper } from 'src/mapper/BooleanValueMapper';
import { List } from 'immutable';
import ControlRecordWrapper from 'src/helpers/ControlRecordWrapper';

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
    value: {
      value: undefined,
      comment: 'comment',
    },
  });

  const clonedControlledTree = new ControlRecord({
    control,
    formFieldPath: '3406.1/1-1',
    value: {
      value: undefined,
      comment: 'comment',
    },
  });

  const controlledObsGroupTree = new ControlRecord({
    control: {
      type: 'obsGroupControl',
      concept: {
        name: 'Temperature Data',
      },
    },
    children: List.of(clonedControlledTree, controlledTree),
    formFieldPath: '3406.1/3-0',
  });
  const rootTree = new ControlRecord({
    children: List.of(controllerTree, controlledTree, clonedControlledTree, controlledObsGroupTree),
  });

  describe('Add more control', () => {
    it('should set both original tree and add more one\'s value when set value be triggered', () => {
      const wrapper = new ControlRecordWrapper(rootTree);
      const targetWrapper = wrapper.set(controlledTree);

      targetWrapper.setValue(123);

      const childrenList = targetWrapper.getRecords().children;
      const controlledRecord = childrenList.get(1);
      const clonedControlledRecord = childrenList.get(2);
      expect(controlledRecord.getValue()).toBe(123);
      expect(clonedControlledRecord.getValue()).toBe(123);
    });

    it('should set both original tree and add more one\'s disabled when set disable be triggered', () => {
      const wrapper = new ControlRecordWrapper(rootTree);
      const targetWrapper = wrapper.set(controlledTree);

      targetWrapper.setEnabled(false);

      const childrenList = targetWrapper.getRecords().children;
      const controlledRecord = childrenList.get(1);
      const clonedControlledRecord = childrenList.get(2);
      expect(controlledRecord.enabled).toBe(false);
      expect(clonedControlledRecord.enabled).toBe(false);
    });
  });

  it('should set child disabled when the record is set disabled', () => {
    const wrapper = new ControlRecordWrapper(rootTree);
    const targetWrapper = wrapper.set(controlledObsGroupTree);

    targetWrapper.setEnabled(false);

    targetWrapper.currentRecord.children.forEach(r => {
      expect(r.enabled).toBe(false);
    });
  });

  it('should set value and comments to undefined for obs when the record is hidden', () => {
    const wrapper = new ControlRecordWrapper(rootTree);
    const targetWrapper = wrapper.set(controlledTree);
    targetWrapper.setValue(112);

    targetWrapper.hideAndClear(true);

    const childrenList = targetWrapper.getRecords().children;
    const controlledRecord = childrenList.get(1);
    const clonedControlledRecord = childrenList.get(2);
    expect(controlledRecord.getValue()).toBeUndefined();
    expect(clonedControlledRecord.getValue()).toBeUndefined();
    expect(controlledRecord.hidden).toBe(true);
    expect(clonedControlledRecord.hidden).toBe(true);
  });

  it('should set value and comments to undefined for all its children when the obs group is hidden', () => {
    const wrapper = new ControlRecordWrapper(rootTree);
    const targetWrapper = wrapper.set(controlledObsGroupTree);
    controlledObsGroupTree.children.get(0).value.value = 112;
    controlledObsGroupTree.children.get(1).value.value = 112;

    targetWrapper.hideAndClear();

    const updatedTree = targetWrapper.rootRecord.children.get(3);
    expect(updatedTree.hidden).toBe(true);
    expect(updatedTree.children.get(0).value.value).toBeUndefined();
    expect(updatedTree.children.get(0).value.comment).toBeUndefined();
    expect(updatedTree.children.get(1).value.value).toBeUndefined();
    expect(updatedTree.children.get(1).value.comment).toBeUndefined();
  });

  it('should set value and comments to undefined when the table is hidden', () => {
    const controlledTableTree = new ControlRecord({
      control: {
        type: 'table',
        concept: {
          name: 'Temperature Data',
        },
      },
      children: List.of(clonedControlledTree, controlledTree),
      formFieldPath: '3406.1/3-0',
    });
    const newRootTree = new ControlRecord({
      children: List.of(controlledTableTree),
    });
    const wrapper = new ControlRecordWrapper(newRootTree);
    const targetWrapper = wrapper.set(controlledTableTree);
    controlledTableTree.children.get(0).value.value = 112;
    controlledTableTree.children.get(1).value.value = 112;

    targetWrapper.hideAndClear();

    const updatedTree = targetWrapper.rootRecord.children.get(0);
    expect(updatedTree.hidden).toBe(true);
    expect(updatedTree.children.get(0).value.value).toBeUndefined();
    expect(updatedTree.children.get(0).value.comment).toBeUndefined();
    expect(updatedTree.children.get(1).value.value).toBeUndefined();
    expect(updatedTree.children.get(1).value.comment).toBeUndefined();
  });

  it('should set value and comments to undefined when the section is set hidden', () => {
    const controlledSectionTree = new ControlRecord({
      control: {
        type: 'section',
        concept: {
          name: 'Temperature Data',
        },
      },
      children: List.of(clonedControlledTree, controlledTree),
      formFieldPath: '3406.1/3-0',
    });
    const newRootTree = new ControlRecord({
      children: List.of(controlledSectionTree),
    });
    const wrapper = new ControlRecordWrapper(newRootTree);
    const targetWrapper = wrapper.set(controlledSectionTree);
    controlledSectionTree.children.get(0).value.value = 112;
    controlledSectionTree.children.get(1).value.value = 112;

    targetWrapper.hideAndClear();

    const updatedTree = targetWrapper.rootRecord.children.get(0);
    expect(updatedTree.hidden).toBe(true);
    expect(updatedTree.children.get(0).value.value).toBeUndefined();
    expect(updatedTree.children.get(0).value.comment).toBeUndefined();
    expect(updatedTree.children.get(1).value.value).toBeUndefined();
    expect(updatedTree.children.get(1).value.comment).toBeUndefined();
  });

  describe('showNotes', () => {
    const notesControl = {
      concept: {
        answers: [],
        datatype: 'Numeric',
        name: 'Chaperone Required',
        uuid: 'abc-123',
      },
      id: '5',
      label: { type: 'label', value: 'Chaperone Required' },
      type: 'obsControl',
      properties: { notes: false },
    };

    const notesControlTree = new ControlRecord({
      control: notesControl,
      formFieldPath: '3406.1/5-0',
      value: { value: undefined, comment: undefined },
    });

    const notesControlTreeClone = new ControlRecord({
      control: notesControl,
      formFieldPath: '3406.1/5-1',
      value: { value: undefined, comment: undefined },
    });

    const notesRootTree = new ControlRecord({
      children: List.of(notesControlTree, notesControlTreeClone),
    });

    it('should default show to true when called without argument', () => {
      const wrapper = new ControlRecordWrapper(notesRootTree);
      wrapper.set(notesControlTree).showNotes();

      const children = wrapper.getRecords().children;
      expect(children.get(0).control.properties.notes).toBe(true);
      expect(children.get(1).control.properties.notes).toBe(true);
    });

    it('should set notes to false on all brother trees when called with false', () => {
      const wrapper = new ControlRecordWrapper(notesRootTree);
      wrapper.set(notesControlTree).showNotes(false);

      const children = wrapper.getRecords().children;
      expect(children.get(0).control.properties.notes).toBe(false);
      expect(children.get(1).control.properties.notes).toBe(false);
    });
  });

  describe('openNotes', () => {
    const openNotesControl = {
      concept: {
        answers: [],
        datatype: 'Numeric',
        name: 'Chaperone Required',
        uuid: 'abc-456',
      },
      id: '6',
      label: { type: 'label', value: 'Chaperone Required' },
      type: 'obsControl',
      properties: { notes: true },
    };

    const openNotesControlTree = new ControlRecord({
      control: openNotesControl,
      formFieldPath: '3406.1/6-0',
      value: { value: undefined, comment: undefined },
    });

    const openNotesControlTreeClone = new ControlRecord({
      control: openNotesControl,
      formFieldPath: '3406.1/6-1',
      value: { value: undefined, comment: undefined },
    });

    const openNotesRootTree = new ControlRecord({
      children: List.of(openNotesControlTree, openNotesControlTreeClone),
    });

    it('should set notesOpen to true on all brother trees', () => {
      const wrapper = new ControlRecordWrapper(openNotesRootTree);
      wrapper.set(openNotesControlTree).openNotes();

      const children = wrapper.getRecords().children;
      expect(children.get(0).control.properties.notesOpen).toBe(true);
      expect(children.get(1).control.properties.notesOpen).toBe(true);
    });

    it('should not affect other existing properties when opening notes', () => {
      const wrapper = new ControlRecordWrapper(openNotesRootTree);
      wrapper.set(openNotesControlTree).openNotes();

      const children = wrapper.getRecords().children;
      expect(children.get(0).control.properties.notes).toBe(true);
      expect(children.get(1).control.properties.notes).toBe(true);
    });
  });

  describe('clearNotes', () => {
    const clearNotesControl = {
      concept: {
        answers: [],
        datatype: 'Numeric',
        name: 'Chaperone Required',
        uuid: 'abc-789',
      },
      id: '7',
      label: { type: 'label', value: 'Chaperone Required' },
      type: 'obsControl',
      properties: { notes: true },
    };

    const clearNotesTree = new ControlRecord({
      control: clearNotesControl,
      formFieldPath: '3406.1/7-0',
      value: { value: 'Yes', comment: 'some note', interpretation: 'ABNORMAL' },
    });

    const clearNotesTreeClone = new ControlRecord({
      control: clearNotesControl,
      formFieldPath: '3406.1/7-1',
      value: { value: 'Yes', comment: 'some note', interpretation: 'ABNORMAL' },
    });

    const clearNotesRootTree = new ControlRecord({
      children: List.of(clearNotesTree, clearNotesTreeClone),
    });

    it('should set comment to undefined on all brother trees', () => {
      const wrapper = new ControlRecordWrapper(clearNotesRootTree);
      wrapper.set(clearNotesTree).clearNotes();

      const children = wrapper.getRecords().children;
      expect(children.get(0).value.comment).toBeUndefined();
      expect(children.get(1).value.comment).toBeUndefined();
    });

    it('should preserve value and interpretation when clearing notes', () => {
      const wrapper = new ControlRecordWrapper(clearNotesRootTree);
      wrapper.set(clearNotesTree).clearNotes();

      const children = wrapper.getRecords().children;
      expect(children.get(0).value.value).toBe('Yes');
      expect(children.get(0).value.interpretation).toBe('ABNORMAL');
    });

    it('should not clear notes for non-obsControl records', () => {
      const groupControl = {
        type: 'obsGroupControl',
        concept: { name: 'Group' },
      };
      const groupTree = new ControlRecord({
        control: groupControl,
        formFieldPath: '3406.1/8-0',
        value: { value: undefined, comment: 'group note' },
      });
      const groupRootTree = new ControlRecord({
        children: List.of(groupTree),
      });

      const wrapper = new ControlRecordWrapper(groupRootTree);
      wrapper.set(groupTree).clearNotes();

      expect(wrapper.getRecords().children.get(0).value.comment).toBe('group note');
    });
  });

  it('should set control to hidden when the section is set hidden and children is null', () => {
    const controlledSectionTree = new ControlRecord({
      control: {
        type: 'section',
        concept: {
          name: 'Temperature Data',
        },
      },
      children: null,
      formFieldPath: '3406.1/3-0',
    });
    const newRootTree = new ControlRecord({
      children: List.of(controlledSectionTree),
    });
    const wrapper = new ControlRecordWrapper(newRootTree);
    const targetWrapper = wrapper.set(controlledSectionTree);

    targetWrapper.hideAndClear();

    const updatedTree = targetWrapper.rootRecord.children.get(0);
    expect(updatedTree.hidden).toBe(true);
  });
});
