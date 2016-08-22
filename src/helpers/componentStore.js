import get from 'lodash/get';

window.componentStore = {
  componentList: {},
  registerComponent(type, component) {
    this.componentList[type] = component;
  },
  getRegisteredComponent(type) {
    return get(this.componentList, type, undefined);
  },
  deRegisterComponent(type) {
    delete this.componentList[type];
  },
};
