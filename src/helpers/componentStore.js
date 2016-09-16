window.componentStore = {
  componentList: {},
  designerComponentList: {},
  registerComponent(type, component) {
    this.componentList[type.toLowerCase()] = component;
  },
  getRegisteredComponent(type) {
    return this.componentList[type.toLowerCase()];
  },
  deRegisterComponent(type) {
    delete this.componentList[type.toLowerCase()];
  },
  getAllRegisteredComponents() {
    return this.componentList;
  },
  registerDesignerComponent(type, component) {
    this.designerComponentList[type.toLowerCase()] = component;
  },
  getDesignerComponent(type) {
    return this.designerComponentList[type.toLowerCase()];
  },
  getAllDesignerComponents() {
    return this.designerComponentList;
  },
  deRegisterDesignerComponent(type) {
    delete this.designerComponentList[type.toLowerCase()];
  },
};
