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
    const currentRecord = this.set(this.updateNode(updatedRecord)).currentRecord;
    this.rootRecord = ControlRecordTreeMgr.update(this.rootRecord, currentRecord);
  }


  updateNode(record) {
    if (record.children) {
      const updatedChild = record.children.map(r => {
        const updatedRecord = r.set('enabled', record.enabled).set('hidden', record.hidden);
        this.updateNode(this.set(updatedRecord).currentRecord);
        return updatedRecord;
      });
      return record.set('children', updatedChild);
    }
    return record;
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
