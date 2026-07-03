import {
  groupControlsByLocation,
  sortGroupedControls,
  setupAddRemoveButtonsForAddMore,
  getGroupedControls,
  displayRowControls,
  getControls,
} from 'src/helpers/controlsParser';
import { ControlRecord } from 'src/ControlState';

describe('ControlsParser', () => {
  function getControl(row, column) {
    return {
      type: 'someType',
      id: 'someId',
      properties: { location: { row, column } },
    };
  }

  let controls;
  let control1;
  let control2;
  let control3;
  let control4;
  let control5;

  beforeAll(() => {
    control1 = getControl(1, 0);
    control2 = getControl(1, 1);
    control3 = getControl(0, 0);
    control4 = getControl(0, 2);
    control5 = getControl(2, 0);
    controls = [control1, control2, control3, control4, control5];
  });

  describe('groupControlsByLocation', () => {
    it('should return the controls grouped by rows', () => {
      const groupedControls = groupControlsByLocation(controls, 'row');
      const expectedControls = {
        1: [control1, control2],
        0: [control3, control4],
        2: [control5],
      };
      expect(groupedControls).toEqual(expectedControls);
    });

    it('should return the controls grouped by columns', () => {
      const groupedControls = groupControlsByLocation(controls, 'column');
      const expectedControls = {
        0: [control1, control3, control5],
        1: [control2],
        2: [control4],
      };
      expect(groupedControls).toEqual(expectedControls);
    });
  });

  describe('sortGroupedControls', () => {
    it('should return the grouped controls sorted in ascending order', () => {
      const groupedControls = groupControlsByLocation(controls, 'row');
      const sortedRows = sortGroupedControls(groupedControls);
      const expectedControls = [
        [control3, control4],
        [control1, control2],
        [control5],
      ];
      expect(sortedRows).toHaveLength(3);
      expect(sortedRows).toEqual(expectedControls);
    });
  });

  describe('setupAddRemoveButtonsForAddMore', () => {
    it('should properly set showAddMore and showRemove properties', () => {
      const controlRecords = [
        new ControlRecord(),
        new ControlRecord(),
        new ControlRecord(),
      ];
      const modifiedRecords = setupAddRemoveButtonsForAddMore(controlRecords);

      expect(modifiedRecords[0].showAddMore).toBe(false);
      expect(modifiedRecords[0].showRemove).toBe(false);

      expect(modifiedRecords[1].showAddMore).toBe(false);
      expect(modifiedRecords[1].showRemove).toBe(true);

      expect(modifiedRecords[2].showAddMore).toBe(true);
      expect(modifiedRecords[2].showRemove).toBe(true);
    });
  });

  describe('getGroupedControls', () => {
    it('should group controls by property and sort them', () => {
      const result = getGroupedControls(controls, 'row');
      const expected = [[control3, control4], [control1, control2], [control5]];

      expect(result).toEqual(expected);
    });

    it('should handle empty controls array', () => {
      const result = getGroupedControls([], 'row');

      expect(result).toEqual([]);
    });
  });

  describe('getControls', () => {
    it('should use record.control as metadata, not the static form definition control', () => {
      const staticControl = {
        type: 'obsControl',
        id: 'obs1',
        properties: { notes: false, notesOpen: false },
      };
      const updatedControl = {
        type: 'obsControl',
        id: 'obs1',
        properties: { notes: true, notesOpen: true },
      };
      const record = new ControlRecord({ control: updatedControl, formFieldPath: 'obs1-0' });
      const MockComponent = () => null;
      const mockComponentStore = { getRegisteredComponent: () => MockComponent };

      const result = getControls([staticControl], [record], { componentStore: mockComponentStore, enabled: true });

      expect(result[0][0].props.metadata).toBe(updatedControl);
      expect(result[0][0].props.metadata).not.toBe(staticControl);
    });
  });

  describe('displayRowControls', () => {
    const mockChildProps = { enabled: true };
    const mockRecords = [];

    it('should create Row components for each row of controls', () => {
      const rowControls = [[control1, control2], [control3]];

      const result = displayRowControls(
        rowControls,
        mockRecords,
        mockChildProps,
      );

      expect(result).toHaveLength(2);
    });

    it('should handle isInTable parameter', () => {
      const rowControls = [[control1]];

      const result = displayRowControls(
        rowControls,
        mockRecords,
        mockChildProps,
        true,
      );

      expect(result).toHaveLength(1);
    });

    it('should handle empty controls array', () => {
      const result = displayRowControls([], mockRecords, mockChildProps);

      expect(result).toHaveLength(0);
    });
  });
});
