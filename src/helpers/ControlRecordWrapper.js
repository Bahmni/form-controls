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
    this.currentRecord = this.currentRecord.set('value', {
      value,
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
    this.update();
  }

  setHidden(hidden){
    if (!this.currentRecord){
      return;
    }
    this.currentRecord = this.currentRecord.set('hidden', hidden);
    this.update();
  }

  update() {
    this.rootRecord = ControlRecordTreeMgr.update(this.rootRecord, this.currentRecord);
  }
}
