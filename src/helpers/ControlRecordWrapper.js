import ControlRecordTreeMgr from './ControlRecordTreeMgr';

export default class ControlRecordWrapper {

  constructor(rootRecord) {
    this.rootRecord = rootRecord;
  }

  set(currentRecord) {
    this.currentRecord = currentRecord;
    return this;
  }

  update(updatedRecord) {
    const currentRecord = this.set(updatedRecord).currentRecord;
    this.rootRecord = ControlRecordTreeMgr.update(this.rootRecord, currentRecord);
  }

  getRecords() {
    return this.rootRecord;
  }

  getValue() {
    return this.currentRecord && this.currentRecord.getValue();
  }

  setValue(value) {
    const brotherTrees = ControlRecordTreeMgr.getBrothers(this.rootRecord, this.currentRecord);

    brotherTrees.forEach(r => {
      const updatedRecord = r.set('value', {
        value: r.setValue(value),
        comment: this.currentRecord.comment,
      });
      this.update(updatedRecord);
    });
  }

  getEnabled() {
    return this.currentRecord && this.currentRecord.enabled;
  }

  setEnabled(isEnabled) {
    const brotherTrees = ControlRecordTreeMgr.getBrothers(this.rootRecord, this.currentRecord);

    brotherTrees.forEach(r => {
      const updatedRecord = r.set('enabled', isEnabled);
      this.update(updatedRecord);
    });
  }

  getHidden() {
    return this.currentRecord && this.currentRecord.hidden;
  }

  setHidden(hidden) {
    const brotherTrees = ControlRecordTreeMgr.getBrothers(this.rootRecord, this.currentRecord);

    brotherTrees.forEach(r => {
      const updatedRecord = r.set('hidden', hidden);
      this.update(updatedRecord);
    });
  }
}
