import ControlRecordWrapper from './ControlRecordWrapper';

export default class FormContext {

  constructor(formRecords, patient) {
    this.wrapper = new ControlRecordWrapper(formRecords);
    this.rootRecord = formRecords;
    this.patient = patient;
  }

  getName(recordTree) {
    return recordTree.getConceptName() || recordTree.getLabelName();
  }

  getId(recordTree) {
    return recordTree.getControlId();
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
      const message = `name[${name}] and position[${index}]`;
      /* eslint-disable */
      console.warn(`[FormEventHandler] Control with ${message} is not exist`);
    }
    return this.wrapper.set(currentRecord);
  }

  findById(recordTree, id) {
    let records = [];
    const controlId = this.getId(recordTree);
    if (controlId && parseInt(controlId) === id) {
      records.push(recordTree);
    }
    if (recordTree.children) {
      recordTree.children.forEach(r => {
        const filteredRecords = this.findById(r, id);
        records = records.concat(filteredRecords);
      });
    }
    return records;
  }

  getPatient() {
    return this.patient;
  }

  getById(id) {
    const currentRecord = this.findById(this.rootRecord, id)[0];
    if (!currentRecord) {
      const message = `id - ${id}`;
      /* eslint-disable */
      console.warn(`[FormEventHandler] Control with ${message} does not exist`);
    }
    return this.wrapper.set(currentRecord);
  }

  getRecords() {
    return this.wrapper.getRecords();
  }

}
