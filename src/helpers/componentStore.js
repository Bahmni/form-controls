/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */


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
