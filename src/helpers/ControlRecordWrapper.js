import ControlRecordTreeMgr from './ControlRecordTreeMgr';

export default class ControlRecordWrapper {

  constructor(rootRecord) {
    this.rootRecord = rootRecord;
  }

  set(currentRecord) {
    this.currentRecord = currentRecord;
    return this;
  }

  getRecords() {
    return this.rootRecord;
  }

  getValue() {
    return this.currentRecord.getValue();
  }

  setValue(value) {
    const brotherTrees = ControlRecordTreeMgr.getBrothers(this.rootRecord, this.currentRecord);

    brotherTrees.forEach(r => {
      const updatedValue = r.setValue(value);
      this.currentRecord = r.set('value', {
        value: updatedValue,
        comment: this.currentRecord.comment,
      });
      this.rootRecord = ControlRecordTreeMgr.update(this.rootRecord, this.currentRecord);
    });
  }

  getEnabled() {
    return this.currentRecord.enabled;
  }

  setEnabled(isEnabled) {
    const brotherTrees = ControlRecordTreeMgr.getBrothers(this.rootRecord, this.currentRecord);

    brotherTrees.forEach(r => {
      this.currentRecord = r.set('enabled', isEnabled);
      this.rootRecord = ControlRecordTreeMgr.update(this.rootRecord, this.currentRecord);
    });
  }
}
