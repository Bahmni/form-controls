import BooleanControlMapper from "../mapper/BooleanControlMapper";
import CodedControlMapper from "../mapper/CodedControlMapper";

const obsControlMapper = {
  'Boolean': new BooleanControlMapper(),
  'Coded': new CodedControlMapper(),
};

class DatatypeStore {

  getMapper(control) {
    const datatype = control && control.concept && control.concept.datatype;
    return datatype && obsControlMapper[datatype];
  }

}


export default new DatatypeStore();