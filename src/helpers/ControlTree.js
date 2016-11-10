import set from 'lodash/set';
import map from 'lodash/map';
import forOwn from 'lodash/forOwn';
import { getFormNamespaceDetails } from 'src/helpers/formNamespace';

const formDefinition = "{\"id\":\"fc4e25c1-1bfc-468e-8786-ba1bc133b2c4\",\"uuid\":\"fc4e25c1-1bfc-468e-8786-ba1bc133b2c4\",\"controls\":[{\"type\":\"obsControl\",\"label\":{\"type\":\"label\",\"value\":\"Pulse\"},\"properties\":{\"mandatory\":true,\"location\":{\"column\":0,\"row\":0},\"allowDecimals\":true},\"id\":\"1\",\"concept\":{\"name\":\"Pulse\",\"uuid\":\"c36bc411-3f10-11e4-adec-0800271c1b75\",\"datatype\":\"Numeric\"}},{\"type\":\"obsControl\",\"label\":{\"type\":\"label\",\"value\":\"Temp(c)\"},\"properties\":{\"mandatory\":false,\"location\":{\"column\":1,\"row\":1},\"allowDecimals\":true},\"id\":\"2\",\"concept\":{\"name\":\"Temperature\",\"uuid\":\"c37bd733-3f10-11e4-adec-0800271c1b75\",\"datatype\":\"Numeric\"}},{\"options\":[{\"name\":\"Yes\",\"value\":true},{\"name\":\"No\",\"value\":false}],\"displayType\":\"button\",\"type\":\"obsControl\",\"label\":{\"type\":\"label\",\"value\":\"Smoking History\"},\"properties\":{\"mandatory\":true,\"location\":{\"column\":2,\"row\":2}},\"id\":\"3\",\"concept\":{\"name\":\"Smoking History\",\"uuid\":\"c2a43174-c9db-4e54-8516-17372c83537f\",\"datatype\":\"Boolean\"}},{\"type\":\"label\",\"value\":\"test\",\"properties\":{\"location\":{\"column\":0,\"row\":3}},\"id\":\"4\"}]}"

const regexp = new RegExp('\/','g')

export default class ControlTree {
  constructor(formDefinition, observations) {
    this.formDefinition = formDefinition;
    this.dataBus = {};
    this.initialize(formDefinition.controls);
    // this._setInitialObsData(observations);
    console.log("databus: \n", this.dataBus);
  }
  
  //parent ID can be parsed from the parentPath.
  // TODO: initialize the obs also
  initialize(controls, parentId, parentPath = '') {
    controls.forEach((control) => {
      const path = this._generatePath(parentPath, control.id);
      this.dataBus[control.id] = new node(parentId, path, control.type);
      if (control.controls) {
        this.initialize(control.controls, control.id, path);//for children
      }
    });
  }

  _generatePath(parentPath = '', controlID) {
    if (parentPath) {
      return `${parentPath}.${controlID}`;
    }
    return `${controlID}`
  }

  _setInitialObsData(observations = []) {
    // Mappers based on type can be used to make this generic
    observations.forEach((observation) => {
      if (observation.groupMembers) {
        this._setInitialObsData(observation.groupMembers);
      }
      const { controlId } = getFormNamespaceDetails(observation.formNamespace);
      this.dataBus[controlId].data = observation;
    });
  }

  getObs() {
    
  }

  getData(controlID) {}

  setData(controlID, data) {
    this.dataBus[controlID].data = data;
    //notify container
    this._notifyContainer(controlID);
  }

  //container can be passed the node itself or the controlID
  _notifyContainer(controlID) {}

  getError(controlID) {}

  setError(controlID) {}

  registerControl(controlId, dataEventCb, errorEventCb) {
    this.dataBus[controlId].dataCb = dataEventCb;
    this.dataBus[controlId].errorCb = errorEventCb;
  }

  registerContainer(containerCB) {}
}

class node {
  constructor(parentID, path, type) {
    this.parentID = parentID;
    this.type = type;
    this.path = path;
    this.data = undefined;
  }

  getParentID() {
    return this.parentID;
  }

  getData() {
    
  }

  static comparator(pathA, pathB) {
    if (pathA < pathB) return -1;
    if (pathA > pathB) return 1;
    return 0;
  }
}

export class BahmniError{
  constructor(code, msg, src) {
    this.code = code;
    this.msg = msg;
    this.src = src;
  }
  set(code = this.code, msg = this.msg, src = this.src){}
  get(){}
}
