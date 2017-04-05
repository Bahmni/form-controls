/*
  It's a temporary way to put the import here.
  so that register in value mapper will be triggered.
*/

/* eslint-disable */
import { BooleanValueMapper } from '../mapper/BooleanValueMapper';
import { CodedValueMapper } from '../mapper/CodedValueMapper';

class ComponentStore {
  constructor() {
    if (!window.componentStore) {
      window.componentStore = this;
      this.componentList = {};
      this.designerComponentList = {};
    }
    return window.componentStore;
  }

  registerComponent(type, component) {
    this.componentList[type.toLowerCase()] = component;
  }

  getRegisteredComponent(type) {
    return this.componentList[type.toLowerCase()];
  }

  deRegisterComponent(type) {
    delete this.componentList[type.toLowerCase()];
  }

  getAllRegisteredComponents() {
    return this.componentList;
  }

  registerDesignerComponent(type, component) {
    this.designerComponentList[type.toLowerCase()] = component;
  }

  getDesignerComponent(type) {
    return this.designerComponentList[type.toLowerCase()];
  }

  getAllDesignerComponents() {
    return this.designerComponentList;
  }

  deRegisterDesignerComponent(type) {
    delete this.designerComponentList[type.toLowerCase()];
  }
}

export default (new ComponentStore);
