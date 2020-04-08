
class ValueMapperStore {

  constructor() {
    if (!window.valueMapperStore) {
      window.valueMapperStore = this;
      this.mapperList = {};
    }
    return window.valueMapperStore;
  }

  getMapper(control) {
    const dataType = control && control.concept && control.concept.datatype;
    let controlType;
    if (dataType === 'Coded' && control.properties && control.properties.multiSelect) {
      controlType = 'CodedMultiSelect';
    } else {
      controlType = dataType;
    }
    return controlType && this.mapperList[controlType];
  }

  registerValueMapper(type, controlMapper) {
    this.mapperList[type] = controlMapper;
  }

}


export default (new ValueMapperStore);
