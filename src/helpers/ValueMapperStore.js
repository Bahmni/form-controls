/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */


class ValueMapperStore {

  constructor() {
    if (!window.valueMapperStore) {
      window.valueMapperStore = this;
      this.mapperList = {};
    }
    return window.valueMapperStore;
  }

  getMapper(control) {
    const dataType = control && control.concept && control.concept.datatype;
    let controlType;
    if (dataType === 'Coded' && control.properties && control.properties.multiSelect) {
      controlType = 'CodedMultiSelect';
    } else {
      controlType = dataType;
    }
    return controlType && this.mapperList[controlType];
  }

  registerValueMapper(type, controlMapper) {
    this.mapperList[type] = controlMapper;
  }

}


export default (new ValueMapperStore);
