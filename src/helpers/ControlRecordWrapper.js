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
    if (!this.currentRecord) {
      return;
    }
    const updatedValue = this.currentRecord.setValue(value);
    this.currentRecord = this.currentRecord.set('value', {
      value: updatedValue,
      comment: this.currentRecord.comment,
    });
    this.rootRecord = ControlRecordTreeMgr.update(this.rootRecord, this.currentRecord);
  }

  getEnabled() {
    return this.currentRecord.enabled;
  }

  setEnabled(isEnabled) {
    if (!this.currentRecord) {
      return;
    }
    this.currentRecord = this.currentRecord.set('enabled', isEnabled);
    this.rootRecord = ControlRecordTreeMgr.update(this.rootRecord, this.currentRecord);
  }
}
