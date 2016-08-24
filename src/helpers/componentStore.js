import get from 'lodash/get';

window.componentStore = {
  componentList: {},
  registerComponent(type, component) {
    this.componentList[type.toLowerCase()] = component;
  },
  getRegisteredComponent(type) {
    return get(this.componentList, type.toLowerCase(), undefined);
  },
  deRegisterComponent(type) {
    delete this.componentList[type.toLowerCase()];
  },
};
