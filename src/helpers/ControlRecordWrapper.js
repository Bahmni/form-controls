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

  setValue(value, interpretation) {
    const brotherTrees = ControlRecordTreeMgr.getBrothers(this.rootRecord, this.currentRecord);

    brotherTrees.forEach(r => {
      const updatedRecord = r.set('value', {
        value: r.setValue(value, interpretation),
        comment: this.currentRecord.comment,
        interpretation: this.currentRecord.interpretation || interpretation,
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

  hideAndClear() {
    this.setHidden(true);
    this.clearObs();
  }

  setObsValueAndCommentToUndefined(controlRecord) {
    const value = Object.assign(controlRecord.value, { value: undefined, comment: undefined });
    return controlRecord.set('value', value);
  }

  clearObs() {
    const brotherTrees = ControlRecordTreeMgr.getBrothers(this.rootRecord, this.currentRecord);

    brotherTrees.forEach(r => {
      const updatedRecord = this.clearObsValuesAndComment(r);
      this.update(updatedRecord);
    });
  }

  clearObsValuesAndComment(controlRecord) {
    let updatedRecord = controlRecord;
    if (updatedRecord.control.type === 'obsControl') {
      updatedRecord = this.setObsValueAndCommentToUndefined(updatedRecord);
    } else if (updatedRecord.children) {
      const children = updatedRecord.children;
      children.map(child => this.clearObsValuesAndComment(child));
    }
    return updatedRecord;
  }

  isNotesEnabled() {
    if (this.currentRecord && this.currentRecord.control && this.currentRecord.control.properties) {
      return this.currentRecord.control.properties.notes;
    }
    return false;
  }

  getNotes() {
    if (this.currentRecord.control.type !== 'obsControl') {
      return null;
    }
    if (this.currentRecord && this.currentRecord.value && this.currentRecord.value.comment) {
      return this.currentRecord.value.comment;
    }
    return null;
  }

  showNotes(show = true) {
    const brotherTrees = ControlRecordTreeMgr.getBrothers(this.rootRecord, this.currentRecord);
    brotherTrees.forEach(r => {
      if (r.control.type !== 'obsControl' || r.control.properties === undefined) {
        return;
      }
      if (Object.hasOwn(r.control.properties, 'notes')) {
        var control = Object.assign({}, r.control);
        control.properties.notes = show;
        const updatedRecord = r.set('control', control);
        this.update(updatedRecord);
      }
    });
  }

  openNotes() {
    const brotherTrees = ControlRecordTreeMgr.getBrothers(this.rootRecord, this.currentRecord);
    brotherTrees.forEach(r => {
      if (r.control.type !== 'obsControl' || r.control.properties === undefined) {
        return;
      }
      var control = Object.assign({}, r.control);
      control.properties.notesOpen = true;
      const updatedRecord = r.set('control', control);
      this.update(updatedRecord);
    });
  }

  clearNotes() {
    const brotherTrees = ControlRecordTreeMgr.getBrothers(this.rootRecord, this.currentRecord);
    brotherTrees.forEach(r => {
      if (r.control.type !== 'obsControl') {
        return;
      }
      const updatedRecord = r.set('value', Object.assign({}, r.value, { comment: undefined }));
      this.update(updatedRecord);
    });
  }

}
