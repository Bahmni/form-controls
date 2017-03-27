import ControlRecordWrapper from './ControlRecordWrapper';

export default class FormContext {

  constructor(formRecords) {
    this.wrapper = new ControlRecordWrapper(formRecords);
    this.rootRecord = formRecords;
  }

  find(recordTree, conceptName) {
    let records = [];
    if (recordTree.getConceptName() === conceptName) {
      records.push(recordTree);
    }
    if (recordTree.children) {
      recordTree.children.forEach(r => {
        const filteredRecords = this.find(r, conceptName);
        records = records.concat(filteredRecords);
      });
    }
    return records;
  }

  get(conceptName, position = 0) {
    const currentRecord = this.find(this.rootRecord, conceptName)[position];
    return this.wrapper.set(currentRecord);
  }

  getRecords() {
    return this.wrapper.getRecords();
  }

}
