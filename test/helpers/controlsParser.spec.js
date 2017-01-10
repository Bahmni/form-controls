import { expect } from 'chai';
import { groupControlsByLocation, sortGroupedControls,
  setupAddRemoveButtonsForAddMore } from 'src/helpers/controlsParser';
import { ControlRecord } from 'src/ControlState';

describe('ControlsParser', () => {
  function getControl(row, column) {
    const control = {
      type: 'someType',
      id: 'someId',
      properties: { location: { row, column } },
    };
    return control;
  }

  let controls;
  let control1;
  let control2;
  let control3;
  let control4;
  let control5;
  before(() => {
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
      const expectedControls = { 1: [control1, control2], 0: [control3, control4], 2: [control5] };
      expect(groupedControls).to.deep.eql(expectedControls);
    });

    it('should return the controls grouped by columns', () => {
      const groupedControls = groupControlsByLocation(controls, 'column');
      const expectedControls = { 0: [control1, control3, control5], 1: [control2], 2: [control4] };
      expect(groupedControls).to.deep.eql(expectedControls);
    });
  });

  describe('sortGroupedControls', () => {
    it('should return the grouped controls sorted in ascending order', () => {
      const groupedControls = groupControlsByLocation(controls, 'row');
      const sortedRows = sortGroupedControls(groupedControls);
      const expectedControls = [[control3, control4], [control1, control2], [control5]];
      expect(sortedRows.length).to.eql(3);
      expect(sortedRows).to.deep.eql(expectedControls);
    });
  });

  describe('setupAddRemoveButtonsForAddMore', () => {
    it('should properly set showAddMore and showRemove properties', () => {
      const controlRecords = [new ControlRecord(), new ControlRecord(), new ControlRecord()];
      const modifiedRecords = setupAddRemoveButtonsForAddMore(controlRecords);

      expect(modifiedRecords[0].showAddMore).to.eql(false);
      expect(modifiedRecords[0].showRemove).to.eql(false);

      expect(modifiedRecords[1].showAddMore).to.eql(false);
      expect(modifiedRecords[1].showRemove).to.eql(true);

      expect(modifiedRecords[2].showAddMore).to.eql(true);
      expect(modifiedRecords[2].showRemove).to.eql(true);
    });
  });
});
