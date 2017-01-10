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

export default (new ComponentStore());
