
class ValueMapperStore {

  constructor() {
    if (!window.valueMapperStore) {
      window.valueMapperStore = this;
      this.mapperList = {};
    }
    return window.valueMapperStore;
  }

  getMapper(control) {
    const datatype = control && control.concept && control.concept.datatype;
    return datatype && this.mapperList[datatype];
  }

  registerValueMapper(type, controlMapper) {
    this.mapperList[type] = controlMapper;
  }

}


export default (new ValueMapperStore);
