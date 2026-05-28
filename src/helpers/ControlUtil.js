/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import isEmpty from 'lodash/isEmpty';
import _ from 'lodash';

export function isAnyAncestorOrControlHasAddMore(control, parentFormFieldPath) {
  if (parentFormFieldPath) {
    return true;
  }
  return _.has(control, 'properties.addMore') ? control.properties.addMore : false;
}

export function getCurrentFormFieldPathIfAddMore(formName, formVersion, control,
                                                 parentFormFieldPath) {
  if (!isEmpty(parentFormFieldPath)) {
    return `${parentFormFieldPath}/${control.id}-0`;
  }
  return control.properties.addMore ? `${formName}.${formVersion}/${control.id}-0` : '';
}

