window.componentStore = {
  componentList: {},
  registerComponent(type, component) {
    this.componentList[type.toLowerCase()] = component;
  },
  getRegisteredComponent(type) {
    return this.componentList[type.toLowerCase()];
  },
  deRegisterComponent(type) {
    delete this.componentList[type.toLowerCase()];
  },
};
