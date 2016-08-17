import _ from 'lodash';

window.componentStore = {
  componentList: {},
  registerComponent(type, component) {
    this.componentList[type] = component;
  },
  getRegisteredComponent(type) {
    return _.get(this.componentList, type, undefined);
  },
  deRegisterComponent(type) {
    delete this.componentList[type];
  },
};
