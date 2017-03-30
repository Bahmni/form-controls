import ControlRecordWrapper from './ControlRecordWrapper';

export default class FormContext {

  constructor(formRecords) {
    this.wrapper = new ControlRecordWrapper(formRecords);
    this.rootRecord = formRecords;
  }

  getName(recordTree) {
    return recordTree.getConceptName() || recordTree.getLabelName();
  }

  find(recordTree, name) {
    let records = [];
    if (this.getName(recordTree) === name) {
      records.push(recordTree);
    }
    if (recordTree.children) {
      recordTree.children.forEach(r => {
        const filteredRecords = this.find(r, name);
        records = records.concat(filteredRecords);
      });
    }
    return records;
  }

  get(name, index = 0) {
    const currentRecord = this.find(this.rootRecord, name)[index];
    if (!currentRecord) {
      console.warn(`[FormEventHandler] Control with name[${name}] and position[${index}] is not exist`)
    }
    return this.wrapper.set(currentRecord);
  }

  getRecords() {
    return this.wrapper.getRecords();
  }

}
